// fetch slurm data from go backend (slurmrestdb only internally accessible)
export async function fetchSlurmData(endpoint: string) {
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
