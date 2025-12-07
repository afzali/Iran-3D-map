<script>
	import { provinceData } from '$lib/stores/provinceDataStore.js';

	/**
	 * PerformanceWidget - ویجت عملکرد دستگاه‌ها (Bar + Tooltip)
	 */
	export let title = 'وضعیت عملکرد دستگاه‌ها (زمان عملکرد / نجات)';

	$: data = $provinceData.performance;
	$: maxVal = Math.max(...data.map((d) => d.operationTime));

	let hoveredIndex = -1;
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-4 text-center">{title}</h3>
	<div class="h-44 flex items-end gap-0.5 px-2 relative">
		{#each data as d, i}
			<div
				class="flex-1 rounded-t-sm transition-all cursor-pointer relative group"
				style="height: {(d.operationTime / maxVal) * 100}%; background: {i % 2 === 0 ? '#a855f7' : '#22d3ee'}; opacity: {hoveredIndex === i ? 1 : 0.7};"
				on:mouseenter={() => hoveredIndex = i}
				on:mouseleave={() => hoveredIndex = -1}
				role="button"
				tabindex="0"
			>
				<!-- Tooltip -->
				{#if hoveredIndex === i}
					<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white shadow-lg whitespace-nowrap z-50">
						<div class="font-medium">{d.device}</div>
						<div class="flex gap-2 mt-1">
							<span class="text-purple-400">زمان: {d.operationTime}%</span>
							<span class="text-cyan-400">نجات: {d.rescueCount}</span>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="flex justify-center gap-4 text-xs text-gray-400 mt-2">
		<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-purple-500"></span> زمان عملکرد</span>
		<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-cyan-400"></span> تعداد نجات</span>
	</div>
</div>
