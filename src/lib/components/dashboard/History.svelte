<script lang="ts">
	import { fade } from 'svelte/transition';
	import { CircleQuestionMark } from '@lucide/svelte';
	import { Pagination } from '$lib/components/general';
	import { convertTime } from '$lib/utils';
	import type { Tres } from '$lib/types';

	let { jobs, jobsPerPage, historyPage } = $props();
</script>

<div
	in:fade={{ duration: 100, delay: 110 }}
	class="flex w-full rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-3"
>
	<table class="w-full table-auto">
		<thead class="border-b border-neutral-800 text-left">
			<tr>
				<th>Job ID</th>
				<th>State</th>
				<th>User</th>
				<th>Start Time</th>
				<th>Job Duration</th>
				<th>CPU</th>
				<th>MEM</th>
				<th>Node</th>
			</tr>
		</thead>
		<tbody>
			{#each jobs
				.slice()
				.reverse()
				.slice((historyPage - 1) * jobsPerPage, historyPage * jobsPerPage) as job (job.job_id)}
				<tr class="h-7">
					<td>{job.job_id}</td>
					<td>{job.state.current[0]}</td>
					<td>{job.user}</td>
					<td>
						{new Date(job.time.start * 1000).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							// year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							hourCycle: 'h23'
						})}
					</td>
					<td>
						{convertTime(job.time.elapsed)}
					</td>
					<td>
						{(job.tres.allocated as Tres[]).find((item) => item.type === 'cpu')?.count}
					</td>
					<td>
						{(
							((job.tres.allocated as Tres[]).find((item) => item.type === 'mem')?.count || 0) /
							1000
						).toFixed(0)}
					</td>
					<td>
						{(job.tres.allocated as Tres[]).find((item) => item.type === 'node')?.count}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if jobs.length == 0}
		<div class="mt-8 mb-5 flex flex-col items-center justify-center text-neutral-700">
			<CircleQuestionMark size={40} />
			<p class="text-lg">No job history found</p>
		</div>
	{/if}
</div>
{#if jobs.length > jobsPerPage}
	<Pagination count={jobs.length} {jobsPerPage} bind:page={historyPage} />
{/if}
