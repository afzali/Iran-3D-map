<script>
	import { StatCard } from '../ui';
	import { provinceData } from '$lib/stores/provinceDataStore.js';
	
	/**
	 * HonorWidget - ویجت افتخارات (داینامیک)
	 */
	
	// Convert number to Persian digits
	function toPersianDigits(num) {
		const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
		return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
	}
	
	$: stats = [
		{ icon: 'electric_bolt', value: toPersianDigits($provinceData.honor.shocks), unit: 'هزار', label: 'تعداد شوک‌ها' },
		{ icon: 'monitor_heart', value: toPersianDigits($provinceData.honor.heartbeats), unit: 'میلیون', label: 'ضربان برگشته' },
		{ icon: 'favorite_border', value: toPersianDigits($provinceData.honor.savedLives), unit: 'نفر', label: 'جان‌های نجات‌یافته' }
	];
</script>

<div class="mb-4 w-full">
	<h3 class="text-gray-400 text-sm mb-4 font-bold ">افتخارات</h3>
	<div class="grid grid-cols-3 gap-2" dir="ltr">
		{#each stats as stat (stat.label)}
			<StatCard 
				icon={stat.icon} 
				value={stat.value} 
				unit={stat.unit} 
				label={stat.label} 
			/>
		{/each}
	</div>
</div>
