<script lang="ts">
	import { DateRangePicker, type DateRange } from 'bits-ui';
	import { getLocalTimeZone, CalendarDate } from '@internationalized/date';
	import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import { pastTime, currentTime } from '$lib/utils';

	let {
		onDateChange
	}: {
		onDateChange: (start: number, end: number) => void;
	} = $props();
	const bd = new Date(pastTime * 1000);
	const cd = new Date(currentTime * 1000);
	const beforeDate = new CalendarDate(bd.getFullYear(), bd.getMonth() + 1, bd.getDate());
	const currentDate = new CalendarDate(cd.getFullYear(), cd.getMonth() + 1, cd.getDate());
	let start_value: number = $state(pastTime);
	let end_value: number = $state(currentTime);
	let value: DateRange = $state({
		start: beforeDate,
		end: currentDate
	});
	let open = $state(false);

	// format display date
	function getDisplayText(value: DateRange | undefined): string {
		if (!value || !value.start) {
			return 'Select date range';
		}
		const startStr = value.start
			.toDate('UTC')
			.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		if (!value.end) {
			return startStr;
		}
		const endStr = value.end
			.toDate('UTC')
			.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		return `${startStr} – ${endStr}`;
	}

	// call api on change
	function onValueChange() {
		if (value?.end) {
			open = false;
		}

		if (value.start) {
			start_value = Math.floor(value.start.toDate(getLocalTimeZone()).getTime() / 1000);
			if (value.end) {
				end_value = Math.floor(value.end.toDate(getLocalTimeZone()).getTime() / 1000) + 86400;
			} else {
				end_value = Math.floor(value.start.toDate(getLocalTimeZone()).getTime() / 1000) + 86400;
			}
			onDateChange(start_value, end_value);
		}
	}
</script>

<DateRangePicker.Root
	bind:value
	bind:open
	{onValueChange}
	weekdayFormat="short"
	fixedWeeks={true}
	numberOfMonths={1}
	closeOnRangeSelect={true}
	class="flex w-full max-w-[340px] flex-col gap-1.5"
>
	<button
		class="flex h-7 w-full cursor-pointer items-center justify-between rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm tracking-[0.01em] text-neutral-200 select-none focus-within:border-neutral-500 focus-within:shadow-sm hover:border-neutral-500"
		onclick={() => (open = true)}
		tabindex="0"
	>
		<span class="text-neutral-400" class:text-neutral-200={value?.start}>
			{getDisplayText(value)}
		</span>
		<DateRangePicker.Trigger
			class="ml-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-400 transition-all"
		>
			<CalendarBlank class="size-5" />
		</DateRangePicker.Trigger>
	</button>
	<DateRangePicker.Content sideOffset={6} side="bottom" class="z-50" align="end" alignOffset={-13}>
		<DateRangePicker.Calendar
			class="rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-neutral-200 shadow-lg"
		>
			{#snippet children({ months, weekdays })}
				<DateRangePicker.Header class="mb-4 flex items-center justify-between">
					<DateRangePicker.PrevButton
						class="inline-flex size-8 items-center justify-center rounded-md bg-neutral-900 transition-all hover:bg-neutral-800 active:scale-95"
					>
						<CaretLeft class="size-5 text-neutral-200" />
					</DateRangePicker.PrevButton>
					<DateRangePicker.Heading class="text-base font-medium" />
					<DateRangePicker.NextButton
						class="inline-flex size-8 items-center justify-center rounded-md bg-neutral-900 transition-all hover:bg-neutral-800 active:scale-95"
					>
						<CaretRight class="size-5 text-neutral-200" />
					</DateRangePicker.NextButton>
				</DateRangePicker.Header>
				<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					{#each months as month (month.value)}
						<DateRangePicker.Grid class="w-full border-collapse space-y-1 select-none">
							<DateRangePicker.GridHead>
								<DateRangePicker.GridRow class="mb-1 flex w-full justify-between">
									{#each weekdays as day (day)}
										<DateRangePicker.HeadCell
											class="w-8 rounded-md text-xs font-normal text-neutral-500"
										>
											<div>{day.slice(0, 2)}</div>
										</DateRangePicker.HeadCell>
									{/each}
								</DateRangePicker.GridRow>
							</DateRangePicker.GridHead>
							<DateRangePicker.GridBody>
								{#each month.weeks as weekDates (weekDates)}
									<DateRangePicker.GridRow class="flex w-full">
										{#each weekDates as date (date)}
											<DateRangePicker.Cell
												{date}
												month={month.value}
												class="relative size-8 p-0 text-center text-sm focus-within:relative focus-within:z-20"
											>
												<DateRangePicker.Day
													class="group data-[highlighted][data-range-middle]:rounded-none data-[selected][data-range-middle]:rounded-none data-[selected][data-range-middle]:focus-visible:border-neutral-500 data-[selected][data-range-middle]:focus-visible:ring-0 data-[selected][data-range-middle]:focus-visible:ring-offset-0 relative inline-flex size-8 items-center justify-center overflow-visible border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap text-neutral-200 transition-all hover:rounded-md hover:bg-neutral-800 focus-visible:ring-neutral-500 data-[disabled]:pointer-events-none data-[disabled]:text-neutral-600 data-[highlighted]:bg-neutral-700 data-[outside-month]:pointer-events-none data-[range-end]:rounded-r-md data-[range-start]:rounded-l-md data-[selected]:bg-neutral-700 data-[selected]:font-medium data-[selected]:text-white data-[selection-end]:bg-neutral-500 data-[selection-end]:font-medium data-[selection-end]:text-white data-[selection-start]:bg-neutral-500 data-[selection-start]:font-medium data-[selection-start]:text-white data-[selection-start]:focus-visible:ring-2 data-[selection-start]:focus-visible:ring-offset-2 data-[unavailable]:text-neutral-600 data-[unavailable]:line-through"
												>
													<div
														class="absolute bottom-0 hidden size-1 bg-white transition-all group-data-[today]:block"
													></div>
													{date.day}
												</DateRangePicker.Day>
											</DateRangePicker.Cell>
										{/each}
									</DateRangePicker.GridRow>
								{/each}
							</DateRangePicker.GridBody>
						</DateRangePicker.Grid>
					{/each}
				</div>
			{/snippet}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
