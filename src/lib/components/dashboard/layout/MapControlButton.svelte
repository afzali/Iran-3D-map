<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	/**
	 * MapControlButton - دکمه کنترل نقشه
	 * @prop {string} icon - آیکون دکمه
	 * @prop {boolean} hasBorder - آیا حاشیه پایین دارد
	 */
	export let icon = 'layers';
	export let hasBorder = false;
	
	function handleClick() {
		dispatch('click');
	}
</script>

<button 
	class="p-2 text-gray-400 hover:text-white transition {hasBorder ? 'border-b border-gray-700' : ''}"
	on:click={handleClick}
>
	<span class="material-icons text-sm">{icon}</span>
</button>
