<script>
	import { Header, RightPanel, LeftPanel, MapControls, TimeLine } from '$lib/components/dashboard';
	import Iran from '$lib/components/iran/Iran.svelte';
	
	let iranMap;
	let showPanels = true;
	
	function handleZoomIn() {
		console.log('ZoomIn clicked');
		if (iranMap) iranMap.zoomIn();
	}
	
	function handleZoomOut() {
		console.log('ZoomOut clicked');
		if (iranMap) iranMap.zoomOut();
	}
	
	function handleToggleLayers() {
		console.log('ToggleLayers clicked');
		if (iranMap) iranMap.toggleControlPanel();
	}
	
	function handleFullscreen() {
		console.log('Fullscreen clicked, showPanels:', showPanels);
		// Toggle panels visibility
		showPanels = !showPanels;
		// Update map size after transition
		setTimeout(() => {
			if (iranMap) iranMap.updateSize();
		}, 350); // Wait for transition to complete (300ms + buffer)
	}
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
		<main class="flex-1 bg-black relative flex flex-col transition-all duration-300 {showPanels ? 'mr-16 ml-96' : ''}">
			<!-- Iran 3D Map -->
			<div class="absolute inset-0 z-0">
				<Iran 
					bind:this={iranMap}
					showControlPanel={false}
					showInfoPanel={false}
					showMapControls={false}
				/>
			</div>
			
			<!-- Map Controls -->
			<MapControls 
				on:zoomIn={handleZoomIn}
				on:zoomOut={handleZoomOut}
				on:toggleLayers={handleToggleLayers}
				on:toggleFullscreen={handleFullscreen}
			/>
			
			<!-- Timeline -->
			<TimeLine />
		</main>
		
		<!-- Right Sidebar (Icons) - سمت راست -->
		{#if showPanels}
			<RightPanel />
		{/if}
		
		<!-- Left Sidebar (Widgets) - سمت چپ -->
		{#if showPanels}
			<LeftPanel />
		{/if}
	</div>
</div>
