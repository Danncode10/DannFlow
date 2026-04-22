import Link from 'next/link';

export function AttyJuanNavbar() {
  return (
    <nav
      className="sticky top-0 z-100 border-b"
      style={{
        backgroundColor: 'rgba(245,247,250,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottomColor: '#D1DBE8',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-8 flex items-center justify-between gap-8" style={{ height: '68px' }}>
        {/* Logo */}
        <Link href="/attyjuan" className="flex items-center gap-2 no-underline">
          <div
            className="flex items-center justify-center font-bold text-white text-sm rounded"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#1B4F8A',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            ⚖
          </div>
          <span style={{ color: '#0F1F2E', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.5rem', fontWeight: 800 }}>
            Atty<span style={{ color: '#1B4F8A' }}>Juan</span>
          </span>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-1 list-none">
          {[
            { label: 'How It Works', href: '#how' },
            { label: 'For Clients', href: '#roles' },
            { label: 'For Attorneys', href: '#attorneys' },
            { label: 'About', href: '#trust' },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                style={{
                  color: '#5A6B7D',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0F1F2E';
                  e.currentTarget.style.backgroundColor = '#E8EDF3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#5A6B7D';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-180"
            style={{
              backgroundColor: 'transparent',
              color: '#5A6B7D',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0F1F2E';
              e.currentTarget.style.backgroundColor = '#E8EDF3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#5A6B7D';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all duration-180"
            style={{
              backgroundColor: '#1B4F8A',
              textDecoration: 'none',
              cursor: 'pointer',
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
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
