import { useEffect, useState } from 'react';
import useSession from '../state/useSession.js';
import { createOrder, fetchCart, updateCartItem } from '../api/client.js';

function Cart() {
  const { token, cart, setCart } = useSession();
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchCart(token).then(setCart);
  }, [token, setCart]);

  const handleQuantity = async (item, quantity) => {
    const updated = await updateCartItem(token, item._id || item.id, { quantity });
    setCart(updated);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      channel: 'mpesa',
      deliveryAddress: form.get('address'),
      loyaltyToRedeem: Number(form.get('loyalty') || 0)
    };
    try {
      const order = await createOrder(token, payload);
      setStatus(`Pedido ${order.reference || order._id} criado. Mpesa escrow aguardando confirmação.`);
    } catch (err) {
      setStatus('Checkout falhou. Confere os dados.');
    }
  };

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 className="section-title">Carrinho</h2>
        <div className="pill">Escrow Mpesa + fidelidade</div>
        <div className="pill">{cart.items?.length || 0} itens</div>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.items?.map((item) => (
              <tr key={item._id || item.id}>
                <td>{item.name}</td>
                <td>MZN {item.price}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    style={{ maxWidth: 100 }}
                    defaultValue={item.quantity}
                    onBlur={(e) => handleQuantity(item, Number(e.target.value))}
                  />
                </td>
                <td>MZN {(item.quantity || 1) * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {cart.items?.length === 0 && <div style={{ color: 'var(--muted)' }}>Seu carrinho está vazio.</div>}
      </div>
      <form onSubmit={handleCheckout} className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <input name="address" className="input" placeholder="Endereço e localização para cálculo de prazo" required />
          <input name="loyalty" className="input" placeholder="Pontos de fidelidade para usar" />
        </div>
        <button className="btn btn-primary" type="submit">
          Finalizar com Mpesa
        </button>
        {status && <div style={{ color: '#19f5c1' }}>{status}</div>}
      </form>
    </div>
  );
}

export default Cart;
