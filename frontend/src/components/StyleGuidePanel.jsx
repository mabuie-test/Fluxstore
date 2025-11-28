function StyleGuidePanel({ styleGuide }) {
  if (!styleGuide) return null;
  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <h3 className="section-title">Guia de estilo</h3>
        <span className="pill">{styleGuide.themeName}</span>
      </div>
      <p style={{ color: 'var(--muted)' }}>{styleGuide.copy}</p>
      <div className="section-row">
        {styleGuide.presets?.map((preset) => (
          <div key={preset.name} className="glass" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{preset.name}</strong>
              <span className="pill">{preset.layout}</span>
            </div>
            <p style={{ color: 'var(--muted)' }}>{preset.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {preset.colors?.map((color) => (
                <span key={color} className="pill" style={{ border: '1px solid var(--border)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: color, display: 'inline-block', marginRight: 6 }} />
                  {color}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StyleGuidePanel;
