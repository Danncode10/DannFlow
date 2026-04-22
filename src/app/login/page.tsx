'use client';

import { useState, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check, Github } from 'lucide-react';

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
  const compact = !isDesktop;

  const passwordScore = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108,71,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,71,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -right-[8%] w-[560px] h-[560px] rounded-full opacity-15 blur-[110px]"
          style={{
            background: '#6C47FF',
            animation: 'float 9s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-[15%] -left-[8%] w-[480px] h-[480px] rounded-full opacity-8 blur-[110px]"
          style={{
            background: '#6C47FF',
            animation: 'float 11s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-[45%] left-[38%] w-[280px] h-[280px] rounded-full opacity-5 blur-[77px]"
          style={{
            background: '#1E40AF',
            animation: 'float 13s ease-in-out infinite 3s',
          }}
        />
      </div>

      <div className={`flex-1 flex relative z-10 gap-0 ${isDesktop ? 'flex-row' : 'flex-col'}`}>
        {isDesktop ? (
          <div className="flex-0 w-[400px] flex flex-col justify-between p-[52px_44px] border-r border-border relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(145deg, rgba(108,71,255,0.05) 0%, transparent 55%)',
              }}
            />

            <div className="absolute top-[100px] -right-[50px] w-[180px] h-[180px] rounded-full border border-[rgba(108,71,255,0.125)] pointer-events-none">
              <div
                className="absolute top-1/2 left-1/2 w-[7px] h-[7px] rounded-full bg-primary"
                style={{
                  marginTop: '-3.5px',
                  marginLeft: '-3.5px',
                  animation: 'orbit 5s linear infinite',
                  boxShadow: '0 0 8px rgba(108,71,255,1)',
                }}
              />
            </div>

            <div className="relative z-1">
              <div className="mb-14 flex items-center gap-2">
                <div
                  className="w-[34px] h-[34px] rounded-lg flex items-center justify-center font-bold text-sm text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6C47FF, #3B82F6)',
                    boxShadow: '0 0 18px rgba(108,71,255,0.333)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  D
                </div>
                <span className="text-lg font-bold text-foreground tracking-tighter">DannFlow</span>
                <span
                  className="px-[7px] py-[2px] rounded text-xs text-primary border border-[rgba(108,71,255,0.25)]"
                  style={{
                    background: 'rgba(108,71,255,0.125)',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.06em',
                  }}
                >
                  v2.0
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight mb-3 tracking-tighter">
                Ship your idea.
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #6C47FF, #60A5FA, #6C47FF)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  Not boilerplate.
                </span>
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-[290px] mb-9">
                The AI-native Next.js boilerplate for builders who ship. Plug in your vision — we handle the rest.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  'Next.js 15 + Supabase auth built-in',
                  'AI-native architecture & MCP ready',
                  'Deploy to Vercel in under 2 minutes',
                  'Checkpoint rollback system',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(108,71,255,0.09)',
                        borderColor: 'rgba(108,71,255,0.22)',
                        color: '#6C47FF',
                      }}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-[#C4C0E0] leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex items-center gap-2 p-3 rounded-lg border relative z-1"
              style={{
                background: 'rgba(108,71,255,0.04)',
                borderColor: 'rgba(108,71,255,0.133)',
              }}
            >
              <div
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{
                  background: '#22C55E',
                  boxShadow: '0 0 7px #22C55E',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                All systems operational
              </span>
            </div>
          </div>
        ) : (
          <div className="border-b border-border p-[24px_20px_20px] relative z-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white"
                style={{
                  background: 'linear-gradient(135deg, #6C47FF, #3B82F6)',
                  boxShadow: '0 0 18px rgba(108,71,255,0.333)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                D
              </div>
              <span className="font-bold text-foreground text-sm tracking-tighter">DannFlow</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The AI-native Next.js boilerplate. Ship your idea, not boilerplate.
            </p>
          </div>
        )}

        <div className={`flex-1 flex items-center justify-center p-[${compact ? '28px_20px' : '40px_44px'}] relative z-10`}>
          <div className="w-full max-w-[400px]" style={{ animation: 'fadeUp 0.45s ease both' }}>
            <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-8">
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                    mode === m
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: mode === m ? 'rgba(108,71,255,0.314) 0px 2px 10px' : 'none',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className={`font-bold tracking-tight mb-1 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                {mode === 'login' ? 'Welcome back' : 'Start building'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mode === 'login'
                  ? 'Access Mission Control — your launchpad awaits.'
                  : 'Create your account and ship your first idea today.'}
              </p>
            </div>

            {success ? (
              <div
                className="p-7 rounded-xl text-center border"
                style={{
                  background: 'rgba(34,197,94,0.07)',
                  borderColor: 'rgba(34,197,94,0.22)',
                  animation: 'fadeUp 0.35s ease both',
                }}
              >
                <div className="text-3xl mb-2">✓</div>
                <p className="font-semibold mb-1">
                  {mode === 'login' ? 'Welcome back!' : 'Account created!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mode === 'login'
                    ? 'Redirecting to Mission Control...'
                    : 'Check your email for confirmation.'}
                </p>
              </div>
            ) : (
              <form key={formKey} onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <div style={{ animation: 'slideIn 0.25s ease both' }}>
                    <label
                      className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Dann Lopez"
                        className="w-full pl-10 pr-4 py-3 bg-card/80 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="dann@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-card/80 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-card/80 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}
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
                        {[0, 1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-0.5 rounded-sm transition-colors"
                            style={{
                              background: i < passwordScore ? strengthColors[passwordScore - 1] : '#2E2A4A',
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-xs"
                        style={{
                          color: passwordScore > 0 ? strengthColors[passwordScore - 1] : '#9490B5',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {passwordScore > 0 ? strengthLabels[passwordScore - 1] : ''}
                      </p>
                    </div>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="text-right -mt-2">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {error && (
                  <div
                    className="p-3 rounded-lg text-xs border"
                    style={{
                      background: 'rgba(239,68,68,0.07)',
                      borderColor: 'rgba(239,68,68,0.22)',
                      color: '#f87171',
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-1 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: loading
                      ? 'rgba(108,71,255,0.375)'
                      : 'linear-gradient(135deg, #6C47FF, #3B82F6)',
                    boxShadow: loading
                      ? 'none'
                      : '0 4px 18px rgba(108,71,255,0.267), 0 0 0 1px rgba(255,255,255,0.06)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 6px 24px rgba(108,71,255,0.333), 0 0 0 1px rgba(255,255,255,0.1)`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 18px rgba(108,71,255,0.267), 0 0 0 1px rgba(255,255,255,0.06)`;
                  }}
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
                  <p className="text-xs text-[#5A5680] text-center leading-relaxed">
                    By signing up you agree to the{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                )}
              </form>
            )}

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span
                className="text-xs text-[#5A5680]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                OR
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              className="w-full py-3 bg-card border border-border rounded-lg text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 border-t border-border p-[10px_${compact ? '20px' : '44px'}] flex justify-between items-center flex-wrap gap-2 ${
          compact ? 'flex-col' : ''
        }`}
        style={{
          background: 'rgba(10,10,15,0.75)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span className="text-xs text-[#5A5680]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          © 2026 DannFlow
        </span>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Docs'].map(link => (
            <Link
              key={link}
              href="#"
              className="text-xs text-[#5A5680] hover:text-primary transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(72px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(72px) rotate(-360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
