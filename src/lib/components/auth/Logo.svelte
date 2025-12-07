<script>
	/**
	 * Logo - لوگوی هومان
	 * @prop {string} size - اندازه لوگو (sm, md, lg)
	 */
	export let size = 'md';
	
	const sizes = {
		sm: { container: 'w-12 h-12', icon: 'text-3xl' },
		md: { container: 'w-16 h-16', icon: 'text-4xl' },
		lg: { container: 'w-20 h-20', icon: 'text-5xl' }
	};
	
	$: sizeClass = sizes[size] || sizes.md;
</script>

<div class="{sizeClass.container} bg-gradient-to-tr from-primary to-accent-cyan rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
	<span class="material-symbols-rounded {sizeClass.icon}">waves</span>
</div>
