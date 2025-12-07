<script>
	export let provinceName = 'نقشه سه‌بعدی ایران';
	export let provinceInfo = 'موس را روی استان‌ها حرکت دهید';
	export let provinceColor = '#00ffff';
</script>

<div 
	class="absolute top-5 right-5 z-50 min-w-[250px] rounded-xl border-2 border-cyan-400/40 bg-[rgba(0,10,20,0.95)] px-6 py-5 backdrop-blur-[15px]"
	style="box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);"
>
	<div 
		class="mb-2 text-2xl font-bold"
		style="color: {provinceColor}; text-shadow: 0 0 15px {provinceColor};"
	>
		{provinceName}
	</div>
	<div class="text-sm text-white/80">
		{provinceInfo}
	</div>
</div>
