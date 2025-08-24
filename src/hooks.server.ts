import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// check if user is logged in
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = {};
	const cookieHeader = event.request.headers.get('cookie');

	if (!cookieHeader && event.url.pathname !== '/') {
		return new Response(null, {
			status: 302,
			headers: { location: '/' }
		});
	}

	if (cookieHeader) {
		try {
			const res = await fetch('http://localhost:8080/api/protected', {
				method: 'GET',
				headers: { Cookie: cookieHeader }
			});

			if (res.ok) {
				event.locals.auth = await res.json();
				if (event.url.pathname === '/') {
					return new Response(null, {
						status: 302,
						headers: { location: '/dashboard' }
					});
				}
			} else {
				event.cookies.delete('token', { path: '/' });
				event.locals.auth.message = 'Not logged in!';
				throw redirect(302, '/');
			}
		} catch (error) {
			console.error('Error in handle hook:', error);
			event.locals.auth.message = 'Error fetching protected API';
		}
	}

	return resolve(event);
};
