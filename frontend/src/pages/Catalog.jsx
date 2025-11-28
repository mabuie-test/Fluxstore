import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import useSession from '../state/useSession.js';
import { addCartItem, fetchProducts, upsertWishlistItem } from '../api/client.js';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const { token, setCart } = useSession();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()) || p.tags?.some((t) => t.includes(query)));
  }, [products, query]);

  const handleAddCart = async (product) => {
    if (!token) return alert('Autentica-te para comprar');
    const updated = await addCartItem(token, { productId: product._id || product.id, quantity: 1 });
    setCart(updated);
  };

  const handleWishlist = async (product) => {
    if (!token) return alert('Autentica-te para favoritar');
    await upsertWishlistItem(token, { productId: product._id || product.id, note: 'Favorito do catálogo' });
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 className="section-title">Catálogo</h2>
        <input
          className="input"
          placeholder="Buscar por nome, tag, badge..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 360 }}
        />
        <div className="pill">{filtered.length} itens</div>
      </div>
      <div className="section-row">
        {filtered.map((product) => (
          <ProductCard key={product._id || product.id} product={product} onAdd={handleAddCart} onWishlist={handleWishlist} />
        ))}
      </div>
    </div>
  );
}

export default Catalog;
