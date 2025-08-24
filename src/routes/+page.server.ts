import { redirect } from '@sveltejs/kit';
import { setAuthCookie } from '$lib/utils';
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
		const res = await fetch('http://localhost:8080/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				username: username as string,
				password: password as string
			}),
			credentials: 'include'
		});

		if (res.ok) {
			setAuthCookie(cookies, res);
			return redirect(303, '/dashboard');
		} else {
			return {
				error: 'Invalid login'
			};
		}
	}
} satisfies Actions;
