<script lang="ts">
	let { x, y, z } = $props();
</script>

<div class="flex h-2 w-full items-start overflow-hidden rounded-xl bg-neutral-700">
	<div
		class="h-full bg-linear-to-r
                  {x > 0.9
			? 'from-red-700 to-red-600'
			: x >= 0.5
				? 'from-amber-700 to-amber-600'
				: 'from-green-700 to-green-600'} w-full origin-left transition-transform duration-1000 ease-in-out"
		style="transform: scaleX({y / z});"
	></div>
</div>
