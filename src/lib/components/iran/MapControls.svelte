<script>
	import { createEventDispatcher } from 'svelte';
	
	export let isRotating = true;
	export let showRotation = true;
	export let showReset = true;
	export let showToggleWater = true;
	export let showOnlyWaterBtn = true;
	
	const dispatch = createEventDispatcher();
	
	$: rotationButtonText = isRotating ? '⏸️ توقف چرخش' : '▶️ شروع چرخش';
</script>

<div class="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-3">
	{#if showRotation}
	<button 
		class="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 backdrop-blur-[10px] transition-all duration-300 hover:from-cyan-400/40 hover:to-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
		on:click={() => dispatch('toggleRotation')}
	>
		{rotationButtonText}
	</button>
	{/if}
	{#if showReset}
	<button 
		class="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 backdrop-blur-[10px] transition-all duration-300 hover:from-cyan-400/40 hover:to-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
		on:click={() => dispatch('resetView')}
	>
		🔄 بازنشانی
	</button>
	{/if}
	{#if showToggleWater}
	<button 
		class="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 backdrop-blur-[10px] transition-all duration-300 hover:from-cyan-400/40 hover:to-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
		on:click={() => dispatch('toggleWater')}
	>
		💧 پنهان/نمایش دریاها
	</button>
	{/if}
	{#if showOnlyWaterBtn}
	<button 
		class="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 backdrop-blur-[10px] transition-all duration-300 hover:from-cyan-400/40 hover:to-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
		on:click={() => dispatch('showOnlyWater')}
	>
		🌊 فقط دریاها
	</button>
	{/if}
</div>
