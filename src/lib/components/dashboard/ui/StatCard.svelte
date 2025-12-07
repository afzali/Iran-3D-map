<script>
	/**
	 * StatCard - کارت آماری قابل استفاده مجدد
	 * @prop {string} icon - نام آیکون Material Icons
	 * @prop {string} value - مقدار اصلی
	 * @prop {string} unit - واحد (نفر، میلیون، هزار)
	 * @prop {string} label - برچسب توضیحی
	 */
	export let icon = 'favorite_border';
	export let value = '۰';
	export let unit = '';
	export let label = '';
</script>

<div class="bg-[#1e1e24] px-2 py-4 rounded-lg flex flex-col items-center text-center border border-gray-800">
	<span class="material-icons-outlined text-gray-400 text-sm mb-2">{icon}</span>
	<div class="text-white font-bold text-2xl leading-none">{value}</div>
	{#if unit}
		<div class="text-[11px] text-gray-500 mt-2">{unit}</div>
	{/if}
	{#if label}
		<div class="text-[10px] text-gray-400 mt-1">{label}</div>
	{/if}
</div>
