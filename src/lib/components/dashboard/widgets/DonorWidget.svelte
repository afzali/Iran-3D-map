<script>
	/**
	 * DonorWidget - ویجت خیرین استان‌ها
	 * @prop {string} title - عنوان ویجت
	 * @prop {Array} data - داده‌های نمودار
	 * @prop {Array} labels - برچسب‌های استان‌ها
	 */
	export let title = 'خیرین استان‌ها';
	export let data = [
		{ height: 10, offset: -8, color: 'blue' },
		{ height: 12, offset: 4, color: 'purple' },
		{ height: 8, offset: -4, color: 'blue' },
		{ height: 14, offset: 6, color: 'purple' },
		{ height: 6, offset: -2, color: 'blue' },
		{ height: 10, offset: 2, color: 'purple' },
		{ height: 12, offset: -6, color: 'blue' },
		{ height: 8, offset: 1, color: 'purple' },
		{ height: 16, offset: -10, color: 'blue' },
		{ height: 4, offset: 2, color: 'purple' },
		{ height: 10, offset: -4, color: 'blue' },
		{ height: 12, offset: 6, color: 'purple' }
	];
	export let labels = ['تهران', 'خراسان', 'تبریز', 'اردبیل', 'کرمان', 'مازندران', 'سیستان', 'سمنان', 'اصفهان'];
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-5 text-center">{title}</h3>
	<div class="h-40 relative flex items-center justify-between px-3 flex-row-reverse">
		<!-- Center Line -->
		<div class="absolute w-full h-px bg-white/20 top-1/2 left-0 z-0"></div>
		
		<!-- Bars -->
		{#each data as bar, i}
			<div 
				class="w-2 rounded-full z-10 {bar.color === 'blue' ? 'bg-chart-blue' : 'bg-chart-purple'}"
				style="height: {bar.height * 4}px; margin-bottom: {bar.offset * 4}px;"
			></div>
		{/each}
	</div>
	
	<!-- Labels -->
	<div class="flex justify-between text-[11px] text-gray-500 mt-4 px-2 text-center ">
		{#each labels as label}
			<span>{label}</span>
		{/each}
	</div>
</div>
