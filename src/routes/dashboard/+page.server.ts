import { fetchSlurmData } from '$lib/api';
import { pastTime, currentTime } from '$lib/utils';
import type { PageServerLoad } from '../$types';

// initial cluster data
export const load: PageServerLoad = async () => {
	const partitions = await fetchSlurmData('slurm/partitions/');
	const nodes = await fetchSlurmData('slurm/nodes');
	const sjobs = await fetchSlurmData('slurm/jobs');
	const dbjobs = await fetchSlurmData(
		`slurmdb/jobs/?start_time=${pastTime}&end_time=${currentTime}`
	);

	return {
		slurm: {
			partitions: partitions.data,
			partitionsError: partitions.error,
			nodes: nodes.data,
			nodesError: nodes.error,
			sjobs: sjobs.data,
			sjobsError: sjobs.error,
			dbjobs: dbjobs.data,
			dbjobsError: dbjobs.error
		}
	};
};
