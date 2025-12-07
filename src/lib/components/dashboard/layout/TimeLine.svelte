<script>
	import { onMount } from 'svelte';
	
	/**
	 * TimeLine - تایم‌لاین پایین صفحه
	 * @prop {Array} months - نام ماه‌ها
	 * @prop {number} barCount - تعداد میله‌ها
	 */
	export let months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
	export let barCount = 120;
	
	let bars = [];
	
	onMount(() => {
		// Generate random bars
		bars = Array.from({ length: barCount }, () => {
			const height = Math.floor(Math.random() * 8) + 2;
			const isActive = Math.random() > 0.9;
			return {
				height: height * 10,
				color: isActive ? (Math.random() > 0.5 ? 'bg-yellow-600' : 'bg-red-600') : 'bg-gray-700',
				opacity: isActive ? 1 : 0.5
			};
		});
	});
</script>

<div class="absolute bottom-0 right-16 left-0 h-32 bg-gradient-to-t from-surface-dark to-transparent z-10 flex items-end pb-4 pr-4 pl-4">
	<div class="w-full h-20 bg-surface-dark/40 backdrop-blur-sm border border-gray-800 rounded-lg flex flex-col px-4 py-2">
		<!-- Bars -->
		<div class="flex items-end justify-between h-full gap-[2px] w-full px-2">
			{#each bars as bar}
				<div 
					class="w-1 rounded-t {bar.color} transition hover:bg-white hover:opacity-100"
					style="height: {bar.height}%; opacity: {bar.opacity};"
				></div>
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
