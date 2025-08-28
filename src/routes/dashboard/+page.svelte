<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Cpu, MemoryStick, Activity, LogOut } from '@lucide/svelte';
	import DateRange from '$lib/components/dashboard/daterange.svelte';
	import { convertTres, pastTime, currentTime } from '$lib/utils';
	import type { Node, Partition, NodeState, Tres } from '$lib/types';

	let { data } = $props();
	let slurm = $state(data.slurm);
	let nodes: Node[] = $derived(slurm?.nodes?.nodes ?? []);
	let partitions: Partition[] = $derived(slurm?.partitions?.partitions ?? []);
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
	let range_start = $state(pastTime);
	let range_end = $state(currentTime);
	let dashState: 'NODES' | 'JOBS' | 'HISTORY' = $state('NODES');
	let error: string = $state('');

	// range date picker update handler
	function handleDateChange(start: number, end: number) {
		range_start = start;
		range_end = end;
		updateData();
	}

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

	// update live cluster data
	async function updateData() {
		try {
			const res = await fetch('/api/slurm', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					start_time: range_start,
					end_time: range_end
				})
			});
			const updatedData = await res.json();
			if (updatedData.slurm) {
				slurm = updatedData.slurm;
			}
		} catch (e) {
			error = (e as Error).message;
		}
	}

	$effect(() => {
		const interval = setInterval(updateData, 5000);
		return () => clearInterval(interval);
	});
</script>

