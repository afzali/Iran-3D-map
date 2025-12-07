<script>
	import { IconButton } from '../ui';
	
	/**
	 * RightPanel - پنل سمت راست (sidebar آیکون‌ها)
	 * @prop {Array} topButtons - دکمه‌های بالا
	 * @prop {Array} bottomButtons - دکمه‌های پایین
	 */
	export let topButtons = [
		{ icon: 'public', variant: 'active' },
		{ icon: 'chat_bubble_outline', variant: 'default' },
		{ icon: 'pie_chart', variant: 'default' },
		{ icon: 'verified_user', variant: 'default' }
	];
	export let bottomButtons = [
		// { icon: 'logout', variant: 'default' },
		{ icon: 'help_outline', variant: 'default' }
	];
</script>

<aside class="w-16 bg-surface-dark border-r border-gray-800 flex flex-col items-center py-4 gap-6 shrink-0 z-10 absolute right-0 top-0 bottom-0 h-full">
	<!-- Top Buttons -->
	{#each topButtons as btn (btn.icon)}
		<IconButton icon={btn.icon} variant={btn.variant} />
	{/each}
	
	<!-- Bottom Buttons -->
	<div class="mt-auto flex flex-col gap-4">
		{#each bottomButtons as btn (btn.icon)}
			<IconButton icon={btn.icon} variant={btn.variant} />
		{/each}
	</div>
</aside>
