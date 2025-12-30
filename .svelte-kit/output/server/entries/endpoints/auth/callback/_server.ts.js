import { createServerClient } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
const PUBLIC_SUPABASE_URL = "https://cmkkgcfyunejubejbbzq.supabase.co";
const PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nIU3_IWZBlYVc6smxkuYWQ_jRxOhMMx";
function createClient(event) {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, {
              ...options,
              path: options?.path ?? "/"
            });
          });
        }
      }
    }
  );
}
const GET = async (event) => {
  const requestUrl = new URL(event.request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  if (code) {
    const supabase = createClient(event);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectTo = next.startsWith("/") ? next : `/${next}`;
      throw redirect(303, redirectTo);
    }
  }
  throw redirect(303, "/auth/auth-code-error");
};
export {
  GET
};
