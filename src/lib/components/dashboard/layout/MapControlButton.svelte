<script>
	/**
	 * MapControlButton - دکمه کنترل نقشه
	 * @prop {string} icon - آیکون دکمه
	 * @prop {boolean} hasBorder - آیا حاشیه پایین دارد
	 * @prop {Function} onclick - رویداد کلیک
	 */
	export let icon = 'layers';
	export let hasBorder = false;
	export let onclick = null;
</script>

<button 
	class="p-2 text-gray-400 hover:text-white transition {hasBorder ? 'border-b border-gray-700' : ''}"
	on:click={onclick}
>
	<span class="material-icons text-sm">{icon}</span>
</button>
