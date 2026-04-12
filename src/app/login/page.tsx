"use client";

import { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.requiresMFA) {
        toast.info('MFA Required', { description: 'Please enter your verification code.' });
        router.push('/auth/mfa');
      } else {
        toast.success('Login successful!', { description: 'Welcome back to Mission Control.' });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      toast.error('Authentication Failed', { description: err.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    
    try {
      await signUpWithEmail(email, password);
      toast.success('Check your email!', { description: 'We have sent a confirmation link to your inbox.' });
    } catch (err: any) {
      toast.error('Signup Failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 font-sans px-4">
      <div className="w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-2 text-center z-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Authenticate</h1>
          <p className="text-muted-foreground text-xs font-semibold italic">Secure access to Mission Control</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4 z-10">
          <div className="flex flex-col gap-3">
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
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full pl-10 pr-12 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-neutral-600"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 bg-foreground text-background font-mono font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Processing...' : 'Log In'}
            </button>
            
            <button 
              type="button" 
              onClick={handleSignUp} 
              disabled={loading} 
              className="w-full py-3 border border-neutral-800 font-mono font-medium text-sm text-neutral-400 rounded-xl hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
