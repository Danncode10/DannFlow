'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, Users } from 'lucide-react';

export function AttyJuanHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width;
    let H = canvas.height;
    let particles: any[] = [];
    const COUNT = 55;
    const MAX_DIST = 130;
    const PRIMARY = [27, 79, 138];
    const GOLD = [201, 168, 76];

    const resize = () => {
      W = canvas.width = canvas.parentElement?.offsetWidth || 800;
      H = canvas.height = canvas.parentElement?.offsetHeight || 600;
    };

    const mkParticle = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 1.5,
      color: Math.random() > 0.7 ? GOLD : PRIMARY,
      alpha: Math.random() * 0.3 + 0.25,
    });

    const init = () => {
      resize();
      particles = Array.from({ length: COUNT }, mkParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${PRIMARY.join(',')},${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.join(',')},${p.alpha})`;
        ctx.fill();
      });
    };

    const update = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      });
    };

    const loop = () => {
      update();
      draw();
      requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    init();
    loop();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ padding: '6rem 2rem 5rem' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 80% -10%, rgba(27,79,138,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at -10% 80%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[860px] text-center">
        {/* Badge */}
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{
            borderColor: 'rgba(27,79,138,0.2)',
            backgroundColor: 'rgba(27,79,138,0.05)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#1B4F8A',
            letterSpacing: '0.04em',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#C9A84C',
            }}
          />
          AI-Powered Legal Bridge for Filipinos
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#0F1F2E',
            marginBottom: '1.5rem',
          }}
        >
          Legal Clarity,
          <br />
          <span
            style={{
              color: '#1B4F8A',
              textDecoration: 'underline',
              textDecorationColor: '#C9A84C',
              textDecorationThickness: '3px',
              textUnderlineOffset: '6px',
            }}
          >
            for Every Filipino
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto max-w-[560px] mb-10"
          style={{
            fontSize: '1.15rem',
            color: '#5A6B7D',
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Chat with Atty Juan — an AI trained on Philippine jurisprudence. Get a structured case report. Connect with
          verified, IBP-licensed attorneys instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
          <Link
            href="/signup"
            className="flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold transition-all duration-180"
            style={{
              backgroundColor: '#1B4F8A',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(27,79,138,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#163f6e';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,79,138,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1B4F8A';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(27,79,138,0.3)';
            }}
          >
            <MessageCircle size={18} />
            Chat with Atty Juan
          </Link>

          <Link
            href="/signup?role=attorney"
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-180"
            style={{
              backgroundColor: 'transparent',
              color: '#1B4F8A',
              border: '1.5px solid #D1DBE8',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1B4F8A';
              e.currentTarget.style.backgroundColor = '#E8F0FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D1DBE8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Users size={18} />
            Browse Lawyers
          </Link>
        </div>

        {/* Disclaimer */}
        <div
          className="flex items-center justify-center gap-1"
          style={{
            fontSize: '0.78rem',
            color: '#5A6B7D',
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          AI guidance only — not formal legal advice. All lawyers are IBP-verified.
        </div>
      </div>
    </section>
  );
}
