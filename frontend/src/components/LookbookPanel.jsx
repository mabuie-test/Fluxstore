function LookbookPanel({ lookbook }) {
  if (!lookbook) return null;
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <h3 className="section-title">Lookbook editorial</h3>
        <div className="pill">{lookbook.palette?.name || 'Paleta assinada'}</div>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{lookbook.copy}</p>
      <div className="section-row">
        {lookbook.moodboards?.map((board) => (
          <div key={board.title} className="glass" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="pill">{board.tone}</span>
              <strong>{board.title}</strong>
            </div>
            <p style={{ color: 'var(--muted)' }}>{board.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {board.tags?.map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LookbookPanel;
