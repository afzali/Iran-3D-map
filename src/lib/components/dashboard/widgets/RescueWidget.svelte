<script>
	import { provinceData } from '$lib/stores/provinceDataStore.js';

	/**
	 * RescueWidget - ویجت افراد نجات یافته (نمودار Diverging)
	 */
	export let title = 'افراد نجات یافته';

	$: data = $provinceData.rescue;
	$: maxVal = Math.max(...data.map((d) => Math.max(d.male, d.female)));
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-4 text-center">{title}</h3>
	<div class="h-40 flex items-center justify-around px-4 relative">
		<!-- Center baseline -->
		<div class="absolute w-full h-px bg-gray-600 top-1/2 left-0 z-0"></div>
		
		<!-- Diverging bars -->
		{#each data as d, i}
			<div class="flex flex-col items-center gap-0 z-10">
				<!-- Male bar (goes up) -->
				<div 
					class="w-4 bg-purple-500 rounded-t-sm transition-all"
					style="height: {(d.male / maxVal) * 60}px;"
				></div>
				<!-- Female bar (goes down) -->
				<div 
					class="w-4 bg-cyan-400 rounded-b-sm transition-all"
					style="height: {(d.female / maxVal) * 60}px;"
				></div>
			</div>
		{/each}
	</div>
	
	<!-- Labels -->
	<div class="flex justify-around text-xs text-gray-500 mt-2 px-3">
		{#each data as d}
			<span>{d.label}</span>
		{/each}
	</div>
	
	<div class="flex justify-center gap-4 text-xs text-gray-400 mt-3">
		<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-purple-500"></span> مرد</span>
		<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-cyan-400"></span> زن</span>
	</div>
</div>
