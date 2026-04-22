export function HowItWorksSection() {
  const steps = [
    { num: 1, title: 'Describe Your Issue', desc: 'Chat with Atty Juan in plain Filipino or English. Our AI — trained on Philippine jurisprudence — listens and guides you.', tag: 'AI-Powered' },
    { num: 2, title: 'Receive Your Case Report', desc: 'Get a structured report: legal issues identified, applicable laws cited, and recommended next steps — ready for any lawyer to review.', tag: 'Instant Report' },
    { num: 3, title: 'Book a Verified Lawyer', desc: 'Browse IBP-verified attorneys matched to your case. Book a consultation, pay securely via GCash, PayMaya, or card.', tag: 'IBP Verified' },
  ];

  return (
    <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #D1DBE8', borderBottom: '1px solid #D1DBE8', padding: '6rem 2rem' }} id="how">
      <div className="mx-auto max-w-[1200px]">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#1B4F8A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>The Process</div>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 700, color: '#0F1F2E', lineHeight: 1.2 }}>Three steps to legal clarity</h2>
          <p style={{ marginTop: '1rem', fontSize: '1.05rem', color: '#5A6B7D', lineHeight: 1.7, maxWidth: '540px', margin: '1rem auto 0' }}>No confusing forms. No cold-calling lawyers. Just describe your problem and we take it from there.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: '1.25rem', backgroundColor: '#F5F7FA', border: '1px solid #D1DBE8', transition: 'all 0.2s', position: 'relative', zIndex: 1 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(27,79,138,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,79,138,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D1DBE8'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: i === 1 ? '#C9A84C' : '#1B4F8A', color: i === 1 ? '#0F1F2E' : 'white', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: i === 1 ? '0 4px 16px rgba(201,168,76,0.3)' : '0 4px 16px rgba(27,79,138,0.25)' }}>{step.num}</div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.2rem', fontWeight: 700, color: '#0F1F2E', marginBottom: '0.75rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#5A6B7D', lineHeight: 1.7 }}>{step.desc}</p>
              <span style={{ display: 'inline-block', marginTop: '1.25rem', padding: '0.3rem 0.75rem', borderRadius: '100px', backgroundColor: i === 1 ? 'rgba(201,168,76,0.1)' : '#E8F0FA', color: i === 1 ? '#a07a20' : '#1B4F8A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{step.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
