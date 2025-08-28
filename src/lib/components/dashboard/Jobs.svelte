<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Pagination } from '$lib/components/general';
	import { convertTres } from '$lib/utils';

	let { jobs, jobsPerPage, jobsPage } = $props();
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
				.slice((jobsPage - 1) * jobsPerPage, jobsPage * jobsPerPage) as job (job.job_id)}
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
{#if jobs.length > jobsPerPage}
	<Pagination count={jobs.length} {jobsPerPage} bind:page={jobsPage} />
{/if}
