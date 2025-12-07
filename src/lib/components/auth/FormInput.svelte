<script>
	/**
	 * FormInput - فیلد ورودی با آیکون
	 * @prop {string} id - شناسه فیلد
	 * @prop {string} label - برچسب فیلد
	 * @prop {string} type - نوع فیلد (text, email, password)
	 * @prop {string} placeholder - متن راهنما
	 * @prop {string} icon - آیکون Material Symbols
	 * @prop {string} value - مقدار فیلد
	 * @prop {boolean} required - الزامی بودن
	 * @prop {string} autocomplete - نوع autocomplete
	 * @prop {boolean} ltr - چپ چین بودن متن (برای ایمیل و پسورد)
	 */
	export let id = '';
	export let label = '';
	export let type = 'text';
	export let placeholder = '';
	export let icon = 'person';
	export let value = '';
	export let required = true;
	export let autocomplete = '';
	export let ltr = false;
	
	// Auto-detect LTR for email and password
	$: isLtr = ltr || type === 'email' || type === 'password';
</script>

<div>
	<label class="block text-sm font-medium text-gray-300 mb-2 text-right" for={id}>
		{label}
	</label>
	<div class="relative">
		<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
			{icon}
		</span>
		<input
			{id}
			name={id}
			{type}
			{placeholder}
			{required}
			{autocomplete}
			bind:value
			dir={isLtr ? 'ltr' : 'rtl'}
			class="block w-full bg-surface-dark-lighter border border-gray-700 rounded-lg py-3 pr-10 pl-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
			class:text-left={isLtr}
			class:text-right={!isLtr}
		/>
	</div>
</div>
