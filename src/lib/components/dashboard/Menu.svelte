<script lang="ts">
	import { goto } from '$app/navigation';
	import { DateRange } from '$lib/components/general';
	let { menu, handleDateChange, filter = $bindable() } = $props();
</script>

<div class="flex flex-col items-center justify-center pb-4 md:flex-row md:justify-between">
	<div class="flex flex-row">
		<button
			onclick={() => {
				goto('/dashboard?menu=nodes');
			}}
			class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {menu === 'nodes' || menu === undefined || menu !== 'jobs' || menu !== 'history'
				? 'scale-110 text-neutral-100'
				: ''}"
		>
			Nodes
		</button>
		<button
			onclick={() => {
				goto('/dashboard?menu=jobs');
			}}
			class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {menu === 'jobs' ? 'scale-110 text-neutral-100' : ''}"
		>
			Jobs
		</button>
		<button
			onclick={() => {
				goto('/dashboard?menu=history');
			}}
			class="cursor-pointer px-5 text-xl hover:scale-110 hover:text-neutral-50
        {menu === 'history' ? 'scale-110 text-neutral-100' : ''}"
		>
			History
		</button>
	</div>
	<div class="flex flex-row">
		{#if menu === 'jobs' || menu === 'history'}
			<input
				type="text"
				bind:value={filter}
				placeholder="Filter by User or Jobs ID"
				class="mr-4 rounded-md border border-neutral-700 px-2 focus:border-neutral-500 focus:outline-none"
			/>
		{/if}
		{#if menu === 'history'}
			<DateRange onDateChange={handleDateChange} />
		{/if}
	</div>
</div>
