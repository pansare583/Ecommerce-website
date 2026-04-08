import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { Trash2, ShoppingBag, CreditCard, ShoppingCart, ArrowLeft, Package, Sparkles, Tag, X, Info, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try { 
      const r = await api.get('/cart'); 
      setCart(r.data);
      // Initialize selected IDs with all items on first load
      if (!cart) {
        const ids = new Set(r.data.items.map(item => item.id));
        setSelectedIds(ids);
      }
    }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchCart(); else setLoading(false); }, [user, fetchCart]);

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === cart?.items?.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(cart.items.map(item => item.id)));
  };

  const handleRemove = async (cartItemId, productName) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      addToast(`"${productName}" removed`, 'success');
      fetchCart();
    } catch { addToast('Failed to remove item', 'error'); }
    finally { setLoading(false); }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const r = await api.get(`/coupons/validate/${couponCode}`);
      if (r.data.valid) {
        setDiscount(r.data.discount);
        addToast(`Coupon applied! ${r.data.discount}% off ✨`, 'success');
      } else {
        addToast(r.data.message || 'Invalid coupon', 'error');
        setDiscount(0);
      }
    } catch { addToast('Coupon validation failed', 'error'); }
  };

  if (!user) return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '72vh' }}>
      <div className="glass-container empty-state" style={{ maxWidth: 440, width: '100%' }}>
        <div className="empty-state-icon"><ShoppingCart size={60} /></div>
        <h3>Sign in to view your cart</h3>
        <p>Your saved items are waiting for you!</p>
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.75rem' }}>Login</Link>
          <Link to="/register" className="btn-secondary" style={{ padding: '0.75rem 1.75rem' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );

  const selectedItems = cart?.items?.filter(item => selectedIds.has(item.id)) || [];
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">🛒 Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <p className="page-subtitle">{cart.items.length} items total • {selectedIds.size} selected for purchase</p>
          )}
        </div>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: 'auto', fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Shop More
        </button>
      </div>

      {!cart?.items?.length && !loading ? (
        <div className="glass-container empty-state">
          <div className="empty-state-icon"><ShoppingBag size={60} /></div>
          <h3>Your cart is empty</h3>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: 'auto' }}>Start Shopping</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
              <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333EA', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                {selectedIds.size === cart?.items?.length ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                {selectedIds.size === cart?.items?.length ? 'Deselect All' : 'Select All Items'}
              </button>
            </div>

            <div className="glass-container">
              {cart?.items?.map((item, idx) => (
                <div key={item.id} style={{
                  display: 'flex', gap: '1rem', padding: '1.5rem',
                  alignItems: 'center',
                  borderBottom: idx < cart.items.length - 1 ? '1px solid rgba(205,180,255,0.15)' : 'none',
                  background: selectedIds.has(item.id) ? 'rgba(168,85,247,0.03)' : 'transparent'
                }}>
                  <button onClick={() => toggleSelect(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedIds.has(item.id) ? '#9333EA' : '#B0A0CC' }}>
                    {selectedIds.has(item.id) ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>

                  <div style={{ width: 80, height: 80, borderRadius: 12, background: '#F5F0FF', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(205,180,255,0.2)' }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '1rem', marginBottom: '0.2rem' }}>{item.productName}</h4>
                    <p style={{ color: '#8B7BA8', fontSize: '0.8rem' }}>₹{(item.totalPrice / item.quantity).toFixed(0)} per unit</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <span className="badge badge-primary">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, color: '#9333EA', fontSize: '1.1rem', marginBottom: '0.5rem' }}>₹{item.totalPrice.toFixed(0)}</p>
                    <button onClick={() => handleRemove(item.id, item.productName)} className="btn-icon-text" style={{ color: '#F06292', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-container" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}><Tag size={16} color="#A855F7" /><h4 style={{ fontWeight: 700, color: '#2D1F5E' }}>Promotion</h4></div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="form-input" placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)} style={{ fontSize: '0.85rem' }} />
                <button onClick={handleApplyCoupon} className="btn-secondary" style={{ width: 'auto', fontSize: '0.8rem' }}>Apply</button>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '1.75rem', position: 'sticky', top: 90 }}>
              <h3 style={{ fontWeight: 800, color: '#2D1F5E', marginBottom: '1.5rem' }}>Cart Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B7BA8' }}><span>Subtotal ({selectedIds.size} items)</span><span>₹{subtotal.toFixed(0)}</span></div>
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F06292', fontWeight: 700 }}><span>Discount</span><span>-₹{discountAmount.toFixed(0)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1A8F47', fontWeight: 700 }}><span>Delivery</span><span>FREE</span></div>
              </div>
              <div className="divider" style={{ margin: '1.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 800, color: '#2D1F5E' }}>Total Amount</span>
                <span style={{ fontWeight: 900, fontSize: '1.75rem', color: '#9333EA' }}>₹{finalTotal.toFixed(0)}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout', { state: { discount, selectedItemIds: Array.from(selectedIds) } })} 
                disabled={selectedIds.size === 0}
                className="btn-primary"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
