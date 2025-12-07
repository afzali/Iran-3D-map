<script>
	/**
	 * PerformanceWidget - ویجت عملکرد دستگاه‌ها
	 * @prop {string} title - عنوان ویجت
	 * @prop {Array} bars - داده‌های میله‌ها (درصد ارتفاع)
	 */
	export let title = 'وضعیت عملکرد دستگاه‌ها (زمان عملکرد / نجات)';
	export let bars = [40, 60, 50, 70, 55, 30, 45, 65, 35, 50, 60, 40, 50, 70, 30, 50, 65, 45, 55, 35, 60, 40, 50, 70];
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-5 text-center">{title}</h3>
	<div class="h-40 flex items-end gap-1 px-3 relative">
		{#each bars as height, i}
			<div 
				class="flex-1 rounded-t-sm opacity-70 hover:opacity-100 transition {i % 2 === 0 ? 'bg-chart-purple' : 'bg-chart-cyan'}"
				style="height: {height}%;"
			></div>
		{/each}
	</div>
</div>
