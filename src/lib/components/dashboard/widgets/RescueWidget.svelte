<script>
	/**
	 * RescueWidget - ویجت افراد نجات یافته (نمودار میله‌ای)
	 * @prop {string} title - عنوان ویجت
	 * @prop {Array} data - داده‌های نمودار
	 * @prop {Array} labels - برچسب‌های محور X
	 */
	export let title = 'افراد نجات یافته';
	export let data = [
		{ purple: 8, blue: 6 },
		{ purple: 10, blue: 4 },
		{ purple: 12, blue: 5 },
		{ purple: 16, blue: 8 },
		{ purple: 8, blue: 10 }
	];
	export let labels = ['کودک', 'نوجوان', 'جوان', 'میان سال', 'سالمند'];
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-5 text-center">{title}</h3>
	<div class="h-40 flex items-end justify-around px-4 relative">
		<!-- Grid Lines -->
		<div class="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
			<div class="w-full h-px bg-gray-700/30"></div>
			<div class="w-full h-px bg-gray-700/30"></div>
			<div class="w-full h-px bg-gray-700/30"></div>
			<div class="w-full h-px bg-gray-700/30"></div>
		</div>
		
		<!-- Bars -->
		{#each data as bar, i}
			<div class="w-4 flex flex-col gap-1 z-10 group">
				<div 
					class="w-full bg-chart-purple rounded-t-sm opacity-80 group-hover:opacity-100 transition"
					style="height: {bar.purple * 4}px;"
				></div>
				<div 
					class="w-full bg-chart-blue rounded-b-sm opacity-80 group-hover:opacity-100 transition"
					style="height: {bar.blue * 4}px;"
				></div>
			</div>
		{/each}
	</div>
	
	<!-- Labels -->
	<div class="flex justify-between text-xs text-gray-500 mt-4 px-3">
		{#each labels as label}
			<span>{label}</span>
		{/each}
	</div>
</div>
