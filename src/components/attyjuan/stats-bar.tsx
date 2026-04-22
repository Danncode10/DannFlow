export function StatsBa() {
  const stats = [
    'Philippine Law RAG',
    'IBP-Verified Attorneys',
    'GCash & PayMaya Payments',
    'Secure Real-Time Consultations',
    'AI Case Report Generation',
  ];

  return (
    <div style={{ backgroundColor: '#1B4F8A', color: 'white', padding: '1.25rem 2rem' }}>
      <div className="mx-auto max-w-[1200px] flex items-center justify-center gap-12 flex-wrap">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#C9A84C',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.9 }}>{stat}</span>
            {i < stats.length - 1 && (
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  marginLeft: '0.75rem',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
