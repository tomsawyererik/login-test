import { createClient } from '$lib/supabase/server';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const requestUrl = new URL(event.request.url);
	const code = requestUrl.searchParams.get('code');
	const next = requestUrl.searchParams.get('next') ?? '/';

	if (code) {
		const supabase = createClient(event);
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const redirectTo = next.startsWith('/') ? next : `/${next}`;
			throw redirect(303, redirectTo);
		}
	}

	// return the user to an error page with instructions
	throw redirect(303, '/auth/auth-code-error');
};

