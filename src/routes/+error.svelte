<script>
	import { page } from '$app/state';
</script>

<div class="my-auto flex h-screen w-full flex-col items-center justify-center">
	<h1>{page.status} {page.error?.message}</h1>
	<a href="/" class="rounded-md border border-neutral-700 p-2 hover:bg-neutral-800">Return Home</a>
</div>
