<script>
	/**
	 * AuthLayout - لایه‌بندی صفحات احراز هویت
	 */
</script>

<div class="bg-background-dark text-gray-100 min-h-screen flex items-center justify-center p-4" dir="rtl">
	<div class="w-full max-w-md">
		<div class="bg-surface-dark border border-gray-800 rounded-xl shadow-2xl shadow-primary/10 p-8">
			<slot />
		</div>
		<slot name="footer" />
	</div>
</div>
