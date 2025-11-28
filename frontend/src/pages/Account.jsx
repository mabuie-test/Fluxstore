import { useEffect, useState } from 'react';
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
  const { token, setToken, user, setUser, setWishlist, wishlist, setNotifications, preferences, setPreferences } = useSession();
  const [resetStatus, setResetStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchWishlist(token).then(setWishlist);
    fetchNotifications(token).then(setNotifications);
  }, [token, setWishlist, setNotifications]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { name: form.get('name'), email: form.get('email'), password: form.get('password') };
    const res = await register(payload);
    setToken(res.token);
    setUser(res.user);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await login({ email: form.get('email'), password: form.get('password') });
    setToken(res.token);
    setUser(res.user);
  };

  const handleSocial = async (provider) => {
    const res = await socialLogin({ provider, token: 'placeholder-social-token' });
    setToken(res.token);
    setUser(res.user);
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

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card">
        <h2 className="section-title">Conta</h2>
        <p style={{ color: 'var(--muted)' }}>
          Login por email (verificação + recuperação), integração social (Google/Facebook) e gestão de preferências regionais.
        </p>
      </div>

      {!token && (
        <div className="section-row">
          <form onSubmit={handleRegister} className="card" style={{ display: 'grid', gap: 10 }}>
            <h3 className="section-title">Criar conta</h3>
            <input name="name" className="input" placeholder="Nome" required />
            <input name="email" className="input" placeholder="Email" required />
            <input name="password" className="input" placeholder="Senha" type="password" required />
            <button className="btn btn-primary" type="submit">
              Registrar
            </button>
          </form>

          <form onSubmit={handleLogin} className="card" style={{ display: 'grid', gap: 10 }}>
            <h3 className="section-title">Entrar</h3>
            <input name="email" className="input" placeholder="Email" required />
            <input name="password" className="input" placeholder="Senha" type="password" required />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" type="submit">
                Login
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => handleSocial('google')}>
                Google
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => handleSocial('facebook')}>
                Facebook
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="section-row">
        <form onSubmit={handleResetRequest} className="card" style={{ display: 'grid', gap: 10 }}>
          <h3 className="section-title">Recuperação de palavra-passe</h3>
          <input name="email" className="input" placeholder="Teu email" required />
          <button className="btn btn-ghost" type="submit">
            Enviar link
          </button>
        </form>

        <form onSubmit={handleResetConfirm} className="card" style={{ display: 'grid', gap: 10 }}>
          <h3 className="section-title">Confirmar reset</h3>
          <input name="token" className="input" placeholder="Token recebido" required />
          <input name="password" className="input" placeholder="Nova senha" type="password" required />
          <button className="btn btn-primary" type="submit">
            Atualizar senha
          </button>
        </form>
      </div>
      {resetStatus && <div className="pill">{resetStatus}</div>}

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
