"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else {
      alert('Signup logic triggered! Going back to dashboard to check live database changes.');
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 font-sans">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="text-2xl font-mono mb-4 text-center z-10 text-neutral-200">Authenticate</h1>
        
        {error && <div className="p-3 bg-red-900/50 text-red-200 text-sm font-mono rounded-lg border border-red-800 z-10">{error}</div>}

        <div className="z-10 flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all font-mono text-sm placeholder:text-neutral-600"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all font-mono text-sm placeholder:text-neutral-600"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex flex-col gap-2 mt-4 z-10">
          <button type="submit" disabled={loading} className="w-full py-3 bg-neutral-200 text-neutral-900 font-mono font-bold text-sm rounded-lg hover:bg-white transition-colors">
            {loading ? 'Processing...' : 'Log In'}
          </button>
          
          <button type="button" onClick={handleSignUp} disabled={loading} className="w-full py-3 border border-neutral-800 font-mono font-medium text-sm text-neutral-400 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
            Push Sign Up (Test Trigger)
          </button>
        </div>
      </form>
    </div>
  );
}
