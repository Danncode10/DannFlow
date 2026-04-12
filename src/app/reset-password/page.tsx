"use client";

import { useState, useEffect, Suspense } from 'react';
import { Lock, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { resetPassword } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setHasSession(true);
      } else if (errorCode) {
        toast.error('Reset link invalid', {
          description: errorDescription || 'Please request a new one.',
        });
      }
      setSessionLoading(false);
    };

    checkSession();
  }, [errorCode, errorDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(password);
      toast.success('Password updated!', {
        description: 'Your password has been reset successfully. You can now log in.',
      });
      router.push('/login');
    } catch (err: any) {
      toast.error('Error resetting password', {
        description: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground animate-pulse tracking-widest uppercase">Verifying Session...</p>
      </div>
    );
  }

  // Handle Error/Expired State
  if (errorCode || !hasSession) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tighter uppercase italic text-red-500">
              {errorCode === 'access_denied' ? 'Link Expired' : 'Invalid Session'}
            </h2>
            <p className="text-sm text-muted-foreground font-semibold italic">
              {errorDescription?.replace(/\+/g, ' ') || 'The recovery link is no longer valid or has already been used.'}
            </p>
          </div>
        </div>

        <Link 
          href="/forgot-password" 
          className="w-full py-3 bg-neutral-200 text-neutral-900 font-mono font-bold text-sm rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Request New Link
        </Link>
      </div>
    );
  }

  // Handle Valid Session State
  return (
    <>
      <div className="flex flex-col gap-2 text-center z-10">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Update Password</h1>
        <p className="text-muted-foreground text-sm font-semibold italic">
          Enter your new secure password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="New Password" 
            className="w-full pl-10 pr-12 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type={showConfirmPassword ? 'text' : 'password'} 
            placeholder="Confirm New Password" 
            className="w-full pl-10 pr-12 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-foreground text-background font-mono font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-mono text-muted-foreground animate-pulse tracking-widest uppercase">Loading...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
