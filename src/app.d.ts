// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
interface auth {
	username?: string;
	exp?: number;
	message?: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: auth;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
