import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return <>{children}</>
}
