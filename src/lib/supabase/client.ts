import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import type { Database } from '../types/supabase';

export function createClient() {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
		throw new Error(
			'Missing Supabase environment variables. Please check your .env file has PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY. Make sure to restart the dev server after updating .env'
		);
	}

	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

