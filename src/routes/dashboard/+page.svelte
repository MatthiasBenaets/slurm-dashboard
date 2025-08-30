<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LogOut } from '@lucide/svelte';
	import { Nodes, Jobs, History, Menu, Summary } from '$lib/components/dashboard';
	import { pastTime, currentTime } from '$lib/utils';
	import type { Node, Partition, SJob, DBJob } from '$lib/types';

	let { data } = $props();
	let slurm = $state(data.slurm);
	let nodes: Node[] = $derived(slurm?.nodes?.nodes ?? []);
	let partitions: Partition[] = $derived(slurm?.partitions?.partitions ?? []);
	let range_start = $state(pastTime);
	let range_end = $state(currentTime);
	let jobsPerPage = 15;
	let historyPage = $state(1);
	let jobsPage = $state(1);
	let error: string = $state('');
	const params = $derived(page.url.searchParams);

	// filter by username or job id, bound to menu input field
	let filter = $state('');
	let filteredSjobs = $derived(
		filter
			? (slurm?.sjobs?.jobs?.filter(
					(job: SJob) => job.user_name.includes(filter) || job.job_id.toString().includes(filter)
				) ?? [])
			: (slurm?.sjobs?.jobs ?? [])
	);

	let filteredDbjobs = $derived(
		filter
			? (slurm?.dbjobs?.jobs?.filter(
					(job: DBJob) => job.user.includes(filter) || job.job_id.toString().includes(filter)
				) ?? [])
			: (slurm?.dbjobs?.jobs ?? [])
	);

	// range date picker update handler
	function handleDateChange(start: number, end: number) {
		historyPage = 1;
		range_start = start;
		range_end = end;
		updateData();
	}

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
			if (!res.ok) {
				goto('/');
			}

			const updatedData = await res.json();
			if (updatedData.slurm) {
				slurm = updatedData.slurm;
			}
			if (jobsPage > Math.ceil(slurm.sjobs.jobs.length / jobsPerPage)) {
				jobsPage = Math.ceil(slurm.sjobs.jobs.length / jobsPerPage);
			}
		} catch (e) {
			goto('/');
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
				<Summary {nodes} {partitions} />
			{/if}
		</div>

		<div class="pt-4">
			<Menu menu={params.get('menu')} {handleDateChange} bind:filter />

			{#if slurm.nodes.nodes && (params.get('menu') === 'nodes' || params.get('menu') === undefined || (params.get('menu') !== 'jobs' && params.get('menu') !== 'history'))}
				<Nodes {nodes} />
			{/if}

			{#if slurm.sjobs.jobs && params.get('menu') === 'jobs'}
				<Jobs jobs={filteredSjobs} {jobsPerPage} {jobsPage} />
			{/if}

			{#if slurm.dbjobs.jobs && params.get('menu') === 'history'}
				<History jobs={filteredDbjobs} {jobsPerPage} {historyPage} />
			{/if}
		</div>
	</div>
</div>
