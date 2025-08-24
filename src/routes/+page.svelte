<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form use:enhance action="?/login" method="POST" class="flex max-w-sm flex-col gap-2">
	<input name="username" placeholder="Username" required />
	<input name="password" type="password" placeholder="Password" required />
	<button type="submit">Login</button>
</form>

{#if form?.error}
	<p class="text-red-600">{form?.error}</p>
{/if}
