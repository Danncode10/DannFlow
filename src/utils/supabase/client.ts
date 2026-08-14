import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Password-recovery links are often opened in a browser other than the one
 * that requested them. Keep that isolated recovery journey client-only so it
 * can receive the session from the URL fragment without a browser-local PKCE
 * verifier. Normal app auth remains on the SSR PKCE client above.
 */
export function createRecoveryClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
      },
    },
  )
}
