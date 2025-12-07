<script>
	import { selectedCity, cities } from '$lib/stores/cityStore';
	
	/**
	 * CitySelector - انتخاب شهر
	 */
	
	let isOpen = false;
	let cityList = Object.keys(cities);
	
	function toggleDropdown() {
		isOpen = !isOpen;
	}
	
	function selectCity(city) {
		selectedCity.set(city);
		isOpen = false;
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.city-selector')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="city-selector relative">
	<button 
		class="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 cursor-pointer hover:bg-gray-700 transition"
		on:click|stopPropagation={toggleDropdown}
	>
		<span class="material-icons-outlined text-sm">location_on</span>
		<span>{$selectedCity}</span>
		<span class="material-icons-outlined text-sm transition-transform" class:rotate-180={isOpen}>expand_more</span>
	</button>
	
	{#if isOpen}
	<div class="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto min-w-32">
		{#each cityList as city}
			<button
				class="w-full text-right px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition first:rounded-t-lg last:rounded-b-lg"
				class:bg-gray-700={city === $selectedCity}
				on:click={() => selectCity(city)}
			>
				{city}
			</button>
		{/each}
	</div>
	{/if}
</div>
