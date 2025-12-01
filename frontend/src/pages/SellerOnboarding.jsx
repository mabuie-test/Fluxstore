import { useEffect, useState } from 'react';
import { applySeller, fetchSellerApplication } from '../api/client.js';
import useSession from '../state/useSession.js';
import { useNavigate } from 'react-router-dom';

function SellerOnboarding() {
  const { token } = useSession();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchSellerApplication(token).then(setApplication).catch(() => {});
  }, [token]);

  if (!token) {
    return (
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <h2 className="section-title">Vende na Fluxstore</h2>
        <p style={{ color: 'var(--muted)' }}>
          Inicia sessão para submeter o pedido de vendedor. A inscrição custa 50 MZN/ano para cobrir a manutenção e
          verificação da tua loja.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/account')}>Entrar ou criar conta</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      storeName: form.get('storeName'),
      category: form.get('category'),
      description: form.get('description'),
      mpesaNumber: form.get('mpesaNumber'),
      website: form.get('website'),
      documents: {
        businessLicense: form.get('businessLicense'),
        taxNumber: form.get('taxNumber'),
        proofOfAddress: form.get('proofOfAddress')
      }
    };
    try {
      const result = await applySeller(token, payload);
      setApplication(result);
      setStatus('Candidatura enviada. Aguarda a aprovação do admin e confirma o pagamento da taxa anual.');
    } catch (err) {
      setStatus(err?.response?.data?.message || 'Não conseguimos enviar. Tenta novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card">
        <h2 className="section-title">Programa de vendedores</h2>
        <p style={{ color: 'var(--muted)' }}>
          Inspirado no AliExpress: onboarding guiado, pagamento Mpesa da taxa anual (50 MZN) e aprovação manual pelo
          admin. Só após aprovação o painel de vendedor e ferramentas avançadas são desbloqueados.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Pedido de ativação</h3>
          <div className="pill">Taxa 50 MZN/ano</div>
        </div>
        {application ? (
          <div className="glass" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="pill">{application.status}</span>
              <strong>{application.storeName}</strong>
            </div>
            <p style={{ color: 'var(--muted)' }}>
              Referência de pagamento: {application.paymentReference || 'aguardando envio'} — Taxa {application.feeDue}{' '}
              {application.feeCurrency} ({application.feeStatus}).
            </p>
            <small style={{ color: 'var(--muted)' }}>
              Histórico: {(application.history || []).map((h) => `${h.status}`).join(' › ')}
            </small>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid" style={{ gap: 10 }}>
            <div className="section-row">
              <input name="storeName" className="input" placeholder="Nome da loja" required />
              <input name="category" className="input" placeholder="Categoria principal" />
              <input name="mpesaNumber" className="input" placeholder="Número Mpesa para payouts" required />
            </div>
            <textarea name="description" className="input" placeholder="Diz-nos que vais vender" rows="3" />
            <div className="section-row">
              <input name="website" className="input" placeholder="Website ou rede social" />
              <input name="businessLicense" className="input" placeholder="Licença empresarial" />
              <input name="taxNumber" className="input" placeholder="NUIT" />
              <input name="proofOfAddress" className="input" placeholder="Comprovativo de morada" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              Submeter candidatura
            </button>
            <p style={{ color: 'var(--muted)', margin: 0 }}>
              Pagamento Mpesa B2C será confirmado pelo admin. Sem aprovação, nenhuma ferramenta de vendedor é exibida no
              frontend.
            </p>
            {status && <div className="pill">{status}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default SellerOnboarding;
