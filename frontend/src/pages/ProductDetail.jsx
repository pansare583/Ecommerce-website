import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { ShoppingCart, ArrowLeft, Star, Check, Tag, Heart, Minus, Plus, Truck, Shield, RefreshCw, Zap } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data);
        setActiveImage(r.data.imageUrl);
        // Track recently viewed
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updated = [r.data, ...viewed.filter(p => p.id !== r.data.id)].slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        setRecentlyViewed(updated.filter(p => p.id !== r.data.id));
      })
      .catch(() => { addToast('Product not found', 'error'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && product) {
      api.get('/wishlist').then(r => {
        const isW = r.data.some(p => p.id === product.id);
        setWishlisted(isW);
      }).catch(() => {});
    }
  }, [user, product]);

  const handleAddToCart = async (showToast = true) => {
    if (!user) { addToast('Please login first!', 'error'); navigate('/login'); return false; }
    setAdding(true);
    try {
      await api.post(`/cart/add?productId=${id}&quantity=${quantity}`);
      if (showToast) addToast(`${quantity}x "${product.name}" added to cart! 🛒`, 'success');
      return true;
    } catch { 
      addToast('Failed to add to cart', 'error'); 
      return false;
    } finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    if (!user) { addToast('Please login first!', 'error'); navigate('/login'); return; }
    setBuyingNow(true);
    try {
      const res = await api.post(`/cart/add?productId=${id}&quantity=${quantity}`);
      const cartItemId = res.data.id;
      navigate('/checkout', { state: { selectedItemIds: [cartItemId] } });
    } catch {
      addToast('Failed to process request', 'error');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) { addToast('Please login to use wishlist!', 'error'); navigate('/login'); return; }
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
        addToast('Removed from wishlist', 'success');
      } else {
        await api.post(`/wishlist/${id}`);
        setWishlisted(true);
        addToast('Added to wishlist! 💜', 'success');
      }
    } catch { addToast('Action failed', 'error'); }
  };

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: '65vh' }}>
      <div className="spinner" />
      <span style={{ color: '#8B7BA8', fontWeight: 500 }}>Loading product… ✨</span>
    </div>
  );
  if (!product) return null;

  const images = [product.imageUrl, ...(product.imageGallery || [])].filter(Boolean);
  const tabs = ['description', 'reviews', 'specifications'];

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-secondary"
        style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem', marginBottom: '2rem', width: 'auto' }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="product-detail-layout" style={{ marginBottom: '4rem' }}>

        {/* ── Left: Image Gallery ── */}
        <div>
          <div className="glass-container" style={{
            height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(205,180,255,0.15), rgba(255,200,221,0.12), rgba(189,224,254,0.15))',
            borderRadius: 28
          }}>
            {activeImage ? (
              <img src={activeImage} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1.5rem', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ fontSize: '6rem' }}>🛍️</div>
            )}

            {/* Wishlist FAB */}
            <button
              onClick={handleToggleWishlist}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 44, height: 44, borderRadius: '50%',
                background: wishlisted ? 'rgba(240,98,146,0.15)' : 'rgba(255,255,255,0.8)',
                border: `1.5px solid ${wishlisted ? 'rgba(240,98,146,0.4)' : 'rgba(205,180,255,0.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.25s ease'
              }}
            >
              <Heart size={18} fill={wishlisted ? '#F06292' : 'none'} color={wishlisted ? '#F06292' : '#A855F7'} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.25rem', overflowX: 'auto', padding: '0.25rem' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: 80, height: 80, borderRadius: 16,
                    border: `2px solid ${activeImage === img ? 'var(--accent)' : 'rgba(205,180,255,0.3)'}`,
                    padding: '0.4rem', background: 'white', cursor: 'pointer', flexShrink: 0,
                    transition: 'all 0.2s ease', transform: activeImage === img ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: Truck, label: 'Free Shipping', color: '#1A8F47' },
              { icon: RefreshCw, label: 'Free Returns', color: '#9333EA' },
              { icon: Shield, label: 'Secure Payment', color: '#C65D00' }
            ].map(b => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '999px',
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(205,180,255,0.3)',
                fontSize: '0.78rem', fontWeight: 600, color: b.color
              }}>
                <b.icon size={13} color={b.color} /> {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            {product.category && (
              <span className="badge badge-primary" style={{ marginBottom: '0.85rem' }}>
                <Tag size={10} /> {product.category}
              </span>
            )}
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2D1F5E', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '0.85rem' }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={17} 
                  fill={s <= Math.round(product.rating || 4) ? '#FFAB40' : 'none'} 
                  color={s <= Math.round(product.rating || 4) ? '#FFAB40' : '#D1C4E9'} 
                />
              ))}
              <span style={{ fontSize: '0.875rem', color: '#8B7BA8', marginLeft: '0.35rem' }}>
                {product.rating || '4.0'} ({product.reviewCount || '128'} reviews)
              </span>
            </div>
          </div>

          {/* Price card */}
          <div className="glass-container" style={{ padding: '1.35rem', background: 'linear-gradient(135deg, rgba(205,180,255,0.12), rgba(255,200,221,0.08))', borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8B7BA8', marginBottom: '0.25rem' }}>Price</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{product.price?.toFixed(2)}
                </p>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Free Shipping 🎁</span>
            </div>
          </div>

          {/* Status & Quantity */}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B7BA8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Order Details</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1.5px solid rgba(205,180,255,0.4)',
                borderRadius: '999px', overflow: 'hidden',
                background: 'rgba(255,255,255,0.7)'
              }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '0.6rem 1.1rem', background: 'transparent', color: '#9333EA', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(205,180,255,0.2)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  <Minus size={16} />
                </button>
                <span style={{ padding: '0.6rem 1.25rem', fontWeight: 800, minWidth: 52, textAlign: 'center', color: '#2D1F5E', fontSize: '1.05rem' }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: '0.6rem 1.1rem', background: 'transparent', color: '#9333EA', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(205,180,255,0.2)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  <Plus size={16} />
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#8B7BA8' }}>
                Inventory: <strong style={{ color: product.stock > 0 ? '#1A8F47' : '#F06292' }}>{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button id={`add-to-cart-${id}`} onClick={() => handleAddToCart(true)} disabled={adding || product.stock <= 0} className="btn-secondary" style={{ padding: '1rem', flex: 1, fontSize: '1rem', borderColor: 'var(--accent)' }}>
                <ShoppingCart size={20} /> {adding ? 'Adding…' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={buyingNow || product.stock <= 0} className="btn-primary" style={{ padding: '1rem', flex: 1, fontSize: '1rem' }}>
                <Zap size={20} /> {buyingNow ? 'Processing…' : 'Buy Now'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1.5px solid rgba(205,180,255,0.3)', marginBottom: '1.25rem' }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none', border: 'none', padding: '0.6rem 1rem',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    color: activeTab === tab ? '#9333EA' : '#8B7BA8',
                    borderBottom: `2.5px solid ${activeTab === tab ? '#A855F7' : 'transparent'}`,
                    marginBottom: '-1.5px', textTransform: 'capitalize', transition: 'all 0.2s ease'
                  }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ color: '#6B5B93', fontSize: '0.9rem', lineHeight: 1.75 }}>
              {activeTab === 'description' && (product.description || 'Premium quality product crafted with attention to detail and care.')}
              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[{ name: 'Sarah M.', rating: 5, text: 'Absolutely love this! Great quality and fast shipping.' },
                    { name: 'James K.', rating: 4, text: 'Really nice product. Would definitely recommend!' }].map((r, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(205,180,255,0.08)', borderRadius: 14, border: '1px solid rgba(205,180,255,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '0.875rem' }}>{r.name}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#FFAB40' : 'none'} color={s <= r.rating ? '#FFAB40' : '#D1C4E9'} />)}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem' }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'specifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[['Category', product.category || 'General'], ['Article ID', product.id || '--'], ['Status', 'Available'], ['Ship From', 'Silicon Valley']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(205,180,255,0.15)' }}>
                      <span style={{ fontWeight: 600, color: '#8B7BA8', fontSize: '0.85rem' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: '#2D1F5E', fontSize: '0.85rem' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1.5px solid rgba(205,180,255,0.2)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2D1F5E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             Recent Discovery
          </h2>
          <div className="product-grid">
            {recentlyViewed.map(p => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="product-image-wrapper" style={{ height: 160 }}>
                  <img className="product-img" src={p.imageUrl} alt={p.name} style={{ padding: '0.75rem' }} />
                </div>
                <div className="product-body" style={{ padding: '1rem' }}>
                  <p className="product-name" style={{ fontSize: '0.85rem' }}>{p.name}</p>
                  <p className="product-price" style={{ fontSize: '1rem' }}>₹{p.price?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
