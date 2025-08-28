<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// refresh auth cookie every 30 minutes when active
	$effect(() => {
		const interval = setInterval(
			async () => {
				await fetch('/api/refresh', { method: 'POST' });
			},
			30 * 60 * 1000
		);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-w-sm text-neutral-200">
	{@render children?.()}
</div>

<style>
	:global(html) {
		background-color: oklch(14.5% 0 0);
	}
</style>
