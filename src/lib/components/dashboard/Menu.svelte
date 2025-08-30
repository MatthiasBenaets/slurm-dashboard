<script lang="ts">
	import { DateRange } from '$lib/components/general';
	let { dashState = $bindable(), handleDateChange, filter = $bindable() } = $props();
</script>

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
	<div class="flex flex-row">
		{#if dashState === 'JOBS' || dashState === 'HISTORY'}
			<input
				type="text"
				bind:value={filter}
				placeholder="Filter by User or Jobs ID"
				class="mr-4 rounded-md border border-neutral-700 px-2 focus:border-neutral-500 focus:outline-none"
			/>
		{/if}
		{#if dashState === 'HISTORY'}
			<DateRange onDateChange={handleDateChange} />
		{/if}
	</div>
</div>
