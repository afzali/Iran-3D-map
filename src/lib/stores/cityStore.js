import { writable } from 'svelte/store';

// City data with coordinates for weather API
export const cities = {
	'تهران': { lat: 35.6892, lon: 51.3890 },
	'مشهد': { lat: 36.2605, lon: 59.6168 },
	'اصفهان': { lat: 32.6546, lon: 51.6680 },
	'شیراز': { lat: 29.5918, lon: 52.5837 },
	'تبریز': { lat: 38.0800, lon: 46.2919 },
	'کرج': { lat: 35.8400, lon: 50.9391 },
	'اهواز': { lat: 31.3183, lon: 48.6706 },
	'قم': { lat: 34.6401, lon: 50.8764 },
	'کرمانشاه': { lat: 34.3142, lon: 47.0650 },
	'ارومیه': { lat: 37.5527, lon: 45.0761 },
	'رشت': { lat: 37.2808, lon: 49.5832 },
	'زاهدان': { lat: 29.4963, lon: 60.8629 },
	'کرمان': { lat: 30.2839, lon: 57.0834 },
	'همدان': { lat: 34.7990, lon: 48.5150 },
	'یزد': { lat: 31.8974, lon: 54.3569 },
	'اردبیل': { lat: 38.2498, lon: 48.2933 },
	'بندرعباس': { lat: 27.1865, lon: 56.2808 },
	'قزوین': { lat: 36.2688, lon: 50.0041 },
	'سنندج': { lat: 35.3219, lon: 46.9862 },
	'گرگان': { lat: 36.8427, lon: 54.4353 }
};

// Selected city store
export const selectedCity = writable('تهران');

// Weather data store
export const weatherData = writable({
	temp: null,
	icon: 'wb_sunny',
	iconColor: 'text-yellow-500',
	loading: true
});

// Fetch weather from Open-Meteo API
export async function fetchWeather(cityName) {
	const city = cities[cityName];
	if (!city) return;
	
	weatherData.update(w => ({ ...w, loading: true }));
	
	try {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&timezone=Asia/Tehran`
		);
		const data = await response.json();
		
		const temp = Math.round(data.current.temperature_2m);
		const weatherCode = data.current.weather_code;
		
		// Map weather code to icon and color
		const { icon, color } = getWeatherIcon(weatherCode);
		
		weatherData.set({
			temp,
			icon,
			iconColor: color,
			loading: false
		});
	} catch (error) {
		console.error('Failed to fetch weather:', error);
		weatherData.update(w => ({ ...w, loading: false }));
	}
}

// Map WMO weather codes to Material Icons (using only valid outlined icons)
function getWeatherIcon(code) {
	// Clear sky
	if (code === 0) return { icon: 'wb_sunny', color: 'text-yellow-500' };
	
	// Mainly clear, partly cloudy
	if (code === 1 || code === 2) return { icon: 'wb_cloudy', color: 'text-yellow-400' };
	
	// Overcast
	if (code === 3) return { icon: 'cloud', color: 'text-gray-400' };
	
	// Fog
	if (code >= 45 && code <= 48) return { icon: 'cloud', color: 'text-gray-500' };
	
	// Drizzle
	if (code >= 51 && code <= 57) return { icon: 'water_drop', color: 'text-blue-300' };
	
	// Rain
	if (code >= 61 && code <= 67) return { icon: 'water_drop', color: 'text-blue-400' };
	
	// Snow
	if (code >= 71 && code <= 77) return { icon: 'ac_unit', color: 'text-blue-200' };
	
	// Rain showers
	if (code >= 80 && code <= 82) return { icon: 'water_drop', color: 'text-blue-500' };
	
	// Snow showers
	if (code >= 85 && code <= 86) return { icon: 'ac_unit', color: 'text-blue-200' };
	
	// Thunderstorm
	if (code >= 95 && code <= 99) return { icon: 'bolt', color: 'text-purple-400' };
	
	// Default
	return { icon: 'wb_sunny', color: 'text-yellow-500' };
}
