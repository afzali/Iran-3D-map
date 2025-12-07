<script>
	import { page } from '$app/stores';
	
	// Determine if we're on login or register
	$: isRegister = $page.url.pathname.includes('register');
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="bg-background-dark text-gray-100 min-h-screen flex items-center justify-center p-4 overflow-hidden" dir="rtl">
	<div
		class="w-full max-w-md transition-all duration-500 ease-out"
		class:scale-100={!isRegister}
		class:scale-[0.98]={isRegister}
	>
		<div 
			class="bg-surface-dark border border-gray-800 rounded-xl shadow-2xl shadow-primary/10 transition-all duration-500 ease-out overflow-hidden"
			class:p-8={!isRegister}
			class:p-6={isRegister}
		>
			<slot />
		</div>
	</div>
</div>
