<script>
	import { createEventDispatcher } from 'svelte';
	import MapControlButton from './MapControlButton.svelte';
	import ZoomControl from './ZoomControl.svelte';
	
	const dispatch = createEventDispatcher();
	
	/**
	 * MapControls - مجموعه کنترل‌های نقشه
	 */
	
	function handleLayers() {
		console.log('MapControls: handleLayers');
		dispatch('toggleLayers');
	}
	
	function handleFullscreen() {
		console.log('MapControls: handleFullscreen');
		dispatch('toggleFullscreen');
	}
	
	function handleZoomIn() {
		console.log('MapControls: handleZoomIn');
		dispatch('zoomIn');
	}
	
	function handleZoomOut() {
		console.log('MapControls: handleZoomOut');
		dispatch('zoomOut');
	}
</script>

<div class="absolute bottom-40 left-4 flex flex-col gap-2 z-10">
	<!-- Layer Button -->
	<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
		<MapControlButton icon="layers" on:click={handleLayers} />
	</div>
	
	<!-- Fullscreen Button -->
	<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
		<MapControlButton icon="crop_free" on:click={handleFullscreen} />
	</div>
	
	<!-- Zoom Controls -->
	<ZoomControl on:zoomIn={handleZoomIn} on:zoomOut={handleZoomOut} />
</div>
