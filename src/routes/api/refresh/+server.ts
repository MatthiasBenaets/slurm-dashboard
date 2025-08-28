import { json } from '@sveltejs/kit';
import { refreshAuthToken } from '$lib/api';
import type { RequestHandler } from './$types';

// request new auth token using existing token
export const POST: RequestHandler = async ({ cookies }) => {
	const result = await refreshAuthToken(cookies);

	if (result.success) {
		return json({ success: true });
	} else {
		return json({ success: false, error: result.error }, { status: 401 });
	}
};
