import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addCartItem,
  fetchProductById,
  fetchReviews,
  submitReport,
  submitReview,
  upsertWishlistItem
} from '../api/client.js';
import useSession from '../state/useSession.js';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { token, setCart } = useSession();

  useEffect(() => {
    fetchProductById(id).then(setProduct);
    fetchReviews(id).then(setReviews).catch(() => setReviews([]));
  }, [id]);

  const handleAddCart = async () => {
    if (!token) return alert('Autentica-te para comprar');
    const cart = await addCartItem(token, { productId: id, quantity: 1 });
    setCart(cart);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!token) return alert('Autentica-te para avaliar');
    const form = new FormData(e.currentTarget);
    const payload = {
      productId: id,
      rating: Number(form.get('rating')),
      comment: form.get('comment')
    };
    await submitReview(token, payload);
    const refreshed = await fetchReviews(id);
    setReviews(refreshed);
    e.currentTarget.reset();
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!token) return alert('Autentica-te para denunciar');
    const reason = new FormData(e.currentTarget).get('reason');
    await submitReport(token, { type: 'product', entityId: id, reason });
    alert('Denúncia enviada para moderação.');
  };

  const handleWishlist = async () => {
    if (!token) return alert('Autentica-te para favoritar');
    await upsertWishlistItem(token, { productId: id, note: 'Favorito detalhado' });
  };

  if (!product) return <div className="card">Carregando produto...</div>;

  const heroImage = product?.media?.[0]?.url ||
    'https://images.unsplash.com/photo-1542293787938-4d273c3c27b9?w=800&q=80&auto=format&fit=crop';

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <img src={heroImage} alt={product.name} />
        </div>
        <div>
          <p className="pill">{product.badges?.[0] || 'Destaque'}</p>
          <h2 className="section-title" style={{ marginTop: 8 }}>{product.name}</h2>
          <p style={{ color: 'var(--muted)' }}>{product.description}</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '12px 0' }}>
            <strong style={{ fontSize: 22 }}>MZN {product.price}</strong>
            <span className="pill">{product.category}</span>
            <span className="pill">{product.seo?.slug || 'SEO pronto'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleAddCart}>Comprar com Mpesa</button>
            <button className="btn btn-ghost" onClick={handleWishlist}>Wishlist</button>
          </div>
          <div style={{ marginTop: 14 }}>
            <h4 className="section-title" style={{ fontSize: 16 }}>Entrega & ETA</h4>
            <p style={{ color: 'var(--muted)' }}>{product.shippingProfile?.etaCopy || 'ETA calculado por região e disponibilidade.'}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Avaliações verificadas</h3>
          <div className="pill">{reviews.length} reviews</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {reviews.map((review) => (
            <div key={review._id || review.id} className="glass" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong>{review.user?.name || 'Comprador'}</strong>
                <span className="pill">{review.rating} ★</span>
              </div>
              <p style={{ color: 'var(--muted)' }}>{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <div style={{ color: 'var(--muted)' }}>Seja o primeiro a avaliar.</div>}
        </div>
        <form onSubmit={handleReview} className="grid" style={{ gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input name="rating" className="input" placeholder="Nota 1-5" type="number" min="1" max="5" required style={{ maxWidth: 140 }} />
            <input name="comment" className="input" placeholder="Comentário" required />
            <button className="btn btn-primary" type="submit">Publicar review</button>
          </div>
        </form>
      </section>

      <section className="card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title">Denunciar / SLA</h3>
          <span className="pill">Proteção anti-fraude + moderação</span>
        </div>
        <form onSubmit={handleReport} style={{ display: 'flex', gap: 8 }}>
          <input className="input" name="reason" placeholder="Motivo da denúncia" required />
          <button className="btn btn-ghost" type="submit">
            Enviar denúncia
          </button>
        </form>
        <p style={{ color: 'var(--muted)' }}>
          Denúncias alimentam a fila de moderação e notificações/auditoria no painel admin. Disputas, reembolsos e retenção em
          escrow são rastreados pelo backend.
        </p>
      </section>
    </div>
  );
}

export default Product;
