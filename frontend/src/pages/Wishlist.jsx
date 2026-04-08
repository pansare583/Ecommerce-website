import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingIds, setAddingIds] = useState(new Set());
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const r = await api.get('/wishlist');
      setWishlist(r.data);
    } catch { addToast('Failed to fetch wishlist', 'error'); }
    finally { setLoading(false); }
  };

  const removeFromWishlist = async (e, productId) => {
    e.stopPropagation();
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(w => w.filter(item => item.id !== productId));
      addToast('Removed from wishlist', 'info');
    } catch { addToast('Failed to remove item', 'error'); }
  };

  const addToCart = async (e, product) => {
    e.stopPropagation();
    setAddingIds(prev => new Set(prev).add(product.id));
    try {
      await api.post(`/cart/add?productId=${product.id}&quantity=1`);
      addToast(`"${product.name}" added to cart! 🛒`, 'success');
    } catch { addToast('Failed to add to cart', 'error'); }
    finally { setAddingIds(prev => { const n = new Set(prev); n.delete(product.id); return n; }); }
  };

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: '70vh' }}>
      <div className="spinner" />
      <span style={{ color: '#8B7BA8', fontWeight: 500 }}>Unveiling your favorites… ✨</span>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">💜 My Wishlist</h1>
        <p className="page-subtitle">
          {wishlist.length > 0 ? `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later` : 'Your personal collection of favorites'}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-container empty-state">
          <div className="empty-state-icon"><Heart size={60} /></div>
          <h3>Your wishlist is quiet 🌸</h3>
          <p>Explore our collections and save your must-haves here.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: 'auto', padding: '0.85rem 2.25rem' }}>
            <Sparkles size={17} /> Explore Shop
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              {/* Image */}
              <div className="product-image-wrapper">
                {product.imageUrl ? (
                  <img className="product-img" src={product.imageUrl} alt={product.name} />
                ) : (
                  <span style={{ fontSize: '3rem' }}>🛍️</span>
                )}

                <span className="badge badge-primary" style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.65rem' }}>
                  {product.category || 'Product'}
                </span>

                {/* Remove from wishlist */}
                <button
                  onClick={e => removeFromWishlist(e, product.id)}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(240,98,146,0.12)',
                    border: '1.5px solid rgba(240,98,146,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,98,146,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,98,146,0.12)'}
                >
                  <Trash2 size={15} color="#F06292" />
                </button>
              </div>

              {/* Body */}
              <div className="product-body">
                <p className="product-name">{product.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                   {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11} 
                        fill={s <= Math.round(product.rating || 4) ? '#FFAB40' : 'none'} 
                        color={s <= Math.round(product.rating || 4) ? '#FFAB40' : '#D1C4E9'} 
                      />
                    ))}
                    <span style={{ fontSize: '0.7rem', color: '#8B7BA8' }}>({product.reviewCount || 0})</span>
                </div>
                <p className="product-desc">{product.description || 'Premium quality product.'}</p>
              </div>

              {/* Footer */}
              <div className="product-footer">
                <p className="product-price">₹{product.price?.toFixed(2)}</p>
                <button
                  onClick={e => addToCart(e, product)}
                  className="btn-primary"
                  disabled={addingIds.has(product.id)}
                  style={{ width: 'auto', padding: '0.55rem 1.1rem', fontSize: '0.8rem' }}
                >
                  <ShoppingCart size={14} />
                  {addingIds.has(product.id) ? 'Adding…' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
