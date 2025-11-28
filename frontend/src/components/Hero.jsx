function Hero({ headline, subcopy, ctas = [], stats = [] }) {
  return (
    <section className="hero">
      <div className="hero-card">
        <p className="pill" style={{ marginBottom: 12 }}>Pagamentos Mpesa + marketplace global</p>
        <h1 style={{ fontSize: 38, lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-0.03em' }}>{headline}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 18 }}>{subcopy}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {ctas.map((cta) => (
            <a key={cta.label} href={cta.href} className={cta.primary ? 'btn btn-primary' : 'btn btn-ghost'}>
              {cta.label}
            </a>
          ))}
        </div>
      </div>
      <div className="hero-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="badge-ring" />
        <div style={{ position: 'relative' }}>
          <h3 className="section-title">Telemetria em tempo real</h3>
          <p style={{ color: 'var(--muted)' }}>KPIs ao vivo, risco, disputas e pagamentos Mpesa sincronizados.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginTop: 14 }}>
            {stats.map((stat) => (
              <div key={stat.label} className="card" style={{ padding: 12 }}>
                <div style={{ color: '#19f5c1', fontWeight: 700, fontSize: 18 }}>{stat.value}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
