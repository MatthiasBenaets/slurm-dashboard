import { redirect } from '@sveltejs/kit';
import { setAuthCookie } from '$lib/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const res = await fetch('http://localhost:8080/api/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		credentials: 'include'
	});

	setAuthCookie(cookies, res);
	throw redirect(303, '/');
};
