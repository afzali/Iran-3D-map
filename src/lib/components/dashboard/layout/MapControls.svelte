<script>
	import MapControlButton from './MapControlButton.svelte';
	import ZoomControl from './ZoomControl.svelte';
	
	/**
	 * MapControls - مجموعه کنترل‌های نقشه
	 */
</script>

<div class="absolute bottom-40 left-4 flex flex-col gap-2 z-10">
	<!-- Layer Button -->
	<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
		<MapControlButton icon="layers" />
	</div>
	
	<!-- Fullscreen Button -->
	<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
		<MapControlButton icon="crop_free" />
	</div>
	
	<!-- Zoom Controls -->
	<ZoomControl />
</div>
