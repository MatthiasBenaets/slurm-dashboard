<script lang="ts">
	import { Cpu, MemoryStick, Activity } from '@lucide/svelte';
	import { SummaryBox, ProgressBar } from '$lib/components/general';
	import { convertTres } from '$lib/utils';
	import type { Node, NodeState, Partition } from '$lib/types';

	// get cluster data and calculate usage
	let { nodes, partitions } = $props();
	let totalCpu = $derived(
		partitions.reduce(
			(sum: number, partition: Partition) =>
				sum + convertTres(partition.tres?.configured ?? 'cpu=0').cpu,
			0
		)
	);
	let totalCpuUsed = $derived(
		nodes.reduce((sum: number, node: Node) => sum + convertTres(node.tres_used ?? 'cpu=0').cpu, 0)
	);
	let totalMem = $derived(
		partitions.reduce(
			(sum: number, partition: Partition) =>
				sum + convertTres(partition.tres?.configured ?? 'mem=0').mem,
			0
		)
	);
	let totalMemUsed = $derived(
		nodes.reduce((sum: number, node: Node) => sum + convertTres(node.tres_used ?? 'mem=0').mem, 0)
	);
	let memUsage = $derived(totalMem > 0 ? totalMemUsed / totalMem : 0);
	let cpuUsage = $derived(totalCpu > 0 ? totalCpuUsed / totalCpu : 0);

	// count states of all nodes
	const stateCounts: NodeState = $derived(
		nodes.reduce(
			(counts: NodeState, node: Node) => {
				(node.state ?? []).forEach((singleState: string) => {
					if (singleState in counts) {
						counts[singleState as keyof NodeState] += 1;
					}
				});
				return counts;
			},
			{
				IDLE: 0,
				MIXED: 0,
				ALLOCATED: 0,
				DOWN: 0,
				DRAIN: 0,
				UNKNOWN: 0
			}
		)
	);
	const nodeStates = [
		{ key: 'IDLE', label: 'Idle' },
		{ key: 'MIXED', label: 'Mixed' },
		{ key: 'ALLOCATED', label: 'Allocated' },
		{ key: 'DOWN', label: 'Down' },
		{ key: 'DRAIN', label: 'Drain' },
		{ key: 'UNKNOWN', label: 'Unknown' }
	] as const;
</script>

<div class="grid grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-1">
	<SummaryBox
		title="CPU Allocation"
		value="{(cpuUsage * 100).toFixed(0)}%"
		info="{totalCpuUsed} of {totalCpu} cores"
	>
		{#snippet icon()}
			<Cpu size={20} class="hidden md:inline" />
		{/snippet}
		{#snippet extra()}
			<ProgressBar x={cpuUsage} y={totalCpuUsed} z={totalCpu} />
		{/snippet}
	</SummaryBox>
	<SummaryBox
		title="Memory Usage"
		value="{(memUsage * 100).toFixed(0)}%"
		info="{totalMemUsed} of {totalMem} cores"
	>
		{#snippet icon()}
			<MemoryStick size={20} class="hidden md:inline" />
		{/snippet}
		{#snippet extra()}
			<ProgressBar x={memUsage} y={totalMemUsed} z={totalMem} />
		{/snippet}
	</SummaryBox>
	<SummaryBox title="System Activity" value={nodes.length} info="Nodes">
		{#snippet icon()}
			<Activity size={20} class="hidden md:inline" />
		{/snippet}
		{#snippet extra()}
			<div class="hidden grid-cols-3 gap-2 text-sm md:grid">
				{#each nodeStates as state (state.key)}
					<div class="flex flex-col">
						<p>{state.label}</p>
						<p class="text-neutral-400">{stateCounts[state.key] || 0} nodes</p>
					</div>
				{/each}
			</div>
		{/snippet}
	</SummaryBox>
</div>
