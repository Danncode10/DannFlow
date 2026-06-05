import { NextResponse, type NextRequest } from 'next/server'

/**
 * If a Supabase auth code lands at the root (or anywhere other than the
 * callback route) — e.g. because the email template used a bare Site URL
 * without a path — forward it to /auth/callback so the session can be
 * exchanged correctly.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  const code = searchParams.get('code')
  if (code && pathname !== '/auth/callback') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    // preserve `next` if it was passed, otherwise default to /login
    if (!searchParams.get('next')) {
      url.searchParams.set('next', '/login')
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on every path except static assets & API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
