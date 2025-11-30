<script>
	import { onMount } from 'svelte';
	import IranMap3D from '$lib/components/IranMap3D.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import { SHOW_CONTROL_PANEL, BACKGROUND_COLORS, MAP_CONFIG } from '$lib/config';
	
	let provinceName = 'نقشه سه‌بعدی ایران';
	let provinceInfo = 'موس را روی استان‌ها حرکت دهید';
	let showPanel = SHOW_CONTROL_PANEL;
	let mapComponent;
	let isRotating = true;
	let rotationButtonText = '⏸️ توقف چرخش';
	
	// Initialize CSS variables on mount
	onMount(() => {
		if (typeof document !== 'undefined') {
			console.log('🎬 Initializing background colors:', BACKGROUND_COLORS);
			document.documentElement.style.setProperty('--bg-primary', BACKGROUND_COLORS.primary);
			document.documentElement.style.setProperty('--bg-secondary', BACKGROUND_COLORS.secondary);
			document.documentElement.style.setProperty('--vignette-opacity', MAP_CONFIG.background.vignette.toString());
			
			// Also set on body
			document.body.style.setProperty('--bg-primary', BACKGROUND_COLORS.primary);
			document.body.style.setProperty('--bg-secondary', BACKGROUND_COLORS.secondary);
			document.body.style.setProperty('--vignette-opacity', MAP_CONFIG.background.vignette.toString());
			
			// Set initial background gradient
			document.body.style.background = `radial-gradient(ellipse at center, ${BACKGROUND_COLORS.secondary} 0%, ${BACKGROUND_COLORS.primary} 100%)`;
			console.log('✅ Background initialized');
		}
	});
	
	function toggleRotation() {
		if (mapComponent) {
			isRotating = mapComponent.toggleRotation();
			rotationButtonText = isRotating ? '⏸️ توقف چرخش' : '▶️ شروع چرخش';
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
	
	function handleConfigChange(event) {
		console.log('Config changed:', event.detail);
		// اعمال تغییرات به نقشه
	}
	
	function handleReset() {
		console.log('Reset to defaults');
	}
	
	function handleExport() {
		console.log('Export config');
	}
	
	function handleFixPositions() {
		console.log('Fix positions');
	}
</script>

<svelte:head>
	<title>نقشه سه‌بعدی ایران</title>
	<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div class="app">
	<IranMap3D bind:this={mapComponent} />
	
	<ControlPanel 
		visible={showPanel}
		mapComponent={mapComponent}
	/>
	
	<div class="info">
		<div class="province-name">{provinceName}</div>
		<div class="province-info">{provinceInfo}</div>
	</div>
	
	<div class="controls">
		<button class="btn" on:click={toggleRotation}>{rotationButtonText}</button>
		<button class="btn" on:click={resetView}>🔄 بازنشانی</button>
		<button class="btn" on:click={toggleWater}>💧 پنهان/نمایش دریاها</button>
		<button class="btn" on:click={showOnlyWater}>🌊 فقط دریاها</button>
	</div>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	
	:global(html) {
		--bg-primary: #000000;
		--bg-secondary: #0d0d0d;
		--vignette-opacity: 0.85;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'vazirmatn', Tahoma, Geneva, Verdana, sans-serif;
		background: radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
		overflow: hidden;
		min-height: 100vh;
	}
	
	:global(body::before) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, var(--vignette-opacity)) 100%);
		pointer-events: none;
		z-index: 1;
	}
	
	.app {
		width: 100vw;
		height: 100vh;
		position: relative;
		z-index: 2;
	}
	
	.info {
		position: absolute;
		top: 20px;
		right: 20px;
		background: rgba(0, 10, 20, 0.95);
		backdrop-filter: blur(15px);
		padding: 20px 25px;
		border-radius: 12px;
		border: 2px solid rgba(0, 255, 255, 0.4);
		box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
		color: #00ffff;
		z-index: 100;
		min-width: 250px;
	}
	
	.province-name {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 8px;
		text-shadow: 0 0 15px currentColor;
	}
	
	.province-info {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.8);
	}
	
	.controls {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 12px;
		z-index: 100;
	}
	
	.btn {
		font-family: inherit;
		background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 200, 255, 0.1));
		border: 2px solid rgba(0, 255, 255, 0.5);
		color: #00ffff;
		padding: 10px 20px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
		transition: all 0.3s;
		backdrop-filter: blur(10px);
	}
	
	.btn:hover {
		background: linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(0, 200, 255, 0.2));
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
	}
</style>
