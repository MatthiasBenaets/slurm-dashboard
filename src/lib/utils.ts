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

// convert Trackable Resources from string to object
export function convertTres(str: string) {
	if (!str)
		return {
			mem: 0,
			cpu: 0
		};
	const result: Record<string, number> = {};
	const pairs = str.split(',');
	for (const pair of pairs) {
		const [key, value] = pair.split('=');
		if (key == 'mem') {
			result[key] = Number((parseInt(value) / 1000).toFixed(0));
		} else {
			result[key] = parseInt(value);
		}
	}
	return result;
}
