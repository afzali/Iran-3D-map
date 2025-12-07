<script>
	import { onMount, onDestroy } from 'svelte';
	import { selectedCity, weatherData, fetchWeather } from '$lib/stores/cityStore';
	
	/**
	 * WeatherInfo - نمایش ساعت و هوا
	 */
	
	let currentTime = '';
	let interval;
	
	// Convert to Persian numerals
	function toPersianNum(num) {
		const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
		return num.toString().replace(/\d/g, d => persianDigits[d]);
	}
	
	// Update time
	function updateTime() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const period = hours >= 12 ? 'ب.ظ' : 'ق.ظ';
		const displayHours = hours % 12 || 12;
		currentTime = `${toPersianNum(displayHours)}:${toPersianNum(minutes)} ${period}`;
	}
	
	onMount(() => {
		updateTime();
		interval = setInterval(updateTime, 1000);
		
		// Fetch weather for initial city
		fetchWeather($selectedCity);
	});
	
	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
	
	// Refetch weather when city changes
	$: if ($selectedCity) {
		fetchWeather($selectedCity);
	}
</script>

<div class="flex items-center text-xs text-gray-400 gap-2 border-r border-gray-700 pr-4 mr-2">
	<span class="material-icons-outlined text-sm {$weatherData.iconColor}">{$weatherData.icon}</span>
	<span>{currentTime}</span>
	<span class="text-gray-600">|</span>
	{#if $weatherData.loading}
		<span>...</span>
	{:else if $weatherData.temp !== null}
		<span>{toPersianNum($weatherData.temp)}°</span>
	{:else}
		<span>--</span>
	{/if}
</div>
