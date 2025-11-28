import { Link, useLocation } from 'react-router-dom';
import useSession from '../state/useSession.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/cart', label: 'Carrinho' },
  { to: '/account', label: 'Conta' },
  { to: '/admin', label: 'Admin' }
];

function Shell({ children }) {
  const { pathname } = useLocation();
  const { user, cart } = useSession();
  const badge = cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px 80px' }}>
      <header className="navbar" style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 42, height: 42 }}>
            <div className="badge-ring" />
            <div
              style={{
                position: 'absolute',
                inset: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6f7cff, #19f5c1)',
                boxShadow: '0 10px 35px rgba(0,0,0,0.3)'
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: 18 }}>Fluxstore</div>
            <small style={{ color: 'var(--muted)' }}>Mpesa commerce OS</small>
          </div>
        </Link>
        <div style={{ flex: 1, display: 'flex', gap: 12, justifyContent: 'center' }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="pill"
              style={{
                background: pathname === item.to ? 'rgba(111, 124, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)'
              }}
            >
              {item.label}
              {item.to === '/cart' && badge > 0 && <span style={{ marginLeft: 8, color: '#19f5c1' }}>({badge})</span>}
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'right', minWidth: 140 }}>
          <div style={{ fontWeight: 600 }}>{user?.name || 'Visitante'}</div>
          <small style={{ color: 'var(--muted)' }}>{user?.role ? `Perfil ${user.role}` : 'Autentica-te'}</small>
        </div>
      </header>
      {children}
    </div>
  );
}

export default Shell;
