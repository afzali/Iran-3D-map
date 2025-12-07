<script>
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Logo, FormInput, Button, Checkbox } from '$lib/components/auth';
	
	let email = '';
	let password = '';
	let rememberMe = false;
	let loading = false;
	let error = '';
	
	async function handleSubmit() {
		loading = true;
		error = '';
		
		try {
			console.log('Login attempt:', { email, password, rememberMe });
			await new Promise(resolve => setTimeout(resolve, 1000));
			goto('/dashboard');
		} catch (err) {
			error = 'خطا در ورود به حساب کاربری';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>ورود - هومان</title>
</svelte:head>

<!-- Header -->
<div 
	class="flex flex-col items-center mb-8"
	in:fade={{ duration: 300, delay: 100 }}
>
	<div class="mb-4">
		<Logo size="md" />
	</div>
	<h1 class="text-2xl font-bold text-white">هومان - نبض انسانیت</h1>
	<p class="text-gray-400 mt-2 text-sm">وارد حساب کاربری خود شوید</p>
</div>

<!-- Error Message -->
{#if error}
	<div 
		class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-400 text-sm text-center"
		in:fade={{ duration: 200 }}
	>
		{error}
	</div>
{/if}

<!-- Login Form -->
<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<div in:fly={{ y: 20, duration: 400, delay: 150, easing: quintOut }}>
		<FormInput
			id="email"
			label="نام کاربری یا ایمیل"
			type="email"
			placeholder="example@email.com"
			icon="person"
			bind:value={email}
			autocomplete="email"
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 250, easing: quintOut }}>
		<FormInput
			id="password"
			label="رمز عبور"
			type="password"
			placeholder="********"
			icon="lock"
			bind:value={password}
			autocomplete="current-password"
		/>
	</div>
	
	<div 
		class="flex items-center justify-between"
		in:fly={{ y: 20, duration: 400, delay: 350, easing: quintOut }}
	>
		<div class="text-sm">
			<a href="/forgot-password" class="font-medium text-primary hover:text-accent-purple transition-colors">
				رمز عبور خود را فراموش کرده‌اید؟
			</a>
		</div>
		<Checkbox
			id="remember-me"
			label="مرا به خاطر بسپار"
			bind:checked={rememberMe}
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 450, easing: quintOut }}>
		<Button type="submit" {loading}>
			ورود به حساب کاربری
		</Button>
	</div>
</form>

<p 
	class="mt-8 text-center text-sm text-gray-500"
	in:fade={{ duration: 400, delay: 500 }}
>
	حساب کاربری ندارید؟
	<a href="/register" class="font-medium text-primary hover:text-accent-purple">ثبت نام کنید</a>
</p>
