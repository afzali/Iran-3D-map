<script>
	import { provinceData, selectedTimelineIndex, toggleTimelineSelection } from '$lib/stores/provinceDataStore.js';
	
	/**
	 * TimeLine - تایم‌لاین پایین صفحه (داینامیک)
	 */
	const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
	
	$: data = $provinceData.timeline;
	$: maxVal = Math.max(...data.map((d) => d.value));
	
	let hoveredIndex = -1;
	
	function getBarColor(type, index) {
		if ($selectedTimelineIndex === index) return '#22d3ee'; // cyan when selected
		if (hoveredIndex === index) return '#ffffff'; // white on hover
		if (type === 'warning') return '#ca8a04'; // yellow-600
		if (type === 'danger') return '#dc2626'; // red-600
		return '#374151'; // gray-700
	}
	
	function getBarOpacity(type, index) {
		if ($selectedTimelineIndex === index || hoveredIndex === index) return 1;
		if (type === 'normal') return 0.5;
		return 1;
	}
	
	function handleBarClick(index) {
		toggleTimelineSelection(index);
	}
</script>

<div class="absolute bottom-0 right-16 left-0 h-32 bg-gradient-to-t from-surface-dark to-transparent z-10 flex items-end pb-4 pr-4 pl-4">
	<div class="w-full h-20 bg-surface-dark/40 backdrop-blur-sm border border-gray-800 rounded-lg flex flex-col px-4 py-2">
		<!-- Bars -->
		<div class="flex items-end justify-between h-full gap-[2px] w-full px-2 relative">
			{#each data as bar, i}
				<div
					class="w-1 rounded-t transition-all cursor-pointer relative"
					style="height: {(bar.value / maxVal) * 100}%; background: {getBarColor(bar.type, i)}; opacity: {getBarOpacity(bar.type, i)};"
					on:mouseenter={() => hoveredIndex = i}
					on:mouseleave={() => hoveredIndex = -1}
					on:click={() => handleBarClick(i)}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && handleBarClick(i)}
				>
					<!-- Tooltip on hover -->
					{#if hoveredIndex === i}
						<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white shadow-lg whitespace-nowrap z-50 pointer-events-none">
							<div class="font-medium">{bar.month} - روز {bar.day}</div>
							<div class="text-gray-400">مقدار: {bar.value}</div>
						</div>
					{/if}
					
					<!-- Highlight indicator for selected -->
					{#if $selectedTimelineIndex === i}
						<div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
					{/if}
				</div>
			{/each}
		</div>
		
		<!-- Month Labels -->
		<div class="flex justify-between text-[10px] text-gray-500 mt-1 px-2 w-full">
			{#each months as month}
				<span>{month}</span>
			{/each}
		</div>
	</div>
</div>
