<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
	import { MAP_CONFIG as DEFAULT_MAP_CONFIG, BACKGROUND_COLORS, provinceColors, provinceNames, regionGroups } from '$lib/config';
	import { log } from '$lib/utils/logger';
	
	const dispatch = createEventDispatcher();
	
	// Custom config prop (optional)
	export let config = null;
	
	// Use custom config or default
	$: MAP_CONFIG = config || DEFAULT_MAP_CONFIG;
	
	let container;
	let scene, camera, renderer, controls, composer, bloomPass;
	let provinces = [];
	let waterBodies = [];
	let hoveredProvince = null;
	let autoRotate = false;
	let waterVisible = true;
	let provincesVisible = true;
	let svgData = '';
	
	// Light references for real-time updates
	let ambientLight, directionalLight, rimLight1, rimLight2, rimLight3;
	
	// Animation tracking
	let activeAnimations = new Map();
	
	// Export control functions
	export function toggleRotation() {
		autoRotate = !autoRotate;
		if (controls) {
			controls.autoRotate = autoRotate;
		}
		return autoRotate;
	}

	export function resetView() {
		if (!camera || !controls) return;
		camera.position.x = 0;
		camera.position.y = 500;
		camera.position.z = 800;
		controls.target.set(0, 0, 0);
	}

	export function zoomIn() {
		if (!camera) return;
		camera.position.y *= 0.85;
		camera.position.z *= 0.85;
	}

	export function zoomOut() {
		if (!camera) return;
		camera.position.y *= 1.15;
		camera.position.z *= 1.15;
	}

	export function updateSize() {
		if (!container || !camera || !renderer || !composer) return;
		const width = container.clientWidth;
		const height = container.clientHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
		composer.setSize(width, height);
	}

	export function toggleWater() {
		waterVisible = !waterVisible;
		waterBodies.forEach(w => {
			w.mesh.visible = waterVisible;
			if (w.overlayMesh) w.overlayMesh.visible = waterVisible;
		});
		return waterVisible;
	}

	export function showOnlyWater() {
		if (provincesVisible) {
			provinces.forEach(p => {
				p.mesh.visible = false;
				if (p.overlayMesh) p.overlayMesh.visible = false;
			});
			waterBodies.forEach(w => {
				w.mesh.visible = true;
				if (w.overlayMesh) w.overlayMesh.visible = true;
			});
			provincesVisible = false;
			waterVisible = true;
		} else {
			provinces.forEach(p => {
				p.mesh.visible = true;
				if (p.overlayMesh) p.overlayMesh.visible = true;
			});
			waterBodies.forEach(w => {
				w.mesh.visible = true;
				if (w.overlayMesh) w.overlayMesh.visible = true;
			});
			provincesVisible = true;
			waterVisible = true;
		}
		return { provincesVisible, waterVisible };
	}

	export function fixProvincePositions() {
		let fixed = 0;
		provinces.forEach(p => {
			// Reset to original position
			if (Math.abs(p.mesh.position.y) > 0.1) {
				p.mesh.position.y = 0;
				if (p.overlayMesh) p.overlayMesh.position.y = 0.1;
				fixed++;
			}
			// Reset scale to 1
			if (p.mesh.scale.x !== 1 || p.mesh.scale.y !== 1 || p.mesh.scale.z !== 1) {
				p.mesh.scale.set(1, 1, 1);
				if (p.overlayMesh) p.overlayMesh.scale.set(1, 1, 1);
				fixed++;
			}
			// Reset materials to normal state
			p.mesh.material.opacity = MAP_CONFIG.provinces.defaultOpacity;
			p.mesh.material.emissiveIntensity = MAP_CONFIG.provinces.defaultEmissiveIntensity;
			if (p.wireframe) p.wireframe.material.opacity = MAP_CONFIG.provinces.borderOpacity;
			p.mesh.material.needsUpdate = true;
		});
		// Clear current hover
		hoveredProvince = null;
		log(`✅ ${fixed} provinces reset to original position`);
		return fixed;
	}

	// Update background colors in real-time
	export function updateBackgroundColor(type, hexColor) {
		log(`🎨 updateBackgroundColor: type=${type}, color=${hexColor}`);
		if (!scene) {
			log(`⚠️ Scene not initialized yet`);
			return;
		}
		
		if (type === 'primary') {
			scene.background = new THREE.Color(hexColor);
			scene.fog.color = new THREE.Color(hexColor);
			log(`✅ Scene background and fog updated to ${hexColor}`);
		}
	}

	// Update region colors in real-time
	export function updateRegionColor(regionKey, hexColor) {
		const color = parseInt(hexColor.replace('#', ''), 16);
		
		// Update config
		if (regionGroups[regionKey]) {
			regionGroups[regionKey].color = color;
			
			// Update provinceColors
			regionGroups[regionKey].provinces.forEach(prov => {
				provinceColors[prov] = color;
			});
			
			// Update existing provinces
			provinces.forEach(p => {
				if (regionGroups[regionKey].provinces.includes(p.id)) {
					p.color = color;
					p.mesh.material.emissive.setHex(color);
					if (p.wireframe) {
						p.wireframe.material.color.setHex(color);
					}
					p.mesh.material.needsUpdate = true;
				}
			});
			
			log(`✅ رنگ منطقه ${regionKey} تغییر کرد`);
		}
	}
	
	// Update individual province color in real-time
	export function updateProvinceColor(provinceKey, hexColor) {
		const color = parseInt(hexColor.replace('#', ''), 16);
		
		// Update provinceColors
		provinceColors[provinceKey] = color;
		
		// Update existing province
		provinces.forEach(p => {
			if (p.id === provinceKey) {
				p.color = color;
				p.mesh.material.emissive.setHex(color);
				p.mesh.material.color.setHex(color);
				if (p.wireframe) {
					p.wireframe.material.color.setHex(color);
				}
				p.mesh.material.needsUpdate = true;
				
				log(`✅ رنگ استان ${provinceKey} تغییر کرد`);
			}
		});
	}
	
	// Update water colors in real-time
	export function updateWaterColor(waterKey, hexColor) {
		const color = parseInt(hexColor.replace('#', ''), 16);
		MAP_CONFIG.waterColors[waterKey] = color;
		
		// Map config keys to actual water body IDs
		const idMap = {
			'caspian': 'caspian',
			'southWaters': 'south-waters',
			'urmia': 'urmia',
			'jazmourian': 'jazmourian'
		};
		
		const actualId = idMap[waterKey] || waterKey;
		
		// Update existing water bodies
		waterBodies.forEach(w => {
			if (w.id === actualId) {
				w.mesh.material.emissive.setHex(color);
				w.mesh.material.color.setHex(color);
				if (w.mesh.children && w.mesh.children[0]) {
					w.mesh.children[0].material.color.setHex(color);
				}
				w.mesh.material.needsUpdate = true;
				
				// Update overlay pattern
				if (w.overlayMesh && w.overlayMesh.material.map) {
					const canvas = document.createElement('canvas');
					canvas.width = 256;
					canvas.height = 256;
					const ctx = canvas.getContext('2d');
					ctx.fillStyle = 'rgba(0,0,0,0)';
					ctx.fillRect(0, 0, 256, 256);
					
					const r = (color >> 16) & 255;
					const g = (color >> 8) & 255;
					const b = color & 255;
					
					ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${MAP_CONFIG.water.patternLineOpacity})`;
					ctx.lineWidth = 1;
					
					for (let i = -256; i < 512; i += MAP_CONFIG.water.patternLineSpacing) {
						ctx.beginPath();
						ctx.moveTo(i, 0);
						ctx.lineTo(i + 256, 256);
						ctx.stroke();
					}
					
					for (let x = 0; x < 256; x += MAP_CONFIG.water.patternDotSpacing) {
						for (let y = 0; y < 256; y += MAP_CONFIG.water.patternDotSpacing) {
							const distFromCenter = Math.sqrt(Math.pow(x - 128, 2) + Math.pow(y - 128, 2)) / 128;
							const opacity = MAP_CONFIG.water.patternDotOpacity * (1 - distFromCenter * 0.5);
							
							ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
							ctx.beginPath();
							ctx.arc(x, y, 0.8, 0, Math.PI * 2);
							ctx.fill();
						}
					}
					
					const texture = new THREE.CanvasTexture(canvas);
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set(MAP_CONFIG.water.patternRepeat, MAP_CONFIG.water.patternRepeat);
					
					w.overlayMesh.material.map = texture;
					w.overlayMesh.material.needsUpdate = true;
				}
				
				log(`✅ رنگ ${waterKey} تغییر کرد`);
			}
		});
	}

	// Apply config changes in real-time
	export function applyConfigChanges(path, value) {
		log(`🔧 applyConfigChanges called: path=${path}, value=${value}`);
		if (!scene) {
			log(`⚠️ Scene not initialized yet`);
			return;
		}
		
		// Background settings
		if (path === 'background.vignette') {
			log(`🌫️ Updating vignette to ${value}`);
			if (typeof document !== 'undefined') {
				document.documentElement.style.setProperty('--vignette-opacity', value.toString());
				document.body.style.setProperty('--vignette-opacity', value.toString());
				log(`✅ Vignette updated to ${value}`);
			}
		}
		// Bloom settings
		else if (path.startsWith('bloom.')) {
			if (bloomPass) {
				if (path === 'bloom.strength') bloomPass.strength = value;
				else if (path === 'bloom.radius') bloomPass.radius = value;
				else if (path === 'bloom.threshold') bloomPass.threshold = value;
			}
		}
		// Camera settings
		else if (path.startsWith('camera.')) {
			if (camera) {
				if (path === 'camera.fov') {
					camera.fov = value;
					camera.updateProjectionMatrix();
				} else if (path === 'camera.positionY') {
					camera.position.y = value;
				} else if (path === 'camera.positionZ') {
					camera.position.z = value;
				} else if (path === 'camera.autoRotateSpeed' && controls) {
					controls.autoRotateSpeed = value;
				}
			}
		}
		// Lighting settings
		else if (path.startsWith('lighting.')) {
			if (path === 'lighting.ambientIntensity' && ambientLight) {
				ambientLight.intensity = value;
			} else if (path === 'lighting.directionalIntensity' && directionalLight) {
				directionalLight.intensity = value;
			} else if (path === 'lighting.rimLight1Intensity' && rimLight1) {
				rimLight1.intensity = value;
			} else if (path === 'lighting.rimLight2Intensity' && rimLight2) {
				rimLight2.intensity = value;
			} else if (path === 'lighting.rimLight3Intensity' && rimLight3) {
				rimLight3.intensity = value;
			}
		}
		// Province settings (excluding hover and pattern which need rebuild)
		else if (path.startsWith('provinces.')) {
			provinces.forEach(p => {
				// Material properties
				if (path === 'provinces.defaultOpacity') {
					p.mesh.material.opacity = value;
				} else if (path === 'provinces.defaultEmissiveIntensity') {
					p.mesh.material.emissiveIntensity = value;
				} else if (path === 'provinces.metalness') {
					p.mesh.material.metalness = value;
				} else if (path === 'provinces.roughness') {
					p.mesh.material.roughness = value;
				} else if (path === 'provinces.clearcoat') {
					p.mesh.material.clearcoat = value;
				} else if (path === 'provinces.clearcoatRoughness') {
					p.mesh.material.clearcoatRoughness = value;
				} else if (path === 'provinces.reflectivity') {
					p.mesh.material.reflectivity = value;
				}
				// Border properties
				else if (path === 'provinces.borderOpacity' && p.wireframe) {
					p.wireframe.material.opacity = value;
				} else if (path === 'provinces.borderWidth' && p.wireframe) {
					p.wireframe.material.linewidth = value;
				} else if (path === 'provinces.borderOnTopOnly' && p.wireframe) {
					p.wireframe.material.depthTest = !value;
					p.wireframe.material.needsUpdate = true;
				}
				// Extrude depth (scale.z because mesh is rotated)
				else if (path === 'provinces.extrudeDepth') {
					const baseDepth = 35;
					const scaleZ = value / baseDepth;
					p.mesh.scale.z = scaleZ;
					if (p.overlayMesh) p.overlayMesh.scale.z = scaleZ;
				}
				// Note: hover and pattern settings require page refresh
				p.mesh.material.needsUpdate = true;
			});
		}
		// Water settings
		else if (path.startsWith('water.')) {
			waterBodies.forEach(w => {
				if (path === 'water.opacity') {
					w.mesh.material.opacity = value;
				} else if (path === 'water.emissiveIntensity') {
					w.mesh.material.emissiveIntensity = value;
				} else if (path === 'water.clearcoat') {
					w.mesh.material.clearcoat = value;
				} else if (path === 'water.borderOpacity') {
					w.mesh.children.forEach(child => {
						if (child instanceof THREE.LineSegments) {
							child.material.opacity = value;
						}
					});
				} else if (path === 'water.borderOnTopOnly') {
					w.mesh.children.forEach(child => {
						if (child instanceof THREE.LineSegments) {
							child.material.depthTest = !value;
							child.material.needsUpdate = true;
						}
					});
				} else if (path === 'water.extrudeDepth') {
					const baseDepth = 35;
					const scaleZ = value / baseDepth;
					w.mesh.scale.z = scaleZ;
					if (w.overlayMesh) w.overlayMesh.scale.z = scaleZ;
				}
				w.mesh.material.needsUpdate = true;
			});
		}
	}
	
	onMount(async () => {
		log('🚀 IranMap3D mounted');
		
		// Initialize scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(BACKGROUND_COLORS.primary);
		scene.fog = new THREE.FogExp2(BACKGROUND_COLORS.primary, 0.0002);
		
		// Initialize camera
		camera = new THREE.PerspectiveCamera(
			MAP_CONFIG.camera.fov,
			container.clientWidth / container.clientHeight,
			MAP_CONFIG.camera.near,
			MAP_CONFIG.camera.far
		);
		camera.position.set(
			MAP_CONFIG.camera.positionX,
			MAP_CONFIG.camera.positionY,
			MAP_CONFIG.camera.positionZ
		);
		
		// Initialize renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(renderer.domElement);
		
		// Initialize controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.minDistance = MAP_CONFIG.camera.minDistance;
		controls.maxDistance = MAP_CONFIG.camera.maxDistance;
		controls.maxPolarAngle = Math.PI / 2.1;
		controls.autoRotate = true;
		controls.autoRotateSpeed = MAP_CONFIG.camera.autoRotateSpeed;
		
		// Set camera target (where camera looks at)
		if (MAP_CONFIG.camera.targetX !== undefined) {
			controls.target.set(
				MAP_CONFIG.camera.targetX,
				MAP_CONFIG.camera.targetY || 0,
				MAP_CONFIG.camera.targetZ || 0
			);
		}
		
		// Setup lights
		setupLights();
		
		// Setup post-processing
		setupPostProcessing();
		
		// Load SVG if not provided
		if (!svgData) {
			log('📥 Fetching SVG...');
			try {
				const response = await fetch('/iran.svg');
				svgData = await response.text();
				log('✅ SVG loaded, length:', svgData.length);
			} catch (error) {
				log('❌ Failed to load SVG:', error);
			}
		}
		
		// Load map
		if (svgData) {
			loadMapFromSVG(svgData);
		} else {
			log('❌ No SVG data available');
		}
		
		// Animation loop
		function animate() {
			requestAnimationFrame(animate);
			controls.autoRotate = autoRotate;
			controls.update();
			composer.render();
		}
		animate();
		
		// Handle resize
		function handleResize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
			composer.setSize(container.clientWidth, container.clientHeight);
		}
		window.addEventListener('resize', handleResize);
		
		// Handle raycasting for hover & click
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		
		// Animation helper function with cancellation support
		function animateProvince(province, targetY, targetOpacity, targetEmissive, targetScale, duration) {
			// Cancel any existing animation for this province
			if (activeAnimations.has(province.id)) {
				cancelAnimationFrame(activeAnimations.get(province.id));
				activeAnimations.delete(province.id);
			}
			
			const startY = province.mesh.position.y;
			const startOpacity = province.mesh.material.opacity;
			const startEmissive = province.mesh.material.emissiveIntensity;
			const startScale = province.mesh.scale.x;
			const startTime = performance.now();
			
			function animate() {
				const elapsed = performance.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				
				// Easing function (ease-out-cubic)
				const eased = 1 - Math.pow(1 - progress, 3);
				
				province.mesh.position.y = startY + (targetY - startY) * eased;
				province.mesh.material.opacity = startOpacity + (targetOpacity - startOpacity) * eased;
				province.mesh.material.emissiveIntensity = startEmissive + (targetEmissive - startEmissive) * eased;
				
				const scale = startScale + (targetScale - startScale) * eased;
				province.mesh.scale.set(scale, scale, scale);
				
				province.mesh.material.needsUpdate = true;
				
				if (progress < 1) {
					const animId = requestAnimationFrame(animate);
					activeAnimations.set(province.id, animId);
				} else {
					// Animation complete, remove from tracking
					activeAnimations.delete(province.id);
				}
			}
			
			const animId = requestAnimationFrame(animate);
			activeAnimations.set(province.id, animId);
		}
		
		function updatePointerFromEvent(event) {
			if (!container) return null;
			const rect = container.getBoundingClientRect();
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			return raycaster.intersectObjects(provinces.map(p => p.mesh));
		}

		function onMouseMove(event) {
			const intersects = updatePointerFromEvent(event);
			if (!intersects) return;
			
			if (intersects.length > 0) {
				const intersected = intersects[0].object;
				const province = provinces.find(p => p.mesh === intersected);
				
				if (province && province !== hoveredProvince) {
					// Reset ALL provinces first to ensure only one is hovered
					provinces.forEach(p => {
						if (p !== province && p !== hoveredProvince) {
							// Force reset any province that might be stuck
							if (activeAnimations.has(p.id)) {
								cancelAnimationFrame(activeAnimations.get(p.id));
								activeAnimations.delete(p.id);
							}
							p.mesh.position.y = 0;
							p.mesh.material.opacity = MAP_CONFIG.provinces.defaultOpacity;
							p.mesh.material.emissiveIntensity = MAP_CONFIG.provinces.defaultEmissiveIntensity;
							p.mesh.scale.set(1, 1, 1);
							if (p.wireframe) {
								p.wireframe.material.opacity = MAP_CONFIG.provinces.borderOpacity;
							}
							p.mesh.material.needsUpdate = true;
						}
					});
					
					// Reset previous hover with animation
					if (hoveredProvince) {
						animateProvince(
							hoveredProvince,
							0,
							MAP_CONFIG.provinces.defaultOpacity,
							MAP_CONFIG.provinces.defaultEmissiveIntensity,
							1,
							MAP_CONFIG.provinces.resetAnimationDuration
						);
						if (hoveredProvince.wireframe) {
							hoveredProvince.wireframe.material.opacity = MAP_CONFIG.provinces.borderOpacity;
						}
					}
					
					// Apply hover effect with animation
					hoveredProvince = province;
					animateProvince(
						province,
						MAP_CONFIG.provinces.hoverHeight,
						MAP_CONFIG.provinces.hoverOpacity,
						MAP_CONFIG.provinces.hoverEmissiveIntensity,
						MAP_CONFIG.provinces.hoverScale,
						MAP_CONFIG.provinces.hoverAnimationDuration
					);
					if (province.wireframe) {
						province.wireframe.material.opacity = MAP_CONFIG.provinces.hoverBorderOpacity || 1;
					}
					
					// Dispatch event to update province info
					dispatch('provinceHover', {
						name: province.name,
						color: province.color
					});
				}
			} else if (hoveredProvince) {
				// Reset hover when mouse leaves with animation
				animateProvince(
					hoveredProvince,
					0,
					MAP_CONFIG.provinces.defaultOpacity,
					MAP_CONFIG.provinces.defaultEmissiveIntensity,
					1,
					MAP_CONFIG.provinces.resetAnimationDuration
				);
				if (hoveredProvince.wireframe) {
					hoveredProvince.wireframe.material.opacity = MAP_CONFIG.provinces.borderOpacity;
				}
				hoveredProvince = null;
				
				// Dispatch event to reset province info
				dispatch('provinceHover', null);
			}
		}
		
		function onClick(event) {
			const intersects = updatePointerFromEvent(event);
			if (!intersects || intersects.length === 0) return;
			const intersected = intersects[0].object;
			const province = provinces.find(p => p.mesh === intersected);
			if (province) {
				dispatch('provinceSelect', {
					name: province.name,
					color: province.color
				});
			}
		}

		window.addEventListener('mousemove', onMouseMove);
		container?.addEventListener('click', onClick, { passive: true });
		
		return () => {
			// Cancel all active animations
			activeAnimations.forEach(animId => cancelAnimationFrame(animId));
			activeAnimations.clear();
			
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', onMouseMove);
			container?.removeEventListener('click', onClick);
			renderer.dispose();
		};
	});
	
	function setupLights() {
		// نور محیطی یکنواخت
		ambientLight = new THREE.AmbientLight(0xffffff, MAP_CONFIG.lighting.ambientIntensity);
		scene.add(ambientLight);
		
		// نور اصلی از بالا - برای روشن کردن سطوح
		directionalLight = new THREE.DirectionalLight(0xffffff, MAP_CONFIG.lighting.directionalIntensity);
		directionalLight.position.set(0, 800, 0);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
		
		// نورهای لبه - از فاصله دورتر و ارتفاع بیشتر برای یکنواختی
		rimLight1 = new THREE.PointLight(0xff0055, MAP_CONFIG.lighting.rimLight1Intensity, 2000);
		rimLight1.position.set(-800, 300, -400);
		scene.add(rimLight1);
		
		rimLight2 = new THREE.PointLight(0x00ffff, MAP_CONFIG.lighting.rimLight2Intensity, 2000);
		rimLight2.position.set(800, 300, -400);
		scene.add(rimLight2);
		
		rimLight3 = new THREE.PointLight(0xffff00, MAP_CONFIG.lighting.rimLight3Intensity, 2000);
		rimLight3.position.set(0, 300, 600);
		scene.add(rimLight3);
	}
	
	function setupPostProcessing() {
		composer = new EffectComposer(renderer);
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);
		
		bloomPass = new UnrealBloomPass(
			new THREE.Vector2(container.clientWidth, container.clientHeight),
			MAP_CONFIG.bloom.strength,
			MAP_CONFIG.bloom.radius,
			MAP_CONFIG.bloom.threshold
		);
		composer.addPass(bloomPass);
	}
	
	function loadMapFromSVG(svgString) {
		log('🗺️ Loading SVG map...');
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, 'image/svg+xml');
		
		// Load provinces
		const pathElements = doc.querySelectorAll('.province path');
		log(`📍 Found ${pathElements.length} province paths`);
		
		let loadedCount = 0;
		pathElements.forEach(pathEl => {
			const className = pathEl.getAttribute('class');
			const pathData = pathEl.getAttribute('d');
			
			if (provinceColors[className] && pathData) {
				log(`✅ Loading province: ${className}`);
				createProvinceFromPath(className, pathData, provinceColors[className]);
				loadedCount++;
			} else {
				log(`⚠️ Skipping province: ${className} (no color or path data)`);
			}
		});
		
		log(`✨ Loaded ${loadedCount} provinces successfully`);
		
		// Load water bodies
		loadWaterBodies(doc);
		
		// Center map
		centerMap();
	}
	
	function loadWaterBodies(doc) {
		log('🌊 Loading water bodies...');
		
		// Load Caspian Sea
		const caspianPath = doc.querySelector('.sea path.caspian');
		if (caspianPath) {
			const pathData = caspianPath.getAttribute('d');
			if (pathData) {
				log('✅ Loading Caspian Sea');
				createSeaFromPath('caspian', pathData);
			}
		}
		
		// Load South Waters (Persian Gulf + Oman Sea) - using custom clean path
		const southWatersPath = "M60.86 0C60.37 1.64 59.26 3.41 60.39 5.06C62.69 9.26 62.45 14.06 61.89 18.66C54.57 24.53 44.96 27.55 35.62 26.02C31.66 25.23 28.43 22.61 24.91 20.81C26.33 25.8 29.69 29.8 32.29 34.19C34.51 37.47 31.56 41.12 29.45 43.61C25.61 47.79 19.49 45.02 14.64 44.99C11.52 44.07 9.53001 46.86 7.48001 48.63C5.19001 50.81 2.63 52.66 0 54.39C1.59 54.8 3.19 55.23 4.78 55.66C4.64 56.54 4.51001 57.42 4.37001 58.32C7.86001 57.85 12.38 55.97 15.06 59.23C19.48 64.31 18.53 71.51 20.2 77.62C20.93 81.12 23.64 83.63 25.98 86.14C27.08 89.03 28.55 91.75 30.12 94.41C31.89 97.35 31.49 100.94 32.52 104.13C33.47 106.03 35.12 107.47 36.51 109.06C36.78 113.21 36.15 117.93 39.01 121.37C40.31 123.38 42.84 125.04 42.42 127.74C42.57 129.69 42.07 131.81 42.86 133.67C45.61 136.32 49.14 137.98 52.2 140.24C51.26 140.5 49.36 141.02 48.42 141.28C51.81 144.64 55.51 148.33 55.08 153.54C53.85 154.22 52.61 154.92 51.38 155.63C53.39 155.52 55.97 154.04 57.57 155.86C57.63 157.47 57.61 159.1 57.47 160.72C57.88 160.74 58.71 160.78 59.13 160.8C60.53 162.72 61.41 165.67 64.09 166.14C67.47 166.77 70.96 166.36 74.34 167.04C76.18 168.65 76.57 171.24 77.48 173.41C74.195 173.156 70.9003 172.93 67.6149 172.705L67.39 172.69C69.45 173.68 71.7 174.45 73.46 175.97C75.72 178.21 75.65 181.62 76.22 184.54C78.44 186.24 80.37 188.25 82.16 190.4C82.77 189.08 83.39 187.74 84.02 186.45C85.48 186.8 86.96 187.16 88.43 187.51C90.22 191.91 91.74 196.6 94.87 200.27C98.52 204.28 104.09 205.22 108.74 207.55C112.69 210.17 114.74 214.73 116.32 219.03C114.481 218.697 112.66 218.348 110.832 217.997L110.38 217.91C110.83 221.61 110.54 225.71 112.66 228.95C115.5 232.02 121.52 232.68 121.67 237.72C122.87 244.99 118.64 251.5 115.02 257.4C113.47 253.88 112.25 250.23 110.44 246.84C109.85 249.33 109.62 251.88 109.58 254.44C111.61 255.84 113.62 257.28 115.6 258.77C115.61 261.02 115.38 263.32 115.87 265.55C116.89 268.59 119.1 271.01 120.96 273.57C119.54 274.07 118.14 274.6 116.73 275.12C119.93 277.08 122.38 279.93 124.28 283.14C126.61 287.28 132.62 287.79 134.14 292.55C136.58 299.05 136.66 306.12 136.93 312.98C137.93 312.76 138.94 312.56 139.95 312.37C141.54 314.95 142.74 317.74 143.72 320.61C146.81 323.5 147.22 327.81 147.9 331.75C148.52 331.7 149.77 331.6 150.39 331.55C150.98 328.46 151.56 325.18 150.15 322.23C146.21 312.14 145.58 301.1 147.16 290.45C148 286.44 146 282.69 145.7 278.77C146.11 276.75 147.81 275.37 148.94 273.76C150.44 275.5 152.07 277.14 153.58 278.89C155.5 273.4 157.46 267.93 158.83 262.28C160.12 255.98 167 254.07 171.69 250.89C174.41 248.79 177.59 251.03 180.37 251.82L180.37 251.821C181.34 255.111 182.31 258.4 183.11 261.75C186.68 261.27 190.04 262.43 192.78 264.72C192.64 269.25 193.23 273.99 191.54 278.32C190.43 281.33 188.25 283.86 187.34 286.95C188.01 291.17 189.9 295.27 189.04 299.65C190.58 300.08 192.11 300.49 193.66 300.93C192.87 306.21 193.28 311.54 193.56 316.84C193.87 320.56 190.94 323.33 188.93 326.1C185.73 329.93 184.71 334.94 183.41 339.63C184.67 340.66 185.92 341.7 187.18 342.76C184.23 344.85 181.16 346.93 178.96 349.86C177.01 352.36 176.21 355.49 175.22 358.45C178.07 357.6 181.09 355.98 184.12 356.95C186.94 358.3 189.01 360.77 191.34 362.8C194.47 360.64 197.87 358.13 201.91 359.18C202.13 364.77 200.21 371.07 203.22 376.16C206.8 378.27 211.32 377.89 215.36 378.03C226.21 378.05 237.78 373.65 243.63 364.04C249.66 367.97 257.27 369.21 264.23 367.35C267.21 366.14 269.7 368.63 272.16 369.9C272.37 368.95 272.79 367.04 273 366.08C276.14 367.03 278.71 369.11 281.6 370.59C284.88 370.71 288.1 369.71 291.39 369.95C293.42 370.36 295.18 371.55 296.99 372.53C303.04 372.71 309.4 373.55 315.17 371.23C319.08 369.7 323.03 368.31 327.1 367.27C324.5 364.65 322.23 361.7 320.73 358.32C325.11 357.49 328.43 360.31 331.29 363.17C334.29 361.95 337.7 361.42 340.26 359.34C342.51 356.49 340.7 352.65 340.44 349.45C343.81 350.42 347.19 351.3 350.6 352.1C349.1 350.63 347.64 349.12 346.15 347.65C348.35 346.19 351.02 344.82 351.92 342.13C352.84 339.1 352.52 335.87 352.61 332.75C355.85 330.63 359.02 328.42 362.01 325.97C366.75 322.08 372.14 318.98 376.25 314.37C381.66 308.41 386 301.54 391.81 295.93C395.88 292.01 398.22 286.81 401.28 282.16C401.52 283.94 401.77 285.75 402.01 287.56C404.21 284.63 406.45 281.65 409.47 279.51C413.65 276.46 418.21 273.69 421.26 269.4C424.7 264.97 424.61 259.07 426.88 254.12C428.41 250.77 430.21 247.47 432.73 244.76C434.33 245.1 435.88 245.67 437.44 246.21C438.91 243.01 440.5 239.88 442.3 236.86C444.07 237.5 445.86 238.16 447.65 238.81C446.83 248.18 448.72 257.81 445.88 266.97C444.25 271.56 439.5 274.54 438.66 279.42C440.71 282.46 444.43 284.76 444.53 288.8C445 297.44 444.41 306.11 444.73 314.77C445.01 321.91 449.27 327.91 452.1 334.23C454.76 339.64 456.88 345.72 461.83 349.52C466.02 352.75 469.13 357.07 471.65 361.67C474.05 366.15 478.04 369.46 482.12 372.35C486.25 375.48 491.8 373.99 496.59 374.27C598.5 374.3 700.4 374.16 802.31 374.29C802.41 347.36 802.32 320.44 802.35 293.51C795.98 295.45 789.29 294.52 782.81 295.48C778.94 297.24 776.41 301.01 772.59 302.9C765.29 306.72 756.67 306.26 748.72 305.49C742.24 304.86 736.5 301.68 730.81 298.8C726.49 296.53 721.51 296.88 716.8 296.87C716.04 299.29 715.29 301.73 714.57 304.18L714.481 304.191C711.209 304.577 707.861 304.973 704.63 304.22C700.25 303.36 696.7 300.35 692.4 299.28C687.24 297.98 681.86 298.12 676.66 297.05C673.03 296.371 669.569 295.06 666.132 293.758L665.82 293.64C665.33 291.42 664.82 289.22 664.33 287.02C661.97 287 659.63 286.98 657.29 286.99C658.63 290.13 660.48 293.19 660.73 296.68C655.81 295.1 651.3 292.51 646.44 290.8C646.52 291.78 646.61 292.79 646.71 293.8C644.89 293.75 643.09 293.71 641.3 293.66C640.29 292.74 639.35 291.79 638.27 291.01C635.11 291.07 632.12 292.45 628.98 292.43C627.5 291.86 626.17 291 624.82 290.23C621.46 290.87 618.1 292.02 614.65 291.71C610.9 290.54 607.8 286.83 603.56 287.87C596.77 288.5 590.69 292.57 583.86 292.68C580.7 290.47 578.7 286.71 574.91 285.44C567.3 282.74 559.11 283.03 551.18 282.32C545.4 281.5 540.69 287.72 534.88 285.54C531.17 283.61 528.74 280.04 525.78 277.2C522.93 277.68 519.92 277.93 517.47 276.12C513.96 273.5 509.54 275.16 505.58 275.05C500.53 275.29 495.66 273.75 490.89 272.32C489.75 267.03 488.27 261.4 483.42 258.28C483.38 254.12 485.32 249.43 482.72 245.7C480.73 242.36 479.05 238.73 478.74 234.81C478.14 227.74 477.97 220.5 475.6 213.73C473.78 208.27 467.51 206.34 464.85 201.48C464.48 199.56 464.59 197.61 464.58 195.69C458.44 193.67 451.91 193.59 445.7 191.89C443.86 191.46 441.95 190.88 440.07 191.36C435.4 192.46 430.44 193.53 426.75 196.8C423.68 199.5 420.14 201.71 416.1 202.56C412.1 203.8 407.7 203.34 403.83 204.97C400.4 207.06 402.28 211.47 402.12 214.69C399.17 215.72 396.29 216.99 393.21 217.56C390.58 217.84 388.03 216.92 385.5 216.41C380.29 219.98 374.57 222.79 369.72 226.87C366.76 229.2 364.08 232.07 360.51 233.46C357.7 234.22 354.77 233.64 351.94 233.45C347.5 226.94 339.38 225.1 333.31 220.6C328.63 223.12 323.65 220.95 319.13 219.24C313.86 221.35 307.87 221.69 302.45 219.95C297.675 218.277 294.163 214.497 290.81 210.887L290.59 210.65C290.534 209.135 290.486 207.628 290.439 206.139L290.43 205.86C284.18 203.46 277.93 201.1 271.56 199.08C268.42 198.15 265.8 196.15 263.32 194.1C258.58 190.22 253.32 187.01 247.79 184.38C245.38 183.38 244 181.07 242.59 179.03C243.94 178.21 245.3 177.44 246.66 176.65C244.1 173.03 241.72 168.91 237.6 166.88C232.36 164.09 225.41 164.96 221.21 160.24C218.95 158.18 217.15 154.9 213.75 154.77C208.06 153.86 202.29 154.92 196.6 154.28C192.99 152.73 190.22 149.72 186.66 148.03C183.39 146.57 182.2 142.9 179.67 140.58C178.52 139.1 176.58 137.83 176.79 135.73C176.53 132.84 177.61 129.43 175.22 127.17C171.45 122.72 168.63 117.48 167.27 111.8C166.12 107.33 166.98 102.65 166.14 98.15C163.44 95.98 159.84 95.44 157.01 93.52C155.46 92.24 154.31 90.57 153.08 89.02C154.71 85.65 156.35 82.29 158.04 78.95C156.64 78.28 155.23 77.61 153.83 76.97C150.76 77.85 147.6 77.67 144.77 76.14C145.33 72.98 146.05 69.84 147.54 66.98C145.42 62.5 143.77 57.82 141.91 53.23C140.07 48.68 135.03 46.82 132.31 42.94C129.54 39.01 126.96 34.95 123.81 31.31C119.55 26.44 122.73 18.84 118.58 13.93C114.72 13.15 111.23 15.36 108.02 17.16C102.17 20.7 95.93 23.54 89.63 26.16C89.47 22.71 89.33 19.27 89.22 15.83C85.08 14.79 80.8 15 76.69 16.07C76.59 14.35 76.48 12.64 76.39 10.93C69.43 10.66 65.38 4.37 60.86 0Z";
		log('✅ Loading South Waters (Persian Gulf + Oman Sea)');
		createSeaFromPath('south-waters', southWatersPath);
		
		// Load main lakes (Urmia, Jazmourian)
		const mainLakes = ['urmia', 'jazmourian'];
		mainLakes.forEach(lakeName => {
			const lakePath = doc.querySelector(`.lake path.${lakeName}`);
			if (lakePath) {
				const pathData = lakePath.getAttribute('d');
				if (pathData) {
					log(`✅ Loading lake: ${lakeName}`);
					createSeaFromPath(lakeName, pathData);
				}
			}
		});
		
		log(`🌊 Loaded ${waterBodies.length} water bodies`);
	}
	
	function createSeaFromPath(id, pathData) {
		const shape = parseSVGPath(pathData);
		if (!shape) return;
		
		const extrudeSettings = {
			depth: MAP_CONFIG.water.extrudeDepth,
			bevelEnabled: true,
			bevelThickness: MAP_CONFIG.water.bevelThickness,
			bevelSize: MAP_CONFIG.water.bevelSize,
			bevelSegments: MAP_CONFIG.water.bevelSegments,
			curveSegments: MAP_CONFIG.water.curveSegments
		};
		
		const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		
		// Determine color based on water body type
		let emissiveColor = MAP_CONFIG.waterColors?.caspian || 0x00bbdd;
		if (id === 'south-waters') {
			emissiveColor = MAP_CONFIG.waterColors?.southWaters || 0x00bbdd;
		} else if (id === 'urmia') {
			emissiveColor = MAP_CONFIG.waterColors?.urmia || 0x00bbdd;
		} else if (id === 'jazmourian') {
			emissiveColor = MAP_CONFIG.waterColors?.jazmourian || 0x00bbdd;
		}
		
		const material = new THREE.MeshPhysicalMaterial({
			color: emissiveColor,
			emissive: emissiveColor,
			emissiveIntensity: MAP_CONFIG.water.emissiveIntensity,
			metalness: MAP_CONFIG.water.metalness,
			roughness: MAP_CONFIG.water.roughness,
			transparent: true,
			opacity: MAP_CONFIG.water.opacity,
			side: THREE.DoubleSide,
			clearcoat: MAP_CONFIG.water.clearcoat,
			clearcoatRoughness: MAP_CONFIG.water.clearcoatRoughness,
			reflectivity: MAP_CONFIG.water.reflectivity
		});
		
		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		
		const edges = new THREE.EdgesGeometry(geometry, MAP_CONFIG.water.edgeAngle);
		
		// استفاده از رنگ سفارشی یا رنگ دریا
		const borderColor = MAP_CONFIG.water.borderColor || emissiveColor;
		
		const lineMaterial = new THREE.LineBasicMaterial({
			color: borderColor,
			transparent: true,
			opacity: MAP_CONFIG.water.borderOpacity,
			linewidth: MAP_CONFIG.water.borderWidth || 3,
			depthTest: !MAP_CONFIG.water.borderOnTopOnly  // اگر فقط بالا باشه، depthTest رو خاموش کن
		});
		const wireframe = new THREE.LineSegments(edges, lineMaterial);
		mesh.add(wireframe);
		
		scene.add(mesh);
		
		waterBodies.push({
			id,
			mesh
		});
	}
	
	function createProvinceFromPath(id, pathData, color) {
		const shape = parseSVGPath(pathData);
		if (!shape) return;
		
		const extrudeSettings = {
			depth: MAP_CONFIG.provinces.extrudeDepth,
			bevelEnabled: true,
			bevelThickness: MAP_CONFIG.provinces.bevelThickness,
			bevelSize: MAP_CONFIG.provinces.bevelSize,
			bevelSegments: MAP_CONFIG.provinces.bevelSegments,
			curveSegments: MAP_CONFIG.provinces.curveSegments
		};
		
		const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		
		// اضافه کردن vertex colors برای گرادیان از پایین به بالا
		const positions = geometry.attributes.position;
		const colors = new Float32Array(positions.count * 3);
		
		const r = ((color >> 16) & 255) / 255;
		const g = ((color >> 8) & 255) / 255;
		const b = (color & 255) / 255;
		
		for (let i = 0; i < positions.count; i++) {
			const y = positions.getY(i);
			// گرادیان: پایین روشن (1.0)، بالا کم‌رنگ (0.3)
			const brightness = 1.0 - (y / MAP_CONFIG.provinces.extrudeDepth) * 0.7;
			
			colors[i * 3] = r * brightness;
			colors[i * 3 + 1] = g * brightness;
			colors[i * 3 + 2] = b * brightness;
		}
		
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		
		const material = new THREE.MeshPhysicalMaterial({
			color: color,
			emissive: color,
			emissiveIntensity: MAP_CONFIG.provinces.defaultEmissiveIntensity,
			metalness: MAP_CONFIG.provinces.metalness,
			roughness: MAP_CONFIG.provinces.roughness,
			transparent: true,
			opacity: MAP_CONFIG.provinces.defaultOpacity,
			side: THREE.DoubleSide,
			clearcoat: MAP_CONFIG.provinces.clearcoat,
			clearcoatRoughness: MAP_CONFIG.provinces.clearcoatRoughness,
			reflectivity: MAP_CONFIG.provinces.reflectivity,
			vertexColors: true  // فعال کردن vertex colors
		});
		
		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.y = 0;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		// Create edges with gradient effect for neon glow
		const edges = new THREE.EdgesGeometry(geometry, MAP_CONFIG.provinces.edgeAngle);
		
		// Add vertex colors for gradient effect (brighter at bottom, dimmer at top)
		const edgePositions = edges.attributes.position;
		const edgeColors = new Float32Array(edgePositions.count * 3);
		
		// استفاده از رنگ سفارشی یا رنگ استان
		const borderColor = MAP_CONFIG.provinces.borderColor || color;
		const br = ((borderColor >> 16) & 255) / 255;
		const bg = ((borderColor >> 8) & 255) / 255;
		const bb = (borderColor & 255) / 255;
		
		for (let i = 0; i < edgePositions.count; i++) {
			const y = edgePositions.getY(i);
			// گرادیان خطوط: پایین روشن (1.0)، بالا کم‌رنگ (0.4)
			const brightness = (MAP_CONFIG.provinces.borderGlowIntensity || 1.0) * (1.0 - (y / MAP_CONFIG.provinces.extrudeDepth) * 0.6);
			
			edgeColors[i * 3] = br * brightness;
			edgeColors[i * 3 + 1] = bg * brightness;
			edgeColors[i * 3 + 2] = bb * brightness;
		}
		
		edges.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3));
		
		const lineMaterial = new THREE.LineBasicMaterial({
			vertexColors: true,
			transparent: true,
			opacity: MAP_CONFIG.provinces.borderOpacity,
			linewidth: MAP_CONFIG.provinces.borderWidth,
			depthTest: !MAP_CONFIG.provinces.borderOnTopOnly  // اگر فقط بالا باشه، depthTest رو خاموش کن
		});
		const wireframe = new THREE.LineSegments(edges, lineMaterial);
		mesh.add(wireframe);
		
		scene.add(mesh);
		
		provinces.push({
			id,
			name: provinceNames[id] || id,
			mesh,
			color,
			wireframe
		});
	}
	
	function parseSVGPath(pathString) {
		const shape = new THREE.Shape();
		const commands = pathString.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
		if (!commands) {
			log('No commands found in path');
			return null;
		}
		
		let currentX = 0, currentY = 0;
		let startX = 0, startY = 0;
		const scale = 0.6;
		
		try {
			commands.forEach(cmd => {
				const type = cmd[0];
				const isRelative = type === type.toLowerCase();
				const typeUpper = type.toUpperCase();
				const coords = cmd.slice(1).trim().split(/[\s,]+/).filter(c => c && c !== '').map(Number);
				
				switch (typeUpper) {
					case 'M':
						if (coords.length >= 2) {
							if (isRelative) {
								currentX += coords[0];
								currentY += coords[1];
							} else {
								currentX = coords[0];
								currentY = coords[1];
							}
							startX = currentX;
							startY = currentY;
							shape.moveTo(currentX * scale, -currentY * scale);
							
							// Handle implicit lineTo commands after moveTo
							for (let i = 2; i < coords.length; i += 2) {
								if (i + 1 < coords.length) {
									if (isRelative) {
										currentX += coords[i];
										currentY += coords[i + 1];
									} else {
										currentX = coords[i];
										currentY = coords[i + 1];
									}
									shape.lineTo(currentX * scale, -currentY * scale);
								}
							}
						}
						break;
						
					case 'L':
						for (let i = 0; i < coords.length; i += 2) {
							if (i + 1 < coords.length) {
								if (isRelative) {
									currentX += coords[i];
									currentY += coords[i + 1];
								} else {
									currentX = coords[i];
									currentY = coords[i + 1];
								}
								shape.lineTo(currentX * scale, -currentY * scale);
							}
						}
						break;
						
					case 'H':
						coords.forEach(x => {
							if (isRelative) {
								currentX += x;
							} else {
								currentX = x;
							}
							shape.lineTo(currentX * scale, -currentY * scale);
						});
						break;
						
					case 'V':
						coords.forEach(y => {
							if (isRelative) {
								currentY += y;
							} else {
								currentY = y;
							}
							shape.lineTo(currentX * scale, -currentY * scale);
						});
						break;
						
					case 'C':
						for (let i = 0; i < coords.length; i += 6) {
							if (i + 5 < coords.length) {
								const cp1x = isRelative ? currentX + coords[i] : coords[i];
								const cp1y = isRelative ? currentY + coords[i + 1] : coords[i + 1];
								const cp2x = isRelative ? currentX + coords[i + 2] : coords[i + 2];
								const cp2y = isRelative ? currentY + coords[i + 3] : coords[i + 3];
								const endX = isRelative ? currentX + coords[i + 4] : coords[i + 4];
								const endY = isRelative ? currentY + coords[i + 5] : coords[i + 5];
								
								shape.bezierCurveTo(
									cp1x * scale, -cp1y * scale,
									cp2x * scale, -cp2y * scale,
									endX * scale, -endY * scale
								);
								
								currentX = endX;
								currentY = endY;
							}
						}
						break;
						
					case 'S':
						for (let i = 0; i < coords.length; i += 4) {
							if (i + 3 < coords.length) {
								const cp2x = isRelative ? currentX + coords[i] : coords[i];
								const cp2y = isRelative ? currentY + coords[i + 1] : coords[i + 1];
								const endX = isRelative ? currentX + coords[i + 2] : coords[i + 2];
								const endY = isRelative ? currentY + coords[i + 3] : coords[i + 3];
								
								shape.quadraticCurveTo(
									cp2x * scale, -cp2y * scale,
									endX * scale, -endY * scale
								);
								
								currentX = endX;
								currentY = endY;
							}
						}
						break;
						
					case 'Q':
						for (let i = 0; i < coords.length; i += 4) {
							if (i + 3 < coords.length) {
								const cpx = isRelative ? currentX + coords[i] : coords[i];
								const cpy = isRelative ? currentY + coords[i + 1] : coords[i + 1];
								const endX = isRelative ? currentX + coords[i + 2] : coords[i + 2];
								const endY = isRelative ? currentY + coords[i + 3] : coords[i + 3];
								
								shape.quadraticCurveTo(
									cpx * scale, -cpy * scale,
									endX * scale, -endY * scale
								);
								
								currentX = endX;
								currentY = endY;
							}
						}
						break;
						
					case 'Z':
						shape.lineTo(startX * scale, -startY * scale);
						currentX = startX;
						currentY = startY;
						break;
				}
			});
			return shape;
		} catch (e) {
			log('Error parsing path:', e, pathString.substring(0, 100));
			return null;
		}
	}
	
	function centerMap() {
		if (provinces.length === 0) return;
		
		const box = new THREE.Box3();
		provinces.forEach(p => box.expandByObject(p.mesh));
		
		const center = box.getCenter(new THREE.Vector3());
		
		// Center provinces
		provinces.forEach(p => {
			p.mesh.position.x -= center.x;
			p.mesh.position.z -= center.z;
			p.mesh.position.y = 0;
		});
		
		// Center water bodies with the same offset
		waterBodies.forEach(w => {
			w.mesh.position.x -= center.x;
			w.mesh.position.z -= center.z;
			
			// Special positioning for south waters (Persian Gulf + Oman Sea)
			if (w.id === 'south-waters') {
				w.mesh.position.z += 345; // Move south
				w.mesh.position.x += 105;
			}
		});
	}
</script>

<div bind:this={container} class="map-container"></div>

<style>
	.map-container {
		width: 100%;
		height: 100vh;
		position: relative;
	}
</style>
