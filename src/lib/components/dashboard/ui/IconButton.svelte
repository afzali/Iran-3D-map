<script>
	/**
	 * IconButton - دکمه آیکونی قابل استفاده مجدد
	 * @prop {string} icon - نام آیکون Material Icons
	 * @prop {string} variant - نوع دکمه: 'default' | 'active' | 'ghost'
	 * @prop {string} size - اندازه: 'sm' | 'md' | 'lg'
	 * @prop {string} iconStyle - استایل آیکون: 'outlined' | 'filled' | 'round'
	 * @prop {string} iconColor - رنگ آیکون (Tailwind class)
	 * @prop {Function} onclick - رویداد کلیک
	 */
	export let icon = 'help';
	export let variant = 'default';
	export let size = 'md';
	export let iconStyle = 'outlined';
	export let iconColor = '';
	export let onclick = null;
	
	const sizeClasses = {
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-xl',
		lg: 'w-12 h-12 text-2xl'
	};
	
	const variantClasses = {
		default: 'text-gray-500 hover:text-white transition',
		active: 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition',
		ghost: 'text-gray-400 hover:text-white transition'
	};
	
	const iconStyleClass = {
		outlined: 'material-icons-outlined',
		filled: 'material-icons',
		round: 'material-icons-round'
	};
	
	$: buttonClass = `flex items-center justify-center rounded-xl ${sizeClasses[size]} ${variantClasses[variant]}`;
	$: iconClass = `${iconStyleClass[iconStyle]} ${iconColor}`;
</script>

<button class={buttonClass} on:click={onclick}>
	<span class={iconClass}>{icon}</span>
</button>
