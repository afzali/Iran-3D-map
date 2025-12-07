<script>
	import { provinceData } from '$lib/stores/provinceDataStore.js';

	/**
	 * DonorWidget - ویجت خیرین استان‌ها (Horizontal Bar with Inside Labels)
	 */
	export let title = 'خیرین استان‌ها';

	$: data = $provinceData.donors;
	$: maxVal = Math.max(...data.map((d) => d.amount));
</script>

<div class="bg-[#1e1e24] rounded-lg p-4 border border-gray-800 w-full">
	<h3 class="text-gray-300 text-sm mb-4 text-center">{title}</h3>
	<div class="flex flex-col gap-2">
		{#each data as d, i}
			<div class="relative h-6 bg-gray-800/50 rounded overflow-hidden">
				<div
					class="absolute inset-y-0 right-0 rounded transition-all"
					style="width: {(d.amount / maxVal) * 100}%; background: {i % 2 === 0 ? '#a855f7' : '#22d3ee'};"
				></div>
				<div class="absolute inset-0 flex items-center justify-between px-2 text-xs">
					<span class="text-white font-medium z-10">{d.amount} میلیون</span>
					<span class="text-gray-300 z-10">{d.province}</span>
				</div>
			</div>
		{/each}
	</div>
</div>
