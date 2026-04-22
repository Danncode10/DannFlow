'use client';

import { useState, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formKey, setFormKey] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    const saved = localStorage.getItem('df_auth_mode');
    if (saved) setMode(saved as 'login' | 'signup');
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m);
    localStorage.setItem('df_auth_mode', m);
    setFormKey(k => k + 1);
    setError('');
    setSuccess(false);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.requiresMFA) {
          router.push('/auth/mfa');
        } else {
          setSuccess(true);
          setTimeout(() => {
            toast.success('Login successful!');
            router.push('/dashboard');
            router.refresh();
          }, 800);
        }
      } else {
        await signUpWithEmail(email, password);
        setSuccess(true);
        setTimeout(() => {
          toast.success('Account created!', { description: 'Check your email for confirmation.' });
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isDesktop = windowWidth >= 900;
  const isMobile = windowWidth < 600;

  const passwordScore = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: `linear-gradient(rgba(108,71,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -right-[8%] w-[560px] h-[560px] rounded-full opacity-15 blur-[110px]"
          style={{ background: '#6C47FF', animation: 'float 9s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-[15%] -left-[8%] w-[480px] h-[480px] rounded-full opacity-8 blur-[110px]"
          style={{ background: '#6C47FF', animation: 'float 11s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-[45%] left-[38%] w-[280px] h-[280px] rounded-full opacity-5 blur-[77px]"
          style={{ background: '#1E40AF', animation: 'float 13s ease-in-out infinite 3s' }}
        />
      </div>

      {/* Main Layout */}
      <div className={`flex-1 flex relative z-10 ${isDesktop ? 'flex-row' : 'flex-col'}`}>
        {/* Brand Panel / Header */}
        {isDesktop ? (
          <div className="flex-none w-[400px] flex flex-col justify-between px-11 py-16 border-r border-border relative overflow-hidden">
            {/* Tint */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(145deg, rgba(108,71,255,0.05) 0%, transparent 55%)' }} />

            <div className="relative z-10">
              {/* Logo */}
              <div className="mb-14 flex items-center gap-2">
                <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-primary to-blue-500" style={{ boxShadow: '0 0 18px rgba(108,71,255,0.333)' }}>
                  D
                </div>
                <span className="text-lg font-bold text-foreground tracking-tighter">DannFlow</span>
                <span className="px-2 py-1 rounded text-xs text-primary border border-primary/25 bg-primary/10 font-mono tracking-widest">v2.0</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold leading-tight mb-3 tracking-tighter text-foreground">
                Ship your idea.
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent" style={{ animation: 'shimmer 3s linear infinite', backgroundSize: '200% auto' }}>
                  Not boilerplate.
                </span>
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-9">The AI-native Next.js boilerplate for builders who ship. Plug in your vision — we handle the rest.</p>

              {/* Features */}
              <div className="flex flex-col gap-3">
                {['Next.js 15 + Supabase auth built-in', 'AI-native architecture & MCP ready', 'Deploy to Vercel in under 2 minutes', 'Checkpoint rollback system'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-primary/40 bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 relative z-10">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" style={{ boxShadow: '0 0 7px #22C55E', animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-xs text-muted-foreground font-mono">All systems operational</span>
            </div>
          </div>
        ) : (
          <div className="border-b border-border p-6 relative z-10 bg-background/50 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br from-primary to-blue-500" style={{ boxShadow: '0 0 18px rgba(108,71,255,0.333)' }}>
                D
              </div>
              <span className="font-bold text-foreground text-sm tracking-tighter">DannFlow</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">The AI-native Next.js boilerplate. Ship your idea, not boilerplate.</p>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-md" style={{ animation: 'fadeUp 0.45s ease both' }}>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-8">
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${mode === m ? 'bg-primary text-white shadow-lg' : 'bg-transparent text-muted-foreground'}`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className={`font-bold tracking-tight mb-1 text-foreground ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                {mode === 'login' ? 'Welcome back' : 'Start building'}
              </h2>
              <p className="text-sm text-muted-foreground">{mode === 'login' ? 'Access Mission Control — your launchpad awaits.' : 'Create your account and ship your first idea today.'}</p>
            </div>

            {success ? (
              <div className="p-7 rounded-xl text-center border border-green-900/20 bg-green-900/10" style={{ animation: 'fadeUp 0.35s ease both' }}>
                <div className="text-3xl mb-2">✓</div>
                <p className="font-semibold text-foreground mb-1">{mode === 'login' ? 'Welcome back!' : 'Account created!'}</p>
                <p className="text-xs text-muted-foreground">{mode === 'login' ? 'Redirecting to Mission Control...' : 'Check your email for confirmation.'}</p>
              </div>
            ) : (
              <form key={formKey} onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <div style={{ animation: 'slideIn 0.25s ease both' }}>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 font-mono">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Dann Lopez"
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 font-mono">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="dann@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 font-mono">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'signup' && password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map(i => {
                          const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
                          return <div key={i} className="flex-1 h-0.5 rounded-sm" style={{ background: i < passwordScore ? colors[passwordScore - 1] : '#2E2A4A' }} />;
                        })}
                      </div>
                      <p className="text-xs font-mono" style={{ color: ['#ef4444', '#f97316', '#eab308', '#22c55e'][passwordScore - 1] || '#9490B5' }}>
                        {['Weak', 'Fair', 'Good', 'Strong'][passwordScore - 1] || ''}
                      </p>
                    </div>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="text-right -mt-2">
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase font-mono">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {error && <div className="p-3 rounded-lg text-xs border border-destructive/20 bg-destructive/10 text-destructive">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-1 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-primary to-blue-500 disabled:opacity-50"
                  style={{ boxShadow: '0 4px 18px rgba(108,71,255,0.267)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground text-center">
                    By signing up you agree to the <Link href="#" className="text-primary hover:underline">Terms</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                )}
              </form>
            )}

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-mono">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button type="button" className="w-full py-3 bg-card border border-border rounded-lg text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-border px-8 py-3 flex justify-between items-center text-xs text-muted-foreground font-mono bg-background/50 backdrop-blur">
        <span>© 2026 DannFlow</span>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Docs'].map(link => <Link key={link} href="#" className="hover:text-foreground transition-colors">{link}</Link>)}
        </div>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-24px) scale(1.04); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
