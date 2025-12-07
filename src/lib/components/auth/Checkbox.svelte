<script>
	/**
	 * Checkbox - چک‌باکس
	 * @prop {string} id - شناسه
	 * @prop {string} label - برچسب
	 * @prop {boolean} checked - وضعیت
	 */
	export let id = '';
	export let label = '';
	export let checked = false;
</script>

<div class="flex items-center">
	<input
		{id}
		name={id}
		type="checkbox"
		bind:checked
		class="h-4 w-4 rounded border-gray-600 bg-surface-dark-lighter text-primary focus:ring-primary cursor-pointer"
	/>
	<label for={id} class="mr-2 block text-sm text-gray-300 cursor-pointer">
		{label}
	</label>
</div>
