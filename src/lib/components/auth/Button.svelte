<script>
	/**
	 * Button - دکمه اصلی
	 * @prop {string} type - نوع دکمه (submit, button)
	 * @prop {boolean} fullWidth - عرض کامل
	 * @prop {boolean} loading - حالت بارگذاری
	 */
	export let type = 'submit';
	export let fullWidth = true;
	export let loading = false;
</script>

<button
	{type}
	disabled={loading}
	class="flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-dark focus:ring-primary transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
	class:w-full={fullWidth}
>
	{#if loading}
		<span class="material-symbols-rounded animate-spin ml-2">progress_activity</span>
	{/if}
	<slot />
</button>
