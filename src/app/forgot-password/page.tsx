import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  redirect('/login?mode=recovery');
}
