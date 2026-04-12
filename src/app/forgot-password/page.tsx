"use client";

import { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success('Reset email sent!', {
        description: 'Check your inbox for the password reset link.',
      });
      // Optionally redirect back to login
      router.push('/login');
    } catch (err: any) {
      toast.error('Error sending reset email', {
        description: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-2 text-center z-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Forgot Password</h1>
          <p className="text-muted-foreground text-sm font-semibold italic">
            Enter your email to receive a recovery link.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-foreground text-background font-mono font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors font-mono z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
