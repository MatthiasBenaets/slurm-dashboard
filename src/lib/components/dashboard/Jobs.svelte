<script lang="ts">
	import { fade } from 'svelte/transition';
	import { CircleQuestionMark } from '@lucide/svelte';
	import { Pagination } from '$lib/components/general';
	import { convertTres, convertTime } from '$lib/utils';

	let { jobs, jobsPerPage, jobsPage } = $props();
</script>

<div
	in:fade={{ duration: 100, delay: 110 }}
	class="flex w-full flex-col rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-3"
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
				.slice((jobsPage - 1) * jobsPerPage, jobsPage * jobsPerPage) as job (job.job_id)}
				<tr class="h-7">
					<td>{job.job_id}</td>
					<td>{job.job_state[0]}</td>
					<td>{job.user_name}</td>
					<td>
						{new Date(job.start_time.number * 1000).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							// year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							hourCycle: 'h23'
						})}
					</td>
					<td>
						{convertTime(Math.floor(Date.now() / 1000) - job.start_time.number)}
					</td>
					<td>{convertTres(job.tres_alloc_str).cpu}</td>
					<td>{convertTres(job.tres_alloc_str).mem}</td>
					<td>{convertTres(job.tres_alloc_str).node}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if jobs.length == 0}
		<div class="mt-8 mb-5 flex flex-col items-center justify-center text-neutral-700">
			<CircleQuestionMark size={40} />
			<p class="text-lg">No active jobs found</p>
		</div>
	{/if}
</div>
{#if jobs.length > jobsPerPage}
	<Pagination count={jobs.length} {jobsPerPage} bind:page={jobsPage} />
{/if}
