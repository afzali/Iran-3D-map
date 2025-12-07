<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	
	/**
	 * StatCard - کارت آماری قابل استفاده مجدد
	 * @prop {string} icon - نام آیکون Material Icons
	 * @prop {string} value - مقدار اصلی
	 * @prop {string} unit - واحد (نفر، میلیون، هزار)
	 * @prop {string} label - برچسب توضیحی
	 */
	export let icon = 'favorite_border';
	export let value = '۰';
	export let unit = '';
	export let label = '';
	
	// Persian to English digit conversion
	const persianToEnglish = {
		'۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
		'۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
	};
	
	const englishToPersian = {
		'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
		'5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
	};
	
	function toEnglishNumber(str) {
		return String(str).replace(/[۰-۹]/g, (d) => persianToEnglish[d] || d);
	}
	
	function toPersianNumber(num) {
		return String(num).replace(/[0-9]/g, (d) => englishToPersian[d] || d);
	}
	
	// Tweened store for animated counting
	const animatedValue = tweened(0, {
		duration: 600,
		easing: cubicOut
	});
	
	// Track if value has decimal
	let hasDecimal = false;
	
	// Update animated value when prop changes
	$: {
		const englishVal = toEnglishNumber(value);
		const numVal = parseFloat(englishVal);
		hasDecimal = englishVal.includes('.');
		if (!isNaN(numVal)) {
			animatedValue.set(numVal);
		}
	}
	
	// Format the animated value back to Persian
	$: displayValue = toPersianNumber(hasDecimal ? $animatedValue.toFixed(1) : Math.round($animatedValue));
</script>

<div class="bg-[#1e1e24] px-2 py-4 rounded-lg flex flex-col items-center text-center border border-gray-800">
	<span class="material-icons-outlined text-gray-400 text-sm mb-2">{icon}</span>
	<div class="text-white font-bold text-2xl leading-none">{displayValue}</div>
	{#if unit}
		<div class="text-[11px] text-gray-500 mt-2">{unit}</div>
	{/if}
	{#if label}
		<div class="text-[10px] text-gray-400 mt-1">{label}</div>
	{/if}
</div>
