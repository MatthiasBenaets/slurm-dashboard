<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<form
		use:enhance
		action="?/login"
		method="POST"
		class="flex max-w-sm flex-col rounded-sm border border-neutral-700 bg-neutral-800 p-2"
	>
		<input
			class="rounded-t-sm border border-neutral-700 px-2 placeholder:text-neutral-400 focus:outline-none"
			name="username"
			placeholder="Username"
			required
		/>
		<input
			class="rounded-b-sm border-x border-b border-neutral-700 px-2 placeholder:text-neutral-400 focus:outline-none"
			name="password"
			type="password"
			placeholder="Password"
			required
		/>
		<button
			class="mt-2 cursor-pointer rounded-sm border border-neutral-700 bg-neutral-800 px-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
			type="submit">Login</button
		>
	</form>
	{#if form?.error}
		<p class="text-sm text-red-600">{form?.error}</p>
	{/if}
</div>
