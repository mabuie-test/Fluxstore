import { useEffect, useState } from 'react';
import useSession from '../state/useSession.js';
import {
  adminBroadcast,
  adminDashboard,
  adminMenu,
  adminReports,
  adminResolveReport,
  adminSettings,
  adminSellerApplications,
  adminReviewSellerApplication,
  updateAdminSettings
} from '../api/client.js';

function AdminConsole() {
  const { token } = useSession();
  const [dashboard, setDashboard] = useState(null);
  const [settings, setSettings] = useState(null);
  const [reports, setReports] = useState([]);
  const [menu, setMenu] = useState([]);
  const [sellerApps, setSellerApps] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    adminDashboard(token).then(setDashboard).catch(() => {});
    adminSettings(token).then(setSettings).catch(() => {});
    adminReports(token).then(setReports).catch(() => {});
    adminMenu(token).then(setMenu).catch(() => {});
    adminSellerApplications(token).then(setSellerApps).catch(() => {});
  }, [token]);

  const handleSettings = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      branding: { accent: form.get('accent'), vibe: form.get('vibe') },
      payouts: { commissionPlatform: Number(form.get('commission')) },
      featureFlags: { disputes: true, newsletters: true }
    };
    const updated = await updateAdminSettings(token, payload);
    setSettings(updated);
    setStatus('Configuração salva e propagada para o storefront.');
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await adminBroadcast(token, {
      title: form.get('title'),
      message: form.get('message'),
      roles: ['buyer', 'seller']
    });
    setStatus('Broadcast enviado.');
  };

  const handleResolve = async (report) => {
    const updated = await adminResolveReport(token, report._id || report.id, { status: 'resolved' });
    setReports((prev) => prev.map((r) => (r._id === report._id ? updated : r)));
  };

  const handleSellerReview = async (app, approval = true) => {
    const updated = await adminReviewSellerApplication(token, app._id || app.id, {
      status: approval ? 'approved' : 'rejected',
      feeStatus: approval ? 'paid' : app.feeStatus,
      note: approval ? 'Taxa confirmada (50 MZN) e vendedor liberado' : 'Dados insuficientes'
    });
    setSellerApps((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  };

  if (!token) return <div className="card">Precisas de login admin.</div>;

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card">
        <h2 className="section-title">Console Admin</h2>
        <p style={{ color: 'var(--muted)' }}>
          KPIs em tempo real, menus dinâmicos por role, gestão de branding sem código, denúncias e broadcast de notificações.
        </p>
      </div>

      <section className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <h3 className="section-title">Dashboard</h3>
          <div className="pill">GMV {dashboard?.gmv || '—'}</div>
          <div className="pill">Disputas {dashboard?.disputesOpen || 0}</div>
          <div className="pill">Usuários {dashboard?.users || 0}</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {menu.map((entry) => (
            <div key={entry.title} className="glass" style={{ padding: 12 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="pill">{entry.role}</span>
                <strong>{entry.title}</strong>
              </div>
              <p style={{ color: 'var(--muted)' }}>{entry.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Configuração viva</h3>
          <div className="pill">Branding + taxas</div>
        </div>
        <form onSubmit={handleSettings} className="section-row">
          <input name="accent" className="input" defaultValue={settings?.branding?.accent || '#6f7cff'} placeholder="Cor accent" />
          <input name="vibe" className="input" defaultValue={settings?.branding?.vibe || 'Futurista editorial'} placeholder="Vibe" />
          <input
            name="commission"
            className="input"
            defaultValue={settings?.payouts?.commissionPlatform || 10}
            type="number"
            step="0.1"
          />
          <button className="btn btn-primary" type="submit">
            Publicar
          </button>
        </form>
      </section>

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Candidaturas de vendedores</h3>
          <div className="pill">Taxa 50 MZN</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {sellerApps.map((app) => (
            <div key={app._id || app.id} className="glass" style={{ padding: 12 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="pill">{app.status}</span>
                <strong>{app.storeName}</strong>
              </div>
              <p style={{ color: 'var(--muted)' }}>
                Mpesa: {app.mpesaNumber} · Taxa {app.feeStatus} · Categoria {app.category || '—'}
              </p>
              <small style={{ color: 'var(--muted)' }}>Solicitante: {app.user?.email}</small>
              <div className="section-row" style={{ marginTop: 8 }}>
                <button className="btn btn-primary" onClick={() => handleSellerReview(app, true)}>
                  Aprovar e liberar
                </button>
                <button className="btn btn-ghost" onClick={() => handleSellerReview(app, false)}>
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
          {sellerApps.length === 0 && <p style={{ color: 'var(--muted)' }}>Nenhuma candidatura nova.</p>}
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Denúncias e moderação</h3>
          <div className="pill">Fila ativa</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {reports.map((report) => (
            <div key={report._id || report.id} className="glass" style={{ padding: 12 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="pill">{report.type}</span>
                <strong>{report.reason}</strong>
              </div>
              <p style={{ color: 'var(--muted)' }}>Entidade: {report.entityId}</p>
              <button className="btn btn-ghost" onClick={() => handleResolve(report)}>
                Resolver
              </button>
            </div>
          ))}
          {reports.length === 0 && <p style={{ color: 'var(--muted)' }}>Nenhuma denúncia ativa.</p>}
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Broadcast</h3>
          <div className="pill">Notificações role-based</div>
        </div>
        <form onSubmit={handleBroadcast} className="section-row">
          <input name="title" className="input" placeholder="Título" required />
          <input name="message" className="input" placeholder="Mensagem" required />
          <button className="btn btn-primary" type="submit">
            Disparar
          </button>
        </form>
      </section>

      {status && <div className="pill">{status}</div>}
    </div>
  );
}

export default AdminConsole;
