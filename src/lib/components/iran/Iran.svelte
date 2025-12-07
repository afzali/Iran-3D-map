<script>
	import { onMount } from 'svelte';
	import IranMap3D from './IranMap3D.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import MapControls from './MapControls.svelte';
	import { SHOW_CONTROL_PANEL, BACKGROUND_COLORS, MAP_CONFIG } from '$lib/config';
	import { log, enableGlobalOverride } from '$lib/utils/logger';
	import { selectedCity, provinceToCity } from '$lib/stores/cityStore';
	
	// ═══════════════════════════════════════════════════════════════
	// 🎛️ Props - تنظیمات نمایش اجزای مختلف
	// ═══════════════════════════════════════════════════════════════
	
	// نمایش پنل تنظیمات (⚙️)
	export let showControlPanel = SHOW_CONTROL_PANEL;
	
	// نمایش باکس اطلاعات استان (نقشه سه‌بعدی ایران)
	export let showInfoPanel = true;
	
	// نمایش دکمه‌های کنترل (چرخش، بازنشانی، ...)
	export let showMapControls = true;
	
	// نمایش دکمه‌های جداگانه
	export let showRotationBtn = true;
	export let showResetBtn = true;
	export let showToggleWaterBtn = true;
	export let showOnlyWaterBtn = true;
	
	// کانفیگ سفارشی (اختیاری)
	export let customConfig = null;
	export let customBackgroundColors = null;
	
	// ═══════════════════════════════════════════════════════════════
	// 🔧 Internal State
	// ═══════════════════════════════════════════════════════════════
	
	let provinceName = 'نقشه سه‌بعدی ایران';
	let provinceInfo = 'موس را روی استان‌ها حرکت دهید';
	let provinceColor = '#00ffff';
	let mapComponent;
	let isRotating = true;
	
	// استفاده از کانفیگ سفارشی یا پیش‌فرض
	$: activeConfig = customConfig || MAP_CONFIG;
	$: activeBgColors = customBackgroundColors || BACKGROUND_COLORS;
	
	// Initialize CSS variables on mount
	onMount(() => {
		// Override console if DEBUG_MODE is false
		enableGlobalOverride();
		
		if (typeof document !== 'undefined') {
			log('🎬 Initializing background colors:', activeBgColors);
			document.documentElement.style.setProperty('--bg-primary', activeBgColors.primary);
			document.documentElement.style.setProperty('--bg-secondary', activeBgColors.secondary);
			document.documentElement.style.setProperty('--vignette-opacity', activeConfig.background.vignette.toString());
			
			// Also set on body
			document.body.style.setProperty('--bg-primary', activeBgColors.primary);
			document.body.style.setProperty('--bg-secondary', activeBgColors.secondary);
			document.body.style.setProperty('--vignette-opacity', activeConfig.background.vignette.toString());
			
			// Set initial background gradient
			document.body.style.background = `radial-gradient(ellipse at center, ${activeBgColors.secondary} 0%, ${activeBgColors.primary} 100%)`;
			log('✅ Background initialized');
		}
	});
	
	function toggleRotation() {
		if (mapComponent) {
			isRotating = mapComponent.toggleRotation();
		}
	}
	
	function resetView() {
		if (mapComponent) {
			mapComponent.resetView();
		}
	}
	
	function toggleWater() {
		if (mapComponent) {
			mapComponent.toggleWater();
		}
	}
	
	function showOnlyWater() {
		if (mapComponent) {
			mapComponent.showOnlyWater();
		}
	}
	
	export function zoomIn() {
		if (mapComponent) {
			mapComponent.zoomIn();
		}
	}
	
	export function zoomOut() {
		if (mapComponent) {
			mapComponent.zoomOut();
		}
	}
	
	export function toggleControlPanel() {
		showControlPanel = !showControlPanel;
	}
	
	export function updateSize() {
		if (mapComponent) {
			mapComponent.updateSize();
		}
	}
	
	function handleProvinceHover(event) {
		const data = event.detail;
		if (data) {
			provinceName = data.name;
			provinceInfo = 'استان ' + data.name;
			provinceColor = '#' + data.color.toString(16).padStart(6, '0');
		} else {
			provinceName = 'نقشه سه‌بعدی ایران';
			provinceInfo = 'موس را روی استان‌ها حرکت دهید';
			provinceColor = '#00ffff';
		}
	}

	function handleProvinceSelect(event) {
		const { name } = event.detail || {};
		if (!name) return;
		const mappedCity = provinceToCity[name];
		if (mappedCity) {
			selectedCity.set(mappedCity);
		}
	}
</script>

<div class="relative h-full w-full">
	<IranMap3D
		bind:this={mapComponent}
		config={activeConfig}
		on:provinceHover={handleProvinceHover}
		on:provinceSelect={handleProvinceSelect}
	/>
	
	{#if showControlPanel}
	<ControlPanel 
		visible={showControlPanel}
		mapComponent={mapComponent}
	/>
	{/if}
	
	{#if showInfoPanel}
	<InfoPanel 
		{provinceName}
		{provinceInfo}
		{provinceColor}
	/>
	{/if}
	
	{#if showMapControls}
	<MapControls 
		{isRotating}
		showRotation={showRotationBtn}
		showReset={showResetBtn}
		showToggleWater={showToggleWaterBtn}
		showOnlyWaterBtn={showOnlyWaterBtn}
		on:toggleRotation={toggleRotation}
		on:resetView={resetView}
		on:toggleWater={toggleWater}
		on:showOnlyWater={showOnlyWater}
	/>
	{/if}
</div>
