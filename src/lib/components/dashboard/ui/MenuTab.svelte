<script>
	/**
	 * MenuTab - تب منو
	 * @prop {string} label - متن تب
	 * @prop {string} href - لینک
	 * @prop {boolean} active - آیا فعال است
	 */
	export let label = '';
	export let href = '#';
	export let active = false;
</script>

{#if active}
	<a {href} class="text-white font-bold border-b-2 border-primary pb-2 pt-3">
		{label}
	</a>
{:else}
	<a {href} class="text-gray-400 hover:text-white transition">
		{label}
	</a>
{/if}
