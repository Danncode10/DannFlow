import Link from 'next/link';

export function ChatPreviewSection() {
  return (
    <section style={{ backgroundColor: '#F5F7FA', borderTop: '1px solid #D1DBE8', padding: '6rem 2rem' }}>
      <div className="mx-auto max-w-[1100px] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#1B4F8A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Try It Now
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 700, color: '#0F1F2E', lineHeight: 1.2, marginBottom: '1rem' }}>
            Meet Atty Juan,<br />your AI legal guide
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5A6B7D', lineHeight: 1.7, marginBottom: '2rem' }}>
            Describe your legal problem in plain Filipino or English. Atty Juan listens, applies Philippine law, and gives you a clear path forward — instantly.
          </p>
          <ul style={{ listStyle: 'none', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '⚖', text: 'Trained on Philippine jurisprudence, Civil Code, and IBP guidelines' },
              { icon: '📋', text: 'Generates a structured case report you can bring to any lawyer' },
              { icon: '🔒', text: 'Your conversations are private — never shared without your consent' },
              { icon: '🌐', text: 'Available 24/7 — no appointments, no waiting rooms' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3" style={{ fontSize: '0.9rem', color: '#5A6B7D', lineHeight: 1.5 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#E8F0FA', color: '#1B4F8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>{item.icon}</div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-white font-semibold transition-all duration-180" style={{ backgroundColor: '#1B4F8A', fontSize: '1rem', boxShadow: '0 4px 14px rgba(27,79,138,0.3)', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#163f6e'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,79,138,0.35)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B4F8A'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(27,79,138,0.3)'; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Start Chatting Free
            </Link>
          </div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #D1DBE8', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 24px 64px rgba(27,79,138,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ backgroundColor: '#1B4F8A', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>⚖️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>Atty Juan AI</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '1px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                Online · Philippine Law RAG
              </div>
            </div>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '280px', backgroundColor: '#F5F7FA' }}>
            {[
              { ai: true, text: "Magandang araw! I'm Atty Juan. Tell me about your legal concern — I'm here to help guide you based on Philippine law. 🇵🇭", time: '9:01 AM' },
              { ai: false, text: 'My landlord is keeping my security deposit even after I moved out 2 months ago. Is that legal?', time: '9:02 AM' },
              { ai: true, text: 'Under Republic Act 9653 (Rent Control Act), your landlord is required to return your security deposit within 30 days after lease termination, minus deductions for damage.\n\nSince it\'s been 2 months, you may have grounds to file a complaint. Would you like me to generate a case report?', time: '9:02 AM' },
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', flexDirection: msg.ai ? 'row' : 'row-reverse' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: msg.ai ? '#1B4F8A' : '#C9A84C', color: msg.ai ? 'white' : '#0F1F2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{msg.ai ? 'AJ' : 'JD'}</div>
                <div>
                  <div style={{ maxWidth: '78%', padding: '0.7rem 1rem', borderRadius: '1rem', fontSize: '0.82rem', lineHeight: 1.55, backgroundColor: msg.ai ? '#ffffff' : '#1B4F8A', border: msg.ai ? '1px solid #D1DBE8' : 'none', color: msg.ai ? '#0F1F2E' : 'white', borderBottomLeftRadius: msg.ai ? '4px' : '1rem', borderBottomRightRadius: msg.ai ? '1rem' : '4px' }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#5A6B7D', marginTop: '0.25rem', textAlign: 'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #D1DBE8', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff' }}>
            <div style={{ flex: 1, backgroundColor: '#F5F7FA', border: '1px solid #D1DBE8', borderRadius: '100px', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#5A6B7D' }}>Type your legal concern...</div>
            <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1B4F8A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#163f6e'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B4F8A'; e.currentTarget.style.transform = 'scale(1)'; }}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
          <div style={{ padding: '0.6rem 1.25rem', backgroundColor: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '0.68rem', color: '#5A6B7D', textAlign: 'center' }}>
            ⚠ AI guidance only — not formal legal advice. IBP-licensed lawyers available for consultation.
          </div>
        </div>
      </div>
    </section>
  );
}
