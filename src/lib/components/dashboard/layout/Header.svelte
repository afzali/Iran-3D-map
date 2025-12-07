<script>
	import { Avatar, IconButton, MenuTab, CitySelector, WeatherInfo } from '../ui';
	
	/**
	 * Header - هدر اصلی داشبورد
	 * @prop {string} title - عنوان سایت
	 * @prop {string} avatarSrc - آدرس آواتار
	 * @prop {Array} tabs - لیست تب‌ها
	 * @prop {string} activeTab - تب فعال
	 * @prop {string} city - شهر انتخابی
	 * @prop {string} time - ساعت
	 * @prop {string} aqi - شاخص کیفیت هوا
	 */
	export let title = 'هومان - نبض انسانیت';
	export let avatarSrc = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7nMgg7lBJUr91M94TZvj9h2GkkFxMFUdOc5-Fucdj55r5U6giatL-4TK7CmxV9yXlpqqxDZdIg8dj7CGZWokjLTKRJINrbdOkBLJt0SELO9Y7-0aj8X7fHZbnO4SroAP_m1G9WlYum1QCpcd41Wh905ZzNXIX27CJXXYLvFK8vtfXK8fFa9gJCKy-MB5RYv9MiQHmNuH13idf-dFXJ-dqUFomuSzoUbz1VLP5NaKerWAOuJd5Y6RdLHFKqIJvejUaUU9KGNizvMHK';
	export let tabs = [
		{ id: 'about', label: 'درباره هومان', href: '#' },
		{ id: 'rescuer', label: 'ناجی باشیم', href: '#' },
		{ id: 'rescuers', label: 'نجات دهندگان', href: '#' },
		{ id: 'rescued', label: 'نجات یافتگان', href: '#' }
	];
	export let activeTab = 'rescued';
	export let city = 'تهران';
	export let time = '۱۱:۵۵ ق.ظ';
	export let aqi = '۲۷۰';
</script>

<header class="h-16 border-b border-gray-800 bg-surface-dark/95 flex items-center justify-between px-4 z-20 shrink-0">
	<!-- Right Side (Logo & Title) - سمت راست -->
	<div class="flex items-center gap-3">
		<IconButton icon="grid_view" variant="ghost" iconStyle="filled" />
		<div class="w-8 h-8">
			<svg class="text-gray-200" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
				<path d="M2 16C2 16 5 12 12 12C19 12 22 16 22 16" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
			</svg>
		</div>
		<div class="text-right">
			<h1 class="font-bold text-lg text-white">{title}</h1>
		</div>
	</div>
	
	<!-- Center (Navigation) -->
	<nav class="hidden md:flex items-center gap-8 text-sm flex-row-reverse">
		{#each tabs as tab (tab.id)}
			<MenuTab label={tab.label} href={tab.href} active={activeTab === tab.id} />
		{/each}
	</nav>
	
	<!-- Left Side (User Actions) - سمت چپ -->
	<div class="flex items-center gap-4">
		<CitySelector {city} />
		<WeatherInfo {time} {aqi} />
		<IconButton icon="notifications" variant="ghost" />
		<Avatar src={avatarSrc} />
	</div>
</header>
