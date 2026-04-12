"use client";

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { resetPassword } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        description: 'Your password has been reset successfully. You can now log in with your new password.',
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

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
              type="password" 
              placeholder="New Password" 
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
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
      </div>
    </div>
  );
}
