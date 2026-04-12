"use client";

import { useState } from 'react';
import { Lock, Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import { updatePassword } from '@/services/auth';
import { toast } from 'sonner';

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      await updatePassword(password, currentPassword);
      toast.success('Security updated', {
        description: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.message === 'Incorrect current password') {
        toast.error('Verification failed', {
          description: 'Please enter your current password correctly.',
        });
      } else {
        toast.error('Update failed', {
          description: err.message || 'Something went wrong.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Security Settings
        </h2>
        <p className="text-sm text-muted-foreground font-semibold italic">
          Manage your account security and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Required for verification" 
                className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800/50 mt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-primary text-primary-foreground font-mono font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Verifying & Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="p-4 bg-secondary/50 border border-border rounded-2xl">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest mb-2">Password Requirements</h4>
        <ul className="text-[10px] text-muted-foreground font-mono space-y-1">
          <li>• Minimum 6 characters</li>
          <li>• Must be different from current password</li>
          <li>• Re-authentication required for changes</li>
        </ul>
      </div>
    </div>
  );
}
