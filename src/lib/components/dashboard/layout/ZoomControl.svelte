<script>
	import { createEventDispatcher } from 'svelte';
	import MapControlButton from './MapControlButton.svelte';
	
	const dispatch = createEventDispatcher();
	
	/**
	 * ZoomControl - کنترل زوم نقشه
	 */
	
	function handleZoomIn() {
		dispatch('zoomIn');
	}
	
	function handleZoomOut() {
		dispatch('zoomOut');
	}
</script>

<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
	<MapControlButton icon="add" hasBorder={true} on:click={handleZoomIn} />
	<MapControlButton icon="remove" on:click={handleZoomOut} />
</div>
