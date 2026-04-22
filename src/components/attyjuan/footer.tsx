import Link from 'next/link';

export function AttyJuanFooter() {
  return (
    <footer style={{ backgroundColor: '#0F1F2E', color: 'rgba(255,255,255,0.7)', padding: '4rem 2rem 2.5rem' }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#1B4F8A', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', fontFamily: 'Outfit, system-ui, sans-serif' }}>⚖</div>
              AttyJuan
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '240px' }}>AI-powered legal bridge for every Filipino. Chat, get a case report, connect with a verified lawyer.</p>
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '100px', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                IBP Partner
              </span>
            </div>
          </div>
          {[
            { title: 'Product', links: ['AI Chat', 'Lawyer Directory', 'Case Reports', 'Pricing'] },
            { title: 'Company', links: ['About', 'For Attorneys', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Disclaimer'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white', marginBottom: '1rem' }}>{col.title}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 AttyJuan. Connecting Filipinos with legal clarity.</span>
          <span>Built by Lester Dann G. Lopez · NVSU Bayombong</span>
        </div>
      </div>
    </footer>
  );
}
