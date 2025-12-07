<script>
	/**
	 * CitySelector - انتخاب شهر
	 * @prop {string} city - نام شهر
	 */
	export let city = 'تهران';
</script>

<div class="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 cursor-pointer hover:bg-gray-700 transition">
	<span class="material-icons-outlined text-sm">location_on</span>
	<span>{city}</span>
	<span class="material-icons-outlined text-sm">expand_more</span>
</div>
