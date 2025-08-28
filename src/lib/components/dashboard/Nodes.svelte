<script lang="ts">
	import { fade } from 'svelte/transition';
	import { convertTres } from '$lib/utils';

	let { nodes } = $props();
</script>

<div in:fade={{ duration: 100, delay: 110 }} class="flex w-full flex-wrap justify-center">
	{#each nodes as node (node.hostname)}
		<div
			class="h-32 w-32 {node.state.includes('DOWN') ||
			node.state.includes('UNKNOWN') ||
			node.state.includes('DRAIN') ||
			node.state.includes('FAIL') ||
			node.state.includes('NOT_RESPONDING')
				? 'bg-blue-500'
				: convertTres(node.tres_used).cpu / convertTres(node.tres).cpu > 0.9 ||
					  convertTres(node.tres_used).mem / convertTres(node.tres).mem > 0.9
					? 'from-red-900 to-red-600'
					: convertTres(node.tres_used).cpu / convertTres(node.tres).cpu >= 0.5 ||
						  convertTres(node.tres_used).mem / convertTres(node.tres).mem >= 0.5
						? 'from-amber-900 to-amber-500'
						: 'from-green-900 to-green-600'} m-1 rounded-md bg-linear-to-br p-3 text-white transition duration-1000 ease-in-out hover:scale-105"
		>
			<p class="font-bold uppercase">{node.hostname}</p>
			<p>
				<span class="font-bold">CPU</span>
				<span>
					{convertTres(node.tres_used).cpu} / {convertTres(node.tres).cpu}
				</span>
			</p>
			<p>
				<span class="font-bold">MEM</span>
				<span>{convertTres(node.tres_used).mem} / {convertTres(node.tres).mem}</span>
			</p>
		</div>
	{/each}
</div>
