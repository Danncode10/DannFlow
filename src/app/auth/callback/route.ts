import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const callbackError = searchParams.get('error_description') ?? searchParams.get('error')
  // `next` lets us send users to a specific page after confirming
  // e.g. /auth/callback?next=/dashboard — defaults to /login
  const fallbackNext = type === 'recovery' ? '/reset-password' : '/login'
  const nextParam = searchParams.get('next')
  const next = nextParam?.startsWith('/') ? nextParam : fallbackNext

  if (callbackError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(callbackError)}`)
  }

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send back to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
