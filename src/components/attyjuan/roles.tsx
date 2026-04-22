import Link from 'next/link';

export function RolesSection() {
  return (
    <section style={{ backgroundColor: '#F5F7FA', padding: '6rem 2rem' }} id="roles">
      <div className="mx-auto max-w-[1200px]">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#1B4F8A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Who Is This For</div>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 700, color: '#0F1F2E', lineHeight: 1.2 }}>Client or Attorney?</h2>
          <p style={{ margin: '1rem auto 0', fontSize: '1.05rem', color: '#5A6B7D', lineHeight: 1.7, textAlign: 'center' }}>AttyJuan serves both sides of the legal conversation.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          {[
            { icon: '⚖️', title: 'I Need Legal Help', desc: 'Get AI-powered guidance on your legal issue, then connect with a licensed Philippine attorney for a real consultation.', features: ['Chat with Atty Juan AI', 'Receive structured case report', 'Browse & book verified lawyers', 'Secure consultation via GCash'], btn: 'Get Started as Client', href: '/signup?role=user', featured: false },
            { icon: '🏛️', title: 'I\'m a Licensed Attorney', desc: 'Receive pre-qualified client leads with full AI case summaries. Manage your practice, build your reputation.', features: ['Verify with IBP license', 'Receive AI-summarized leads', 'Manage bookings & calendar', 'Secure payment disbursement'], btn: 'Join as Attorney', href: '/signup?role=attorney', featured: true },
          ].map((role, i) => (
            <div key={i} style={{ backgroundColor: '#ffffff', border: role.featured ? '1.5px solid #1B4F8A' : '1.5px solid #D1DBE8', borderRadius: '1.5rem', padding: '2.5rem', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: role.featured ? '0 8px 32px rgba(27,79,138,0.12)' : 'none' }} onMouseEnter={!role.featured ? (e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(27,79,138,0.1)'; e.currentTarget.style.borderColor = 'rgba(27,79,138,0.25)'; } : undefined} onMouseLeave={!role.featured ? (e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#D1DBE8'; } : undefined}>
              {role.featured && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '-2rem', backgroundColor: '#C9A84C', color: '#0F1F2E', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 2.5rem', transform: 'rotate(45deg)' }}>For Attorneys</div>
              )}
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.4rem', backgroundColor: role.featured ? 'rgba(27,79,138,0.08)' : '#E8F0FA' }}>{role.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#0F1F2E', marginBottom: '0.6rem' }}>{role.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#5A6B7D', lineHeight: 1.65, marginBottom: '1.75rem' }}>{role.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem', flex: 1 }}>
                {role.features.map((feat, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#0F1F2E', fontWeight: 500 }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: role.featured ? '#C9A84C' : '#1B4F8A', color: role.featured ? '#0F1F2E' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem' }}>✓</div>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={role.href} className="w-full text-center py-3 rounded-lg font-semibold transition-all duration-180" style={{ backgroundColor: role.featured ? '#C9A84C' : '#1B4F8A', color: role.featured ? '#0F1F2E' : 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: role.featured ? '0 4px 14px rgba(201,168,76,0.3)' : '0 4px 14px rgba(27,79,138,0.3)', fontWeight: 700 }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = role.featured ? '#b8953c' : '#163f6e'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = role.featured ? '#C9A84C' : '#1B4F8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>{role.btn}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
