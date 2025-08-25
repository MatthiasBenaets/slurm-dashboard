import type { PageServerLoad } from '../$types';

async function fetchData(endpoint: string) {
	try {
		const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			return {
				data: null,
				error: `Error fetching ${endpoint}: ${await res.text()}`
			};
		}

		const data = await res.json();
		return {
			data: data,
			error: null
		};
	} catch (error: unknown) {
		let errorMessage = '';
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		return {
			data: null,
			error: `${endpoint} request failed: ${errorMessage}`
		};
	}
}

export const load: PageServerLoad = async () => {
	const nodes = await fetchData('slurm/nodes');
	const sjobs = await fetchData('slurm/jobs');
	const dbjobs = await fetchData('slurmdb/jobs/');

	return {
		slurm: {
			nodes: nodes.data,
			nodesError: nodes.error,
			sjobs: sjobs.data,
			sjobsError: sjobs.error,
			dbjobs: dbjobs.data,
			dbjobsError: dbjobs.error
		}
	};
};
