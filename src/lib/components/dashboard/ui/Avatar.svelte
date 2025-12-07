<script>
	/**
	 * Avatar - کامپوننت آواتار کاربر
	 * @prop {string} src - آدرس تصویر
	 * @prop {string} alt - متن جایگزین
	 * @prop {string} size - اندازه: 'sm' | 'md' | 'lg'
	 */
	export let src = '';
	export let alt = 'User Avatar';
	export let size = 'md';
	
	
	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-10 h-10'
	};
</script>

<div class="{sizeClasses[size]} rounded-full bg-gray-700 overflow-hidden border border-gray-600 p-1">
	{#if src}
		<img {src} {alt} class="w-full h-full object-cover opacity-80" />
	{:else}
		<div class="w-full h-full flex items-center justify-center text-gray-400">
			<span class="material-icons-outlined text-sm">کاربر</span>
		</div>
	{/if}
</div>
