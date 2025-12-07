import { writable, derived } from 'svelte/store';
import { selectedCity, provinceToCity } from './cityStore.js';

// Reverse mapping: city -> province
const cityToProvince = Object.fromEntries(
	Object.entries(provinceToCity).map(([prov, city]) => [city, prov])
);

// Selected province store (derived from selectedCity)
export const selectedProvince = derived(selectedCity, ($city) => {
	return cityToProvince[$city] || 'تهران';
});

// Generate random data for demo purposes
function generateRescueData() {
	return [
		{ label: 'کودک', male: Math.floor(Math.random() * 15) + 5, female: Math.floor(Math.random() * 12) + 3 },
		{ label: 'نوجوان', male: Math.floor(Math.random() * 18) + 4, female: Math.floor(Math.random() * 14) + 2 },
		{ label: 'جوان', male: Math.floor(Math.random() * 20) + 6, female: Math.floor(Math.random() * 16) + 4 },
		{ label: 'میان سال', male: Math.floor(Math.random() * 22) + 8, female: Math.floor(Math.random() * 18) + 5 },
		{ label: 'سالمند', male: Math.floor(Math.random() * 12) + 3, female: Math.floor(Math.random() * 10) + 2 }
	];
}

function generatePerformanceData() {
	const devices = [];
	for (let i = 1; i <= 24; i++) {
		devices.push({
			device: `دستگاه ${i}`,
			operationTime: Math.floor(Math.random() * 80) + 20,
			rescueCount: Math.floor(Math.random() * 50) + 10
		});
	}
	return devices;
}

function generateDonorData() {
	const provinces = ['تهران', 'خراسان', 'تبریز', 'اردبیل', 'کرمان', 'مازندران', 'سیستان', 'سمنان', 'اصفهان'];
	return provinces.map((name) => ({
		province: name,
		amount: Math.floor(Math.random() * 500) + 100
	}));
}

function generateHonorData() {
	return {
		shocks: (Math.random() * 5 + 1).toFixed(1),
		heartbeats: (Math.random() * 2 + 0.5).toFixed(1),
		savedLives: Math.floor(Math.random() * 800) + 200
	};
}

// Province-specific data cache
const provinceDataCache = new Map();

function getOrCreateProvinceData(province) {
	if (!provinceDataCache.has(province)) {
		provinceDataCache.set(province, {
			rescue: generateRescueData(),
			performance: generatePerformanceData(),
			donors: generateDonorData(),
			honor: generateHonorData()
		});
	}
	return provinceDataCache.get(province);
}

// Main data store
export const provinceData = writable({
	rescue: generateRescueData(),
	performance: generatePerformanceData(),
	donors: generateDonorData(),
	honor: generateHonorData()
});

// Update data when province changes
selectedProvince.subscribe((province) => {
	const data = getOrCreateProvinceData(province);
	provinceData.set(data);
});

// Force refresh data for current province
export function refreshProvinceData() {
	let currentProvince;
	selectedProvince.subscribe((p) => (currentProvince = p))();
	
	// Regenerate data
	const newData = {
		rescue: generateRescueData(),
		performance: generatePerformanceData(),
		donors: generateDonorData(),
		honor: generateHonorData()
	};
	provinceDataCache.set(currentProvince, newData);
	provinceData.set(newData);
}
