<script>
	/**
	 * WeatherInfo - نمایش ساعت و هوا
	 * @prop {string} time - ساعت
	 * @prop {string} aqi - شاخص کیفیت هوا
	 * @prop {string} weatherIcon - آیکون هوا
	 * @prop {string} weatherColor - رنگ آیکون هوا
	 */
	export let time = '۱۱:۵۵ ق.ظ';
	export let aqi = '۲۷۰';
	export let weatherIcon = 'wb_sunny';
	export let weatherColor = 'text-yellow-500';
</script>

<div class="flex items-center text-xs text-gray-400 gap-2 border-r border-gray-700 pr-4 mr-2">
	<span class="material-icons-outlined text-sm {weatherColor}">{weatherIcon}</span>
	<span>{time}</span>
	<span class="text-gray-600">|</span>
	<span>{aqi}</span>
</div>
