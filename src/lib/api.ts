import { redirect } from '@sveltejs/kit';
import { setAuthCookie } from '$lib/utils';
import type { Cookies } from '@sveltejs/kit';

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

// authenticate user with go backend
export async function fetchAuthToken(cookies: Cookies, username: string, password: string) {
	try {
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
	} catch (error: unknown) {
		let errorMessage = '';
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		return {
			data: null,
			error: `Authentication failed: ${errorMessage}`
		};
	}
}

// request new auth token using existing token
export async function refreshAuthToken(cookies: Cookies) {
	try {
		const res = await fetch('http://localhost:8080/api/refresh', {
			method: 'POST',
			credentials: 'include',
			headers: {
				Cookie: cookies.get('token') ? `token=${cookies.get('token')}` : ''
			}
		});

		if (res.ok) {
			setAuthCookie(cookies, res);
			return { success: true };
		} else {
			return { success: false, error: 'Token refresh failed' };
		}
	} catch {
		return { success: false, error: 'Token refresh failed' };
	}
}
