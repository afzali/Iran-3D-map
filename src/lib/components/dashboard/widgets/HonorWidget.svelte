<script>
	import { StatCard } from '../ui';
	
	/**
	 * HonorWidget - ویجت افتخارات
	 * @prop {Array} stats - آمار افتخارات
	 */
	export let stats = [
		{ icon: 'electric_bolt', value: '۳.۴', unit: 'هزار', label: 'تعداد شوک‌ها' },
		{ icon: 'monitor_heart', value: '۱.۲', unit: 'میلیون', label: 'ضربان برگشته' },
		{ icon: 'favorite_border', value: '۵۴۱', unit: 'نفر', label: 'جان‌های نجات‌یافته' }
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
