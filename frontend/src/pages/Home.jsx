import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LookbookPanel from '../components/LookbookPanel.jsx';
import StyleGuidePanel from '../components/StyleGuidePanel.jsx';
import useSession from '../state/useSession.js';
import { addCartItem, fetchMarketing, fetchProducts, subscribeNewsletter, upsertWishlistItem } from '../api/client.js';

function Home() {
  const [products, setProducts] = useState([]);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const { token, setCart, setMarketing, setLookbook, marketing, lookbook } = useSession();

  useEffect(() => {
    fetchMarketing().then(({ storefront, lookbook: lb }) => {
      setMarketing(storefront);
      setLookbook(lb);
    });
    fetchProducts().then(setProducts);
  }, [setMarketing, setLookbook]);

  const heroData = {
    headline: marketing?.hero?.headline || 'Loja universal com Mpesa e estética de revista.',
    subcopy:
      marketing?.hero?.subcopy ||
      'Checkout Mpesa, vitrine editorial, newsletters automatizados e controle granular para compradores, vendedores e admins.',
    ctas: [
      { label: 'Explorar catálogos', href: '/catalog', primary: true },
      { label: 'Ver lookbook', href: '#lookbook' },
      { label: 'Queres vender?', href: '/seller/apply', primary: false }
    ],
    stats: [
      { label: 'Tempo médio de entrega', value: marketing?.metrics?.eta || '~48h' },
      { label: 'GMV retido em escrow', value: marketing?.metrics?.escrow || 'MZN 1,2M' },
      { label: 'Taxa de disputa', value: marketing?.metrics?.disputes || '0.8%' }
    ]
  };

  const handleAddCart = async (product) => {
    if (!token) return alert('Autentica-te para comprar');
    const updated = await addCartItem(token, {
      productId: product._id || product.id,
      quantity: 1,
      variant: product.variants?.[0]?.sku
    });
    setCart(updated);
  };

  const handleWishlist = async (product) => {
    if (!token) return alert('Autentica-te para favoritar');
    const wishlist = await upsertWishlistItem(token, {
      productId: product._id || product.id,
      note: 'Descoberta da home',
      priority: 'alta'
    });
    alert('Adicionado à wishlist');
    return wishlist;
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    try {
      await subscribeNewsletter({ email, locale: 'pt', interests: ['novidades', 'ofertas'] });
      setNewsletterStatus('Inscrito para novidades e drops editoriais.');
    } catch (err) {
      setNewsletterStatus('Não foi possível inscrever agora.');
    }
  };

  return (
    <div className="grid" style={{ gap: 32 }}>
      <Hero {...heroData} />

      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="section-title">Coleção curada</h2>
          <div className="pill">Sku mix com badges, SEO, variantes e estoque</div>
        </div>
        <div className="section-row" style={{ marginTop: 16 }}>
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id || product.id} product={product} onAdd={handleAddCart} onWishlist={handleWishlist} />
          ))}
          {products.length === 0 && <div style={{ color: 'var(--muted)' }}>Nenhum produto cadastrado ainda.</div>}
        </div>
      </section>

      <LookbookPanel lookbook={lookbook} />
      <StyleGuidePanel styleGuide={marketing?.styleGuide} />

      <section className="card" id="newsletter">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="section-title">Newsletter + anúncios</h3>
            <p style={{ color: 'var(--muted)' }}>
              Dispare anúncios editoriais e campanhas recorrentes para clientes VIP diretamente do backend.
            </p>
          </div>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 10 }}>
            <input className="input" required name="email" placeholder="teu@email" />
            <button className="btn btn-primary" type="submit">
              Assinar
            </button>
          </form>
        </div>
        {newsletterStatus && <p style={{ marginTop: 10, color: '#19f5c1' }}>{newsletterStatus}</p>}
      </section>
    </div>
  );
}

export default Home;
