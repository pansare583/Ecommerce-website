import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import {
  ShoppingCart, Sparkles, Package, Search, Star, ArrowRight, Heart, Zap, TrendingUp, Shield, Truck, ChevronDown, Filter
} from 'lucide-react';

/* ── Floating decorative blob ── */
const Blob = ({ style }) => (
  <div className="hero-blob" style={style} />
);

/* ── Stat card ── */
const StatCard = ({ value, label, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: color || '#2D1F5E', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#8B7BA8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.35rem' }}>{label}</div>
  </div>
);

/* ── Feature badge ── */
const FeatureBadge = ({ icon: Icon, label, color }) => ( // eslint-disable-line no-unused-vars
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.65rem 1.1rem',
    background: 'rgba(255,255,255,0.7)',
    border: '1.5px solid rgba(205,180,255,0.3)',
    borderRadius: '999px',
    fontSize: '0.82rem', fontWeight: 600, color: color || '#6B5B93',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 12px rgba(168,85,247,0.08)'
  }}>
    <Icon size={14} color={color || '#A855F7'} />{label}
  </div>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [addingIds, setAddingIds] = useState(new Set());
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Search Logic from URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';

  useEffect(() => {
    if (user) {
      api.get('/wishlist').then(r => setWishlistIds(new Set(r.data.map(p => p.id)))).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(() => addToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  // Handle auto-scroll on search
  useEffect(() => {
    if (searchTerm) {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchTerm]);

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!user) { addToast('Please login to use wishlist!', 'error'); navigate('/login'); return; }
    const isWishlisted = wishlistIds.has(productId);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
        setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
        addToast('Removed from wishlist', 'success');
      } else {
        await api.post(`/wishlist/${productId}`);
        setWishlistIds(prev => new Set(prev).add(productId));
        addToast('Added to wishlist! 💜', 'success');
      }
    } catch { addToast('Action failed', 'error'); }
  };

  const handleAddToCart = async (e, productId, productName) => {
    e.stopPropagation();
    if (!user) { addToast('Please login first!', 'error'); navigate('/login'); return; }
    setAddingIds(prev => new Set(prev).add(productId));
    try {
      await api.post(`/cart/add?productId=${productId}&quantity=1`);
      addToast(`"${productName}" added to cart! 🛒`, 'success');
    } catch { addToast('Failed to add to cart', 'error'); }
    finally { setAddingIds(prev => { const n = new Set(prev); n.delete(productId); return n; }); }
  };

  const handleBuyNow = async (e, productId) => {
    e.stopPropagation();
    if (!user) { addToast('Please login first!', 'error'); navigate('/login'); return; }
    try {
      const res = await api.post(`/cart/add?productId=${productId}&quantity=1`);
      const cartItemId = res.data.id;
      navigate('/checkout', { state: { selectedItemIds: [cartItemId] } });
    } catch { addToast('Action failed', 'error'); }
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Shoes', 'Accessories'];

  const filteredAndSorted = products
    .filter(p => {
      const matchesSearch = !searchTerm || 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Best Rated') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'Newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero-section">
        {/* Blobs */}
        <Blob style={{ width: 500, height: 500, background: 'rgba(205,180,255,0.35)', top: '-150px', left: '-100px' }} />
        <Blob style={{ width: 400, height: 400, background: 'rgba(255,200,221,0.3)', top: '-50px', right: '-80px', animationDelay: '1s' }} />
        <Blob style={{ width: 300, height: 300, background: 'rgba(189,224,254,0.28)', bottom: '-80px', left: '30%', animation: 'floatReverse 7s ease-in-out infinite' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-tag">
            <Sparkles size={13} /> New Season Drop ✨
          </div>

          <h1 className="hero-title">
            Discover Your<br />
            Perfect Style 🌸
          </h1>

          <p className="hero-subtitle">
            Shop the latest in fashion, accessories & lifestyle — curated with love for those who dare to be different.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="#products" className="btn-primary" style={{ width: 'auto', padding: '0.9rem 2.25rem', fontSize: '1rem' }}>
              <Zap size={18} /> Shop Now
            </a>
            {!user && (
              <button onClick={() => navigate('/register')} className="btn-secondary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem' }}>
                Join Free <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Feature badges */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <FeatureBadge icon={Truck} label="Free Shipping" color="#1A8F47" />
            <FeatureBadge icon={Shield} label="Secure Payment" color="#9333EA" />
            <FeatureBadge icon={TrendingUp} label="New Arrivals Daily" color="#C65D00" />
          </div>

          {/* Stats */}
          <div style={{
            display: 'inline-flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center',
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(205,180,255,0.3)', borderRadius: '24px',
            padding: '1.5rem 2.5rem',
            boxShadow: '0 8px 32px rgba(168,85,247,0.1)'
          }}>
            <StatCard value={products.length || '100+'} label="Products" color="#9333EA" />
            <div style={{ width: 1, background: 'rgba(205,180,255,0.4)', alignSelf: 'stretch' }} />
            <StatCard value="5K+" label="Happy Customers" color="#EC4899" />
            <div style={{ width: 1, background: 'rgba(205,180,255,0.4)', alignSelf: 'stretch' }} />
            <StatCard value="4.9★" label="Avg Rating" color="#C65D00" />
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <div className="page-container" id="products">

        {/* Search Display + Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2D1F5E' }}>
              {searchTerm ? `Results for "${searchTerm}"` : 'Collections'}
            </h2>
            <p style={{ color: '#8B7BA8', fontSize: '0.9rem' }}>Exploring {selectedCategory} products</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Category Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.5)', padding: '0.35rem', borderRadius: '999px', border: '1.5px solid rgba(205,180,255,0.2)' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
                    background: selectedCategory === cat ? 'var(--accent)' : 'transparent',
                    color: selectedCategory === cat ? 'white' : '#8B7BA8',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                className="form-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  paddingRight: '2.5rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
                  width: '200px', cursor: 'pointer', background: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(205,180,255,0.3)'
                }}
              >
                {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#A855F7' }} />
            </div>
          </div>
        </div>

        <div className="section-label" style={{ marginBottom: '1.75rem' }}>
          <Package size={14} />
          {loading ? 'Searching...' : `${filteredAndSorted.length} Items Found`}
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
            <span style={{ color: '#8B7BA8', fontWeight: 500 }}>Curating collections… ✨</span>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="glass-container empty-state">
            <div className="empty-state-icon"><ShoppingCart size={56} /></div>
            <h3>No matches found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button onClick={() => { setSelectedCategory('All'); navigate('/'); }} className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredAndSorted.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>

                {/* Image Area */}
                <div className="product-image-wrapper">
                  {product.imageUrl ? (
                    <img className="product-img" src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div style={{ fontSize: '3.5rem' }}>🛍️</div>
                  )}

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span className="badge badge-success"><Filter size={9} /> {product.category || 'New'}</span>
                    {product.stock <= 5 && <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>Low Stock</span>}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={e => handleToggleWishlist(e, product.id)}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 36, height: 36, borderRadius: '50%',
                      background: wishlistIds.has(product.id) ? 'rgba(240,98,146,0.15)' : 'rgba(255,255,255,0.8)',
                      border: `1.5px solid ${wishlistIds.has(product.id) ? 'rgba(240,98,146,0.4)' : 'rgba(205,180,255,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(8px)', transition: 'all 0.2s ease', cursor: 'pointer'
                    }}
                  >
                    <Heart size={16} fill={wishlistIds.has(product.id) ? '#F06292' : 'none'} color={wishlistIds.has(product.id) ? '#F06292' : '#A855F7'} />
                  </button>
                </div>

                {/* Body */}
                <div className="product-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <p className="product-name">{product.name}</p>
                    <p className="product-price" style={{ whiteSpace: 'nowrap' }}>₹{product.price?.toFixed(2)}</p>
                  </div>
                  
                  {/* Stars & Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11} 
                          fill={s <= Math.round(product.rating || 4) ? '#FFAB40' : 'none'} 
                          color={s <= Math.round(product.rating || 4) ? '#FFAB40' : '#D1C4E9'} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#8B7BA8' }}>
                      {product.rating?.toFixed(1) || '4.0'} ({product.reviewCount || '120'} reviews)
                    </span>
                  </div>

                  <p className="product-desc">
                    {product.description || 'Premium quality product curated for you.'}
                  </p>
                </div>

                {/* Footer */}
                <div className="product-footer" style={{ borderTop: 'none', background: 'transparent', paddingTop: '0' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button
                      onClick={e => handleAddToCart(e, product.id, product.name)}
                      className="btn-secondary"
                      disabled={addingIds.has(product.id)}
                      style={{ flex: 1, padding: '0.65rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--accent)' }}
                    >
                      <ShoppingCart size={13} />
                      {addingIds.has(product.id) ? 'Wait…' : 'To Cart'}
                    </button>
                    <button
                      onClick={e => handleBuyNow(e, product.id)}
                      className="btn-primary"
                      style={{ flex: 1.2, padding: '0.65rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <Zap size={13} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
