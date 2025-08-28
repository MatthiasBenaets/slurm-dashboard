<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Pagination } from '$lib/components/general';
	import type { Tres } from '$lib/types';

	let { jobs, jobsPerPage, historyPage } = $props();
</script>

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
			{#each jobs
				.slice()
				.reverse()
				.slice((historyPage - 1) * jobsPerPage, historyPage * jobsPerPage) as job (job.job_id)}
				<tr>
					<td>{job.job_id}</td>
					<td>{job.state.current[0]}</td>
					<td>{job.user}</td>
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
</div>
<Pagination count={jobs.length} {jobsPerPage} bind:page={historyPage} />
