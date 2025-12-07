<script>
	import { HonorWidget, RescueWidget, PerformanceWidget, DonorWidget } from '../widgets';
	
	/**
	 * LeftPanel - پنل سمت چپ (ویجت‌ها)
	 */
</script>

<aside class="w-96 bg-surface-dark/95 backdrop-blur border-l border-gray-800 flex flex-col gap-5 p-6 overflow-y-auto shrink-0 z-20 absolute left-0 top-0 bottom-0 h-full scrollbar-hide">
	<HonorWidget />
	<RescueWidget />
	<PerformanceWidget />
	<DonorWidget />
</aside>
