import { Link } from 'react-router-dom';

function ProductCard({ product, onAdd, onWishlist }) {
  const heroImage = product?.media?.[0]?.url || 'https://images.unsplash.com/photo-1542293787938-4d273c3c27b9?w=800&q=80&auto=format&fit=crop';
  return (
    <div className="card" style={{ display: 'grid', gap: 10 }}>
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
        <img src={heroImage} alt={product.name} />
        <div className="pill" style={{ position: 'absolute', top: 10, left: 10 }}>{product.badges?.[0] || 'Novo'}</div>
        <button
          className="btn btn-ghost"
          style={{ position: 'absolute', bottom: 10, right: 10, backdropFilter: 'blur(8px)' }}
          onClick={() => onWishlist?.(product)}
        >
          ❤️
        </button>
      </div>
      <Link to={`/product/${product._id || product.id}`} style={{ fontWeight: 700 }}>{product.name}</Link>
      <div style={{ color: '#19f5c1', fontWeight: 700 }}>MZN {product.price?.toFixed?.(2) || product.price}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>
        <span className="pill">{product.category || 'Marketplace'}</span>
        <span>{product.rating ? `${product.rating.toFixed(1)} ★` : 'Sem reviews'}</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={() => onAdd?.(product)}>
          Adicionar
        </button>
        <Link to={`/product/${product._id || product.id}`} className="btn btn-ghost">
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
