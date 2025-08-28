<script lang="ts">
	let { title, icon, value, info, extra } = $props();
</script>

<div class="flex flex-col gap-4 rounded-sm border border-neutral-700 bg-neutral-900 p-3">
	<div class="flex flex-row items-center justify-between">
		<h2 class="text-xl">{title}</h2>
		{#if icon}
			{@render icon()}
		{/if}
	</div>
	<div>
		<p class="text-3xl font-bold">{value}</p>
		<p class="text-neutral-400">{info}</p>
	</div>
	<div>
		{#if extra}
			{@render extra()}
		{/if}
	</div>
</div>
