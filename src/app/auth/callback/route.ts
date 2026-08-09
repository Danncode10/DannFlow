import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` lets us send users to a specific page after confirming
  // e.g. /auth/callback?next=/dashboard — defaults to /login
  const nextParam = searchParams.get('next') ?? '/login'
  const next = nextParam.startsWith('/') ? nextParam : '/login'

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
