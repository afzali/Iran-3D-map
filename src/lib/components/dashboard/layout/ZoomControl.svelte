<script>
	import MapControlButton from './MapControlButton.svelte';
	
	/**
	 * ZoomControl - کنترل زوم نقشه
	 * @prop {Function} onZoomIn - رویداد زوم این
	 * @prop {Function} onZoomOut - رویداد زوم اوت
	 */
	export let onZoomIn = null;
	export let onZoomOut = null;
</script>

<div class="bg-surface-dark border border-gray-700 rounded-lg p-1 flex flex-col">
	<MapControlButton icon="add" hasBorder={true} onclick={onZoomIn} />
	<MapControlButton icon="remove" onclick={onZoomOut} />
</div>
