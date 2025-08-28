// import { redirect } from '@sveltejs/kit';
// import { setAuthCookie } from '$lib/utils';
import { fetchAuthToken } from '$lib/api';
import type { Actions } from './$types';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return {
				error: 'Missing username or password'
			};
		}

		// Authenticate using Go backend API
		return await fetchAuthToken(cookies, username as string, password as string);
	}
} satisfies Actions;
