import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { CreditCard, ShieldCheck, MapPin, Phone, Sparkles, CheckCircle, Tag, Truck, Calendar, Lock, Edit2, Save, X } from 'lucide-react';

const Checkout = () => {
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  const discountPercent = location.state?.discount || 0;
  const selectedItemIds = location.state?.selectedItemIds || [];

  const fetchData = async () => {
    try {
      const [profileRes, cartRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/cart')
      ]);
      setProfile(profileRes.data);
      setEditProfile(profileRes.data);
      let cartData = cartRes.data;
      if (selectedItemIds.length > 0) {
        cartData.items = cartData.items.filter(item => selectedItemIds.includes(item.id));
      }
      setCart(cartData);
      if (!cartData.items?.length) navigate('/cart');
    } catch (e) {
      addToast('Session expired. Please log in.', 'error');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 4) input = input.slice(0, 4);
    let formatted = input.length >= 3 ? `${input.slice(0, 2)}/${input.slice(2)}` : input;
    setCardData({...cardData, expiry: formatted});
  };

  const handleSaveAddress = async () => {
    try {
      await api.put('/users/profile', editProfile);
      setProfile(editProfile);
      setIsEditingAddress(false);
      addToast('Address Updated Successfully! ✨', 'success');
    } catch {
      addToast('Failed to update address. Please check your data.', 'error');
    }
  };

  const validateCard = () => {
    const newErrors = {};
    if (cardData.number.length !== 12) newErrors.number = '12 digits required';
    if (cardData.expiry.length !== 5) newErrors.expiry = 'MM/YY required';
    if (cardData.cvc.length !== 3) newErrors.cvc = '3 digits required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderCompletion = async (method) => {
    if (method === 'CARD' && !validateCard()) return;
    setProcessing(true);
    try {
      if (method === 'CARD') await new Promise(r => setTimeout(r, 1500));
      await api.post('/orders/checkout', { paymentMethod: method, cartItemIds: selectedItemIds });
      addToast(`Order Confirmed! Check your email. 🌸`, 'success');
      navigate('/order-success');
    } catch {
      addToast('Checkout Failed. Check your address first.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: '80vh' }}>
      <div className="spinner" /><span style={{ color: '#8B7BA8' }}>Preparing secure checkout…</span>
    </div>
  );

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.totalPrice || 0), 0) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">💳 Final Checkout</h1>
        <p className="page-subtitle">Every delivery is prioritized with care and speed</p>
      </div>

      <div className="checkout-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Address Card */}
          <div className="glass-container" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={17} color="#9333EA" />
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2D1F5E' }}>Ship To</h3>
              </div>
              {!isEditingAddress ? (
                <button onClick={() => setIsEditingAddress(true)} style={{ background: 'none', border: 'none', color: '#A855F7', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <Edit2 size={13} /> Change Address
                </button>
              ) : (
                <button onClick={() => setIsEditingAddress(false)} style={{ background: 'none', border: 'none', color: '#F06292', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <X size={13} /> Cancel Edit
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(205,180,255,0.08)', padding: '1.25rem', borderRadius: 16 }}>
                <input className="form-input" placeholder="Full Name" value={editProfile.fullName} onChange={e => setEditProfile({...editProfile, fullName: e.target.value})} />
                <input className="form-input" placeholder="Stress/House No." value={editProfile.address} onChange={e => setEditProfile({...editProfile, address: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input className="form-input" placeholder="City" value={editProfile.city} onChange={e => setEditProfile({...editProfile, city: e.target.value})} />
                  <input className="form-input" placeholder="State/PIN" value={editProfile.state} onChange={e => setEditProfile({...editProfile, state: e.target.value})} />
                </div>
                <input className="form-input" placeholder="Mobile Number" value={editProfile.phoneNumber} onChange={e => setEditProfile({...editProfile, phoneNumber: e.target.value})} />
                <button onClick={handleSaveAddress} className="btn-primary" style={{ height: 'auto', padding: '0.75rem' }}>
                  <Save size={15} /> Save & Apply Address
                </button>
              </div>
            ) : (
              <div style={{ padding: '0.5rem 0' }}>
                {profile?.address ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <p style={{ fontWeight: 800, color: '#2D1F5E', fontSize: '1.05rem' }}>{profile.fullName}</p>
                    <p style={{ color: '#6B5B93', fontSize: '0.9rem' }}>{profile.address}, {profile.city}</p>
                    <p style={{ color: '#6B5B93', fontSize: '0.85rem' }}>{profile.state} - {profile.zipCode}</p>
                    <span style={{ color: '#8B7BA8', fontSize: '0.85rem', marginTop: '0.4rem' }}>📞 {profile.phoneNumber}</span>
                  </div>
                ) : (
                  <div className="alert alert-warning" style={{ margin: 0 }}>No shipping address found. Click "Change" to add.</div>
                )}
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="glass-container" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <CreditCard size={17} color="#9333EA" /><h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#2D1F5E' }}>Payment Selection</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
              <div onClick={() => setPaymentMethod('CARD')} style={{ cursor: 'pointer', padding: '1.15rem', borderRadius: '18px', border: '2.5px solid', background: paymentMethod === 'CARD' ? 'rgba(168,85,247,0.1)' : 'white', borderColor: paymentMethod === 'CARD' ? '#A855F7' : 'rgba(168,85,247,0.1)', transition: '0.2s' }}>
                <CreditCard size={20} color={paymentMethod === 'CARD' ? '#A855F7' : '#8B7BA8'} />
                <p style={{ marginTop: '0.65rem', fontWeight: 800, color: '#2D1F5E', fontSize: '0.92rem' }}>Online Pay</p>
                <p style={{ fontSize: '0.7rem', color: '#8B7BA8' }}>Demo-friendly card processing</p>
              </div>
              <div onClick={() => setPaymentMethod('COD')} style={{ cursor: 'pointer', padding: '1.15rem', borderRadius: '18px', border: '2.5px solid', background: paymentMethod === 'COD' ? 'rgba(168,85,247,0.1)' : 'white', borderColor: paymentMethod === 'COD' ? '#A855F7' : 'rgba(168,85,247,0.1)', transition: '0.2s' }}>
                <Truck size={20} color={paymentMethod === 'COD' ? '#A855F7' : '#8B7BA8'} />
                <p style={{ marginTop: '0.65rem', fontWeight: 800, color: '#2D1F5E', fontSize: '0.92rem' }}>Cash on Door</p>
                <p style={{ fontSize: '0.7rem', color: '#8B7BA8' }}>₹{finalTotal.toFixed(0)} at doorstep</p>
              </div>
            </div>

            {paymentMethod === 'CARD' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <input placeholder="12-digit card number" className={`form-input ${errors.number ? 'input-error' : ''}`} style={{ paddingLeft: '3.1rem' }} maxLength="12" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g, '')})} />
                  <CreditCard size={18} color="#B0A0CC" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ position: 'relative' }}>
                    <input placeholder="MM/YY" className={`form-input ${errors.expiry ? 'input-error' : ''}`} style={{ paddingLeft: '3.1rem' }} maxLength="5" value={cardData.expiry} onChange={handleExpiryChange} />
                    <Calendar size={18} color="#B0A0CC" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                   <div style={{ position: 'relative' }}>
                    <input placeholder="CVC" className={`form-input ${errors.cvc ? 'input-error' : ''}`} style={{ paddingLeft: '3.1rem' }} type="password" maxLength="3" value={cardData.cvc} onChange={e => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})} />
                    <Lock size={18} color="#B0A0CC" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
                <button onClick={() => handleOrderCompletion('CARD')} disabled={processing || !profile?.address || isEditingAddress} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                  {processing ? '⚡ Encrypting Transaction…' : `Securely Pay ₹${finalTotal.toFixed(0)}`}
                </button>
              </div>
            ) : (
              <button onClick={() => handleOrderCompletion('COD')} disabled={processing || !profile?.address || isEditingAddress} className="btn-primary">
                {processing ? 'Processing order…' : '✅ Place Cash on Delivery Order'}
              </button>
            )}
          </div>
        </div>

        {/* Summary side */}
        <div className="glass-container" style={{ padding: '1.75rem', height: 'fit-content', position: 'sticky', top: 88 }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2D1F5E', marginBottom: '1.5rem' }}>Receipt Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {cart?.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6B5B93', fontWeight: 600 }}>{item.quantity}x {item.productName}</span>
                <span style={{ fontWeight: 800, color: '#2D1F5E' }}>₹{item.totalPrice.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: '1.25rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B7BA8', fontSize: '0.9rem', marginBottom: '0.65rem' }}>
            <span>Item Subtotal</span><span>₹{subtotal.toFixed(0)}</span>
          </div>
          {discountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F06292', fontSize: '0.9rem', marginBottom: '0.65rem', fontWeight: 700 }}>
              <span>Saved via Coupon</span><span>-₹{discountAmount.toFixed(0)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1A8F47', fontSize: '0.9rem', fontWeight: 700 }}>
             <span>Express Delivery</span><span>FREE</span>
          </div>
          <div className="divider" style={{ margin: '1.25rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: '#2D1F5E', fontSize: '1.05rem' }}>Final Bill</span>
            <span style={{ fontWeight: 900, fontSize: '1.75rem', color: '#9333EA' }}>₹{finalTotal.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
