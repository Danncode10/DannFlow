import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getUserProfile } from '@/services/dashboard'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  // A Supabase session alone is not enough to enter the dashboard. This also
  // checks that the corresponding profile exists and is active, preventing a
  // /login <-> /dashboard redirect loop for deactivated accounts.
  const session = await getUserProfile()

  if (session) redirect('/dashboard')

  return <>{children}</>
}
