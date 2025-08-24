import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

// get auth cookie from response header and transfer it into a cookie
export function setAuthCookie(cookies: Cookies, res: Response) {
	const cookie = res.headers.get('set-cookie');
	if (cookie) {
		const parts = cookie.split(';')[0].split('=');
		const name = parts[0];
		const value = parts[1];
		const opts = {} as CookieSerializeOptions & { path: string };
		cookie
			.split(';')
			.slice(1)
			.forEach((part) => {
				const [key, val] = part.trim().split('=');
				if (key) {
					if (key.toLowerCase() === 'httponly') opts.httpOnly = true;
					if (key.toLowerCase() === 'samesite')
						opts.sameSite = val as CookieSerializeOptions['sameSite'];
					if (key.toLowerCase() === 'expires') opts.expires = new Date(val);
					if (key.toLowerCase() === 'secure') opts.secure = true;
					opts.path = '/';
				}
			});
		cookies.set(name, value, opts);
	}
}
