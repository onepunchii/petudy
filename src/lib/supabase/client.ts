import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy client for build time when env vars are not available
        console.warn('Supabase env vars missing, returning noop client');
        return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
