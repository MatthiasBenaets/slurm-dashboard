<script>
	let { data } = $props();
</script>

<h1>Dashboard</h1>

<p>Logged in as: {data.locals.auth.username}</p>

<form action="/logout" method="POST">
	<button type="submit">Logout</button>
</form>

<details>
	<summary>Nodes</summary>
	<pre class="text-xs">
    {#if data.slurm.nodes.nodes}
			{#each data.slurm.nodes.nodes as node (node.hostname)}
				{JSON.stringify(node, null, 2)}
			{/each}
		{/if}
  </pre>
</details>

<details>
	<summary>Active jobs</summary>
	<pre class="text-xs">
    {#if data.slurm.sjobs.jobs}
			{#each data.slurm.sjobs.jobs as job (job.id)}
				{JSON.stringify(job, null, 2)}
			{/each}
		{/if}
  </pre>
</details>

<details>
	<summary>All jobs</summary>
	<pre class="text-xs">
    {#if data.slurm.dbjobs.jobs}
			{#each data.slurm.dbjobs.jobs as job (job.id)}
				{JSON.stringify(job, null, 2)}
			{/each}
		{/if}
  </pre>
</details>

<details>
	<summary>JSON</summary>
	<pre class="text-xs">{JSON.stringify(data, null, 2)}</pre>
</details>
