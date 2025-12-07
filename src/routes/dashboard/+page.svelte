<script>
	import { Header, RightPanel, LeftPanel, MapControls, TimeLine } from '$lib/components/dashboard';
</script>

<svelte:head>
	<title>داشبورد هومان - نبض انسانیت</title>
	<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round" rel="stylesheet" />
</svelte:head>

<div class="bg-background-dark text-gray-200 h-screen w-screen flex flex-col overflow-hidden" dir="rtl">
	<!-- Header -->
	<Header />
	
	<!-- Main Content -->
	<div class="flex flex-1 h-[calc(100vh-4rem)] relative">
		<!-- Main Map Area -->
		<main class="flex-1 bg-black relative flex flex-col mr-16 ml-96">
			<!-- Background Gradient -->
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-50 z-0"></div>
			
			<!-- Map Controls -->
			<MapControls />
			
			<!-- Map Placeholder - اینجا می‌تونید نقشه واقعی رو قرار بدید -->
			<div class="absolute inset-0 flex items-center justify-center z-5">
				<div class="text-gray-600 text-lg">
					<!-- نقشه ایران اینجا قرار می‌گیرد -->
				</div>
			</div>
			
			<!-- Timeline -->
			<TimeLine />
		</main>
		
		<!-- Right Sidebar (Icons) - سمت راست -->
		<RightPanel />
		
		<!-- Left Sidebar (Widgets) - سمت چپ -->
		<LeftPanel />
	</div>
</div>
