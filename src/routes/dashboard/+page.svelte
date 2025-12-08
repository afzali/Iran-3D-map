<script>
	import { Header, RightPanel, LeftPanel, MapControls, TimeLine } from '$lib/components/dashboard';
	import Iran from '$lib/components/iran/Iran.svelte';
	import FloatingParticles from '$lib/components/effects/FloatingParticles.svelte';
	
	let iranMap;
	let showPanels = true;
	
	// Custom map configuration for dashboard
	const dashboardMapConfig = {
		provinces: {
			extrudeDepth: 40,
			bevelThickness: 3,
			bevelSize: 2,
			bevelSegments: 3,
			curveSegments: 8,
			defaultOpacity: 1,
			defaultEmissiveIntensity: 0,
			metalness: 0.05,
			roughness: 1,
			clearcoat: 0.85,
			clearcoatRoughness: 0.4,
			reflectivity: 0.15,
			borderOpacity: 0.25,
			borderWidth: 10,
			edgeAngle: 20,
			borderGlowIntensity: 0.3,
			borderColor: null,
			borderOnTopOnly: false,
			hoverHeight: 35,
			hoverOpacity: 1,
			hoverEmissiveIntensity: 1,
			hoverBorderOpacity: 1,
			hoverScale: 1,
			hoverAnimationDuration: 350,
			resetAnimationDuration: 250,
			patternOpacity: 0.45,
			patternLineOpacity: 0,
			patternDotOpacity: 0,
			patternLineSpacing: 2,
			patternDotSpacing: 4,
			patternRepeat: 4
		},
		water: {
			extrudeDepth: 25,
			bevelThickness: 3,
			bevelSize: 2,
			bevelSegments: 3,
			curveSegments: 8,
			opacity: 1,
			emissiveIntensity: 0,
			metalness: 0.15,
			roughness: 0.3,
			clearcoat: 1,
			clearcoatRoughness: 0.3,
			reflectivity: 0.7,
			borderOpacity: 0,
			borderWidth: 1,
			edgeAngle: 32,
			borderGlowIntensity: 1,
			borderColor: null,
			borderOnTopOnly: true,
			patternOpacity: 0.5,
			patternLineOpacity: 0.06,
			patternDotOpacity: 0.04,
			patternLineSpacing: 4,
			patternDotSpacing: 8,
			patternRepeat: 4
		},
		bloom: {
			strength: 0.1,
			radius: 0.75,
			threshold: 0.85
		},
		camera: {
			fov: 45,
			near: 1,
			far: 3000,
			positionX: 0,
			positionY: 650,
			positionZ: 650,
			targetX: 0,
			targetY: -70,
			targetZ: 50,
			minDistance: 600,
			maxDistance: 1500,
			autoRotateSpeed: 0.5
		},
		lighting: {
			ambientIntensity: 0.2,
			directionalIntensity: 0.4,
			rimLight1Intensity: 0.5,
			rimLight2Intensity: 0.5,
			rimLight3Intensity: 0.4
		},
		background: {
			vignette: 0.8
		},
		waterColors: {
			caspian: 0x00bbdd,
			southWaters: 0x00bbdd,
			urmia: 0x00bbdd,
			jazmourian: 0x00bbdd
		}
	};
	
	function handleZoomIn() {
		console.log('ZoomIn clicked');
		if (iranMap) iranMap.zoomIn();
	}
	
	function handleZoomOut() {
		console.log('ZoomOut clicked');
		if (iranMap) iranMap.zoomOut();
	}
	
	function handleToggleLayers() {
		console.log('ToggleLayers clicked');
		if (iranMap) iranMap.toggleControlPanel();
	}
	
	function handleFullscreen() {
		console.log('Fullscreen clicked, showPanels:', showPanels);
		// Toggle panels visibility
		showPanels = !showPanels;
		// Update map size after transition
		setTimeout(() => {
			if (iranMap) iranMap.updateSize();
		}, 350); // Wait for transition to complete (300ms + buffer)
	}
</script>

<svelte:head>
	<title>داشبورد هومان - نبض انسانیت</title>
	<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round" rel="stylesheet" />
</svelte:head>

<div class="bg-background-dark text-gray-200 h-screen w-screen flex flex-col overflow-hidden" dir="rtl">
	<!-- Header -->
	<Header />
	
	<!-- Main Content -->
	<div class="flex flex-1 h-[calc(100vh-4rem)] relative">
		<!-- Main Map Area -->
		<main class="flex-1 bg-black relative flex flex-col transition-all duration-300 {showPanels ? 'mr-16 ml-96' : ''}">
			<!-- Humaan -->
			<div class="absolute inset-0 z-0">
				<Iran 
					bind:this={iranMap}
					showControlPanel={false}
					showInfoPanel={false}
					showMapControls={false}
					customConfig={dashboardMapConfig}
				/>
			</div>
			
			<!-- Map Controls -->
			<MapControls 
				on:zoomIn={handleZoomIn}
				on:zoomOut={handleZoomOut}
				on:toggleLayers={handleToggleLayers}
				on:toggleFullscreen={handleFullscreen}
			/>
			
			<!-- Timeline -->
			<TimeLine />
			
			<!-- Floating Particles Effect -->
			<FloatingParticles />
		</main>
		
		<!-- Right Sidebar (Icons) - سمت راست -->
		{#if showPanels}
			<RightPanel />
		{/if}
		
		<!-- Left Sidebar (Widgets) - سمت چپ -->
		{#if showPanels}
			<LeftPanel />
		{/if}
	</div>
</div>