<div class="mx-auto max-w-7xl px-2">
	<div class="flex flex-row items-center justify-between pt-4">
		<div class="grid grid-cols-2 gap-5">
			<h1 class="font-bold">SLURM Dashboard</h1>
			<p class="font-bold text-neutral-700">{data.locals.auth.username}</p>
		</div>

		<form action="/logout" method="POST">
			<button
				type="submit"
				class="flex cursor-pointer flex-row items-center pr-2 hover:scale-105 hover:text-neutral-50"
			>
				<span class="pr-2">Logout</span>
				<LogOut size={20} />
			</button>
		</form>
	</div>

	{#if error}
		<div class="flex flex-row items-center justify-between pt-4">
			<div class="grid grid-cols-2 gap-5">
				<p class="font-bold text-red-600">{error}</p>
			</div>
		</div>
	{/if}

	<div class="flex flex-col divide-y divide-neutral-700">
		<div class="py-4">
			{#if nodes && partitions}
				<div class="grid grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-1">
					<div class="flex flex-col gap-4 rounded-sm border border-neutral-700 bg-neutral-900 p-3">
						<div class="flex flex-row items-center justify-between">
							<h2 class="text-xl">CPU Allocation</h2>
							<Cpu size={20} class="hidden md:inline" />
						</div>
						<div>
							<p class="text-3xl font-bold">{(cpuUsage * 100).toFixed(0)}%</p>
							<p class="text-neutral-400">{totalCpuUsed} of {totalCpu} cores</p>
						</div>
						<div class="flex h-2 w-full items-start overflow-hidden rounded-xl bg-neutral-700">
							<div
								class="h-full bg-linear-to-r
                  {cpuUsage > 0.9
									? 'from-red-700 to-red-600'
									: cpuUsage >= 0.5
										? 'from-amber-700 to-amber-600'
										: 'from-green-700 to-green-600'} w-full origin-left transition-transform duration-1000 ease-in-out"
								style="transform: scaleX({totalCpuUsed / totalCpu});"
							></div>
						</div>
					</div>

					<div class="flex flex-col gap-4 rounded-sm border border-neutral-700 bg-neutral-900 p-3">
						<div class="flex flex-row items-center justify-between">
							<h2 class="text-xl">Memory Usage</h2>
							<MemoryStick size={20} class="hidden md:inline" />
						</div>
						<div>
							<p class="text-3xl font-bold">{(memUsage * 100).toFixed(0)}%</p>
							<p class="text-neutral-400">{totalMemUsed} of {totalMem} GB</p>
						</div>
						<div class="flex h-2 w-full items-start overflow-hidden rounded-xl bg-neutral-700">
							<div
								class="h-full bg-linear-to-r {memUsage > 0.9
									? 'from-red-700 to-red-600'
									: memUsage >= 0.5
										? 'from-amber-700 to-amber-600'
										: 'from-green-700 to-green-600'} w-full origin-left transition-transform duration-1000 ease-in-out"
								style="transform: scaleX({totalMemUsed / totalMem});"
							></div>
						</div>
					</div>
					<div class="flex flex-col gap-4 rounded-sm border border-neutral-700 bg-neutral-900 p-3">
						<div class="flex flex-row items-center justify-between">
							<h2 class="text-xl">System Activity</h2>
							<Activity size={20} class="hidden md:inline" />
						</div>
						<div>
							<p class="text-3xl font-bold">{nodes.length}</p>
							<p class="text-neutral-400">Nodes</p>
						</div>
						<div class="hidden grid-cols-3 gap-2 text-sm md:grid">
							<div class="flex flex-col">
								<p>Idle</p>
								<p class="text-neutral-400">{stateCounts.IDLE || 0} nodes</p>
							</div>
							<div class="flex flex-col">
								<p>Mixed</p>
								<p class="text-neutral-400">{stateCounts.MIXED || 0} nodes</p>
							</div>
							<div class="flex flex-col">
								<p>Allocated</p>
								<p class="text-neutral-400">{stateCounts.ALLOCATED || 0} nodes</p>
							</div>
							<div class="flex flex-col">
								<p>Down</p>
								<p class="text-neutral-400">{stateCounts.DOWN || 0} nodes</p>
							</div>
							<div class="flex flex-col">
								<p>Drain</p>
								<p class="text-neutral-400">{stateCounts.DRAIN || 0} nodes</p>
							</div>
							<div class="flex flex-col">
								<p>Unknown</p>
								<p class="text-neutral-400">{stateCounts.UNKNOWN || 0} nodes</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="pt-4">
			<div class="flex flex-col items-center justify-center pb-4 md:flex-row md:justify-between">
				<div class="flex flex-row">
					<button
						onclick={() => {
							dashState = 'NODES';
						}}
						class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {dashState === 'NODES' ? 'scale-110 text-neutral-100' : ''}"
					>
						Nodes
					</button>
					<button
						onclick={() => {
							dashState = 'JOBS';
						}}
						class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {dashState === 'JOBS' ? 'scale-110 text-neutral-100' : ''}"
					>
						Jobs
					</button>
					<button
						onclick={() => {
							dashState = 'HISTORY';
						}}
						class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {dashState === 'HISTORY' ? 'scale-110 text-neutral-100' : ''}"
					>
						History
					</button>
				</div>
				<div>
					{#if dashState === 'HISTORY'}
						<DateRange onDateChange={handleDateChange} />
					{/if}
				</div>
			</div>
			{#if nodes && dashState === 'NODES'}
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
			{/if}

			{#if slurm.sjobs.jobs && dashState === 'JOBS'}
				<div
					in:fade={{ duration: 100, delay: 110 }}
					class="flex w-full rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-3"
				>
					<table class="w-full table-auto">
						<thead class="text-left">
							<tr>
								<th>Job ID</th>
								<th>State</th>
								<th>User</th>
								<th>CPU</th>
								<th>MEM</th>
								<th>Node</th>
							</tr>
						</thead>
						<tbody>
							{#each slurm.sjobs.jobs.slice().reverse() as job (job.job_id)}
								<tr>
									<td>{job.job_id}</td>
									<td>{job.job_state[0]}</td>
									<td>{job.user_name}</td>
									<td>{convertTres(job.tres_alloc_str).cpu}</td>
									<td>{convertTres(job.tres_alloc_str).mem}</td>
									<td>{convertTres(job.tres_alloc_str).node}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			{#if slurm.dbjobs.jobs && dashState === 'HISTORY'}
				<div
					in:fade={{ duration: 100, delay: 110 }}
					class="flex w-full rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-3"
				>
					<table class="w-full table-auto">
						<thead class="text-left">
							<tr>
								<th>Job ID</th>
								<th>State</th>
								<th>User</th>
								<th>CPU</th>
								<th>MEM</th>
								<th>Node</th>
							</tr>
						</thead>
						<tbody>
							{#each slurm.dbjobs.jobs.slice().reverse() as job (job.job_id)}
								<tr>
									<td>{job.job_id}</td>
									<td>{job.state.current[0]}</td>
									<td>{job.user}</td>
									<td>
										{(job.tres.allocated as Tres[]).find((item) => item.type === 'cpu')?.count}
									</td>
									<td>
										{(
											(job.tres.allocated as Tres[]).find((item) => item.type === 'mem')?.count ||
											0 / 1000
										).toFixed(0)}
									</td>
									<td>
										{(job.tres.allocated as Tres[]).find((item) => item.type === 'node')?.count}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>
