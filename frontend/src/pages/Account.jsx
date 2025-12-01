import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSession from '../state/useSession.js';
import {
  fetchNotifications,
  fetchWishlist,
  login,
  register,
  requestPasswordReset,
  resetPassword,
  socialLogin,
  updatePreferences
} from '../api/client.js';

function Account() {
  const {
    token,
    user,
    setSession,
    clearSession,
    setWishlist,
    wishlist,
    setNotifications,
    preferences,
    setPreferences
  } = useSession();
  const [resetStatus, setResetStatus] = useState('');
  const [mode, setMode] = useState('login');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    fetchWishlist(token).then(setWishlist);
    fetchNotifications(token).then(setNotifications);
  }, [token, setWishlist, setNotifications]);

  const runAuth = async (promise, successMessage = '') => {
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await promise;
      setSession(res.token, res.user);
      setStatus({ type: 'success', message: successMessage || 'Sessão iniciada com sucesso.' });
      const destination =
        location.state?.from || (['admin', 'staff', 'superadmin'].includes(res.user?.role) ? '/admin' : '/');
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Não foi possível autenticar. Verifica os dados e tenta novamente.';
      setStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { name: form.get('name'), email: form.get('email'), password: form.get('password') };
    await runAuth(register(payload), 'Conta criada e login efetuado.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await runAuth(login({ email: form.get('email'), password: form.get('password') }), 'Bem-vindo de volta.');
  };

  const handleSocial = async (provider) => {
    await runAuth(socialLogin({ provider, token: 'placeholder-social-token' }), `Login via ${provider}`);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    await requestPasswordReset(email);
    setResetStatus('Verifica o email para redefinir a palavra-passe.');
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await resetPassword({ token: form.get('token'), newPassword: form.get('password') });
    setResetStatus('Senha atualizada, entra novamente.');
  };

  const handlePreferences = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updated = await updatePreferences(token, {
      locale: form.get('locale'),
      currency: form.get('currency'),
      marketingOptIn: form.get('marketing') === 'on'
    });
    setPreferences(updated.preferences || updated);
  };

  const handleLogout = () => {
    clearSession();
    setStatus({ type: 'success', message: 'Terminaste a sessão com segurança.' });
    navigate('/');
  };

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card auth-hero-card">
        <div>
          <h2 className="section-title">A tua conta Fluxstore</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 620 }}>
            Checkout Mpesa instantâneo, recuperação de palavra-passe, verificação por email e um painel em camadas
            (buyer/seller/admin) inspirado no fluxo do AliExpress. Mantemos sessão persistida para que o login do deploy
            não falhe e só mostramos ferramentas conforme o teu papel.
          </p>
          {user && (
            <div className="pill" style={{ marginTop: 10 }}>
              Sessão ativa: {user.name} — {user.role || 'buyer'}
            </div>
          )}
        </div>
        <div className="badge-stack">
          <div className="badge-ring" />
          <div className="badge-ring badge-ring--warm" />
          <div className="badge-gem" />
        </div>
      </div>

      <div className="auth-grid">
        <div className="card auth-panel">
          <div className="auth-toggle">
            <button className={mode === 'login' ? 'tab active' : 'tab'} type="button" onClick={() => setMode('login')}>
              Já tens conta? Entrar
            </button>
            <button
              className={mode === 'register' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setMode('register')}
            >
              Primeira vez? Criar conta
            </button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div>
                <label className="input-label">Email</label>
                <input name="email" className="input" placeholder="email@dominio.com" required />
              </div>
              <div>
                <label className="input-label">Senha</label>
                <input name="password" className="input" placeholder="••••••••" type="password" required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                Entrar agora
              </button>
              <p className="auth-hint">Ainda não tens conta? <span onClick={() => setMode('register')}>Regista-te.</span></p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div>
                <label className="input-label">Nome</label>
                <input name="name" className="input" placeholder="Teu nome" required />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input name="email" className="input" placeholder="email@dominio.com" required />
              </div>
              <div>
                <label className="input-label">Senha</label>
                <input name="password" className="input" placeholder="Cria uma senha forte" type="password" required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                Criar conta e entrar
              </button>
              <p className="auth-hint">Já tens conta? <span onClick={() => setMode('login')}>Faz login.</span></p>
            </form>
          )}
          <div className="auth-divider">ou continua com</div>
          <div className="auth-social">
            <button className="btn btn-ghost" type="button" onClick={() => handleSocial('google')} disabled={submitting}>
              Google
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => handleSocial('facebook')} disabled={submitting}>
              Facebook
            </button>
          </div>
          {status.message && (
            <div className={`pill ${status.type === 'error' ? 'pill-error' : 'pill-success'}`}>{status.message}</div>
          )}
          {token && (
            <div className="auth-session">
              <div>
                <strong>{user?.name}</strong>
                <p style={{ color: 'var(--muted)', margin: 0 }}>Perfil: {user?.role || 'buyer'}</p>
              </div>
              <div className="auth-session-actions">
                {['admin', 'staff', 'superadmin'].includes(user?.role) && (
                  <span className="pill">Acesso ao console ao entrar</span>
                )}
                <button className="btn btn-ghost" type="button" onClick={handleLogout}>
                  Terminar sessão
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card auth-side">
          <h3 className="section-title">Recuperação e segurança</h3>
          <p style={{ color: 'var(--muted)' }}>
            Enviamos links de redefinição e validação por email. Mantemos MFA social como opção alternativa.
          </p>
          <form onSubmit={handleResetRequest} className="stacked">
            <label className="input-label">Recuperar palavra-passe</label>
            <div className="auth-inline">
              <input name="email" className="input" placeholder="Teu email" required />
              <button className="btn btn-ghost" type="submit" disabled={submitting}>
                Enviar link
              </button>
            </div>
          </form>
          <form onSubmit={handleResetConfirm} className="stacked">
            <label className="input-label">Confirmar reset</label>
            <div className="auth-inline">
              <input name="token" className="input" placeholder="Token recebido" required />
              <input name="password" className="input" placeholder="Nova senha" type="password" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              Atualizar senha
            </button>
          </form>
          {resetStatus && <div className="pill">{resetStatus}</div>}
        </div>
      </div>

      <form onSubmit={handlePreferences} className="card" style={{ display: 'grid', gap: 10 }}>
        <h3 className="section-title">Preferências e newsletter</h3>
        <div className="section-row">
          <input name="locale" className="input" defaultValue={preferences.locale} placeholder="pt" />
          <input name="currency" className="input" defaultValue={preferences.currency} placeholder="MZN" />
          <label className="pill" style={{ gap: 8 }}>
            <input name="marketing" type="checkbox" defaultChecked /> Opt-in novidades
          </label>
        </div>
        <button className="btn btn-primary" type="submit">
          Guardar preferências
        </button>
      </form>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Wishlist & notificações</h3>
          <div className="pill">Personalização da vitrine</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: 12 }}>
          <div className="glass" style={{ padding: 14 }}>
            <h4 className="section-title" style={{ fontSize: 16 }}>Wishlist</h4>
            {wishlist.map((item) => (
              <div key={item._id || item.id} className="card" style={{ marginTop: 6 }}>
                <strong>{item.product?.name || item.productId}</strong>
                <p style={{ color: 'var(--muted)' }}>{item.note}</p>
              </div>
            ))}
            {wishlist.length === 0 && <p style={{ color: 'var(--muted)' }}>Sem itens.</p>}
          </div>
          <div className="glass" style={{ padding: 14 }}>
            <h4 className="section-title" style={{ fontSize: 16 }}>Alerts</h4>
            <p style={{ color: 'var(--muted)' }}>
              Todas as notificações (pedidos, disputas, auditoria) ficam ancoradas no sininho flutuante e aqui para histórico.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Account;
