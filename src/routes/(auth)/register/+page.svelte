<script>
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Logo, FormInput, Button } from '$lib/components/auth';
	
	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	
	async function handleSubmit() {
		if (password !== confirmPassword) {
			error = 'رمز عبور و تایید آن مطابقت ندارند';
			return;
		}
		
		loading = true;
		error = '';
		
		try {
			console.log('Register attempt:', { name, email, password });
			await new Promise(resolve => setTimeout(resolve, 1000));
			goto('/login');
		} catch (err) {
			error = 'خطا در ثبت نام';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>ثبت نام - هومان</title>
</svelte:head>

<!-- Header -->
<div 
	class="flex flex-col items-center mb-6"
	in:fade={{ duration: 300, delay: 100 }}
>
	<div class="mb-4">
		<Logo size="sm" />
	</div>
	<h1 class="text-2xl font-bold text-white">ایجاد حساب کاربری</h1>
	<p class="text-gray-400 mt-2 text-sm">به هومان، نبض انسانیت بپیوندید.</p>
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

<!-- Register Form -->
<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<div in:fly={{ y: 20, duration: 400, delay: 100, easing: quintOut }}>
		<FormInput
			id="name"
			label="نام کامل"
			type="text"
			placeholder="نام خود را وارد کنید"
			icon="person"
			bind:value={name}
			autocomplete="name"
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 150, easing: quintOut }}>
		<FormInput
			id="email"
			label="ایمیل"
			type="email"
			placeholder="you@example.com"
			icon="email"
			bind:value={email}
			autocomplete="email"
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 200, easing: quintOut }}>
		<FormInput
			id="password"
			label="رمز عبور"
			type="password"
			placeholder="••••••••"
			icon="lock"
			bind:value={password}
			autocomplete="new-password"
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 250, easing: quintOut }}>
		<FormInput
			id="confirm-password"
			label="تایید رمز عبور"
			type="password"
			placeholder="••••••••"
			icon="lock_person"
			bind:value={confirmPassword}
			autocomplete="new-password"
		/>
	</div>
	
	<div in:fly={{ y: 20, duration: 400, delay: 300, easing: quintOut }} class="pt-2">
		<Button type="submit" {loading}>
			ثبت نام
		</Button>
	</div>
	
	<p 
		class="text-sm text-center text-gray-400 pt-2"
		in:fade={{ duration: 400, delay: 350 }}
	>
		حساب کاربری دارید؟ 
		<a href="/login" class="font-medium text-primary hover:underline">وارد شوید</a>
	</p>
</form>
