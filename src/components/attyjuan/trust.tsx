export function TrustSection() {
  return (
    <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #D1DBE8', padding: '4rem 2rem', textAlign: 'center' }} id="trust">
      <div className="mx-auto max-w-[680px]">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '100px', backgroundColor: '#E8F0FA', border: '1px solid rgba(27,79,138,0.15)', color: '#1B4F8A', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Safety & Legal Compliance
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#0F1F2E', marginBottom: '0.75rem' }}>Built with Responsibility</h3>
        <p style={{ fontSize: '0.9rem', color: '#5A6B7D', lineHeight: 1.7 }}>
          AttyJuan provides <strong style={{ color: '#0F1F2E', fontWeight: 600 }}>informational guidance only</strong> and does not constitute formal legal advice or create an attorney-client relationship. All AI recommendations are reviewed by licensed members of the <strong style={{ color: '#0F1F2E', fontWeight: 600 }}>Integrated Bar of the Philippines (IBP)</strong>. AttyJuan is a platform — a bridge, not a law firm.
        </p>
      </div>
    </section>
  );
}
