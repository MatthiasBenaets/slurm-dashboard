import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchSlurmData } from '$lib/api';

// used for auto-refresh cluster data on dashboard
export const POST: RequestHandler = async ({ request }) => {
	const req = await request.json();

	const partitions = await fetchSlurmData('slurm/partitions/');
	const nodes = await fetchSlurmData('slurm/nodes');
	const sjobs = await fetchSlurmData('slurm/jobs');
	const dbjobs = await fetchSlurmData(
		`slurmdb/jobs/?start_time=${req.start_time}&end_time=${req.end_time}`
	);

	const data = {
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

	return json(data);
};
