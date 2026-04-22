import React from 'react';

export function FlowSection() {
  const flowSteps = [
    { emoji: '💬', label: 'User Describes Problem' },
    { emoji: '🤖', label: 'AI Analyzes & Guides' },
    { emoji: '📋', label: 'Case Report Generated', isGold: true },
    { emoji: '🔍', label: 'Lawyer Matched' },
    { emoji: '📅', label: 'Consultation Booked' },
    { emoji: '⚖️', label: 'Legal Resolution', isGold: true },
  ];

  return (
    <section style={{ backgroundColor: '#1B4F8A', color: 'white', padding: '5rem 2rem', textAlign: 'center' }}>
      <div className="mx-auto max-w-[1200px]">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>End-to-End Flow</div>
        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 700, color: 'white', marginTop: '0.5rem' }}>From problem to resolution</h2>
        <div className="flex items-start justify-center gap-0 mt-14 flex-wrap">
          {flowSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center" style={{ maxWidth: '140px' }}>
                <div
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${step.isGold ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.3)'}`, backgroundColor: step.isGold ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = '#C9A84C'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = step.isGold ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = step.isGold ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.3)'; }}
                >
                  {step.emoji}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{step.label}</div>
              </div>
              {i < flowSteps.length - 1 && (
                <div style={{ marginTop: '12px', color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', padding: '0 0.25rem' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
