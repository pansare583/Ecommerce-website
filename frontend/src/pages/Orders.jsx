import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { ShoppingBag, Package, Clock, ChevronRight, CircleCheck, AlertCircle, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const statusConfig = {
  CREATED:    { label: 'Order Placed', color: '#9333EA', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)', icon: Package, emoji: '📦' },
  PROCESSING: { label: 'Processing',   color: '#C65D00', bg: 'rgba(255,171,64,0.1)', border: 'rgba(255,171,64,0.25)', icon: Clock,    emoji: '⏳' },
  SHIPPED:    { label: 'Shipped',       color: '#1565C0', bg: 'rgba(189,224,254,0.2)', border: 'rgba(189,224,254,0.4)', icon: ChevronRight, emoji: '🚚' },
  DELIVERED:  { label: 'Delivered',     color: '#1A8F47', bg: 'rgba(72,199,116,0.1)',  border: 'rgba(72,199,116,0.25)', icon: CircleCheck, emoji: '✅' },
  PAID:       { label: 'Paid',          color: '#1A8F47', bg: 'rgba(72,199,116,0.1)',  border: 'rgba(72,199,116,0.25)', icon: Check,   emoji: '💳' },
  CANCELLED:  { label: 'Cancelled',     color: '#C62828', bg: 'rgba(240,98,146,0.1)',  border: 'rgba(240,98,146,0.25)', icon: AlertCircle, emoji: '❌' },
};

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [user]); // eslint-disable-line react-hooks/set-state-in-effect

  if (!user) return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '72vh' }}>
      <div className="glass-container empty-state" style={{ maxWidth: 440 }}>
        <div className="empty-state-icon"><ShoppingBag size={56} /></div>
        <h3>Sign in to view orders</h3>
        <p>Your order history will appear here after login.</p>
        <Link to="/login" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.75rem' }}>Login</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">📦 My Orders</h1>
          {!loading && <p className="page-subtitle">{orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}</p>}
        </div>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem', width: 'auto' }}>
          <ArrowLeft size={15} /> Continue Shopping
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /><span style={{ color: '#8B7BA8' }}>Loading orders…</span></div>
      ) : orders.length === 0 ? (
        <div className="glass-container empty-state">
          <div className="empty-state-icon"><Package size={56} /></div>
          <h3>No orders yet 🌸</h3>
          <p>Once you place an order, it'll appear here with live status tracking!</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: 'auto', padding: '0.85rem 2rem' }}>
            <Sparkles size={17} /> Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.CREATED;
            const Icon = cfg.icon;
            const isExp = expanded === order.id;

            return (
              <div key={order.id} className="glass-container" style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}>
                {/* Order Header */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.35rem 1.6rem', cursor: 'pointer' }}
                  onClick={() => setExpanded(isExp ? null : order.id)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 16,
                      background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: '1.25rem'
                    }}>
                      {cfg.emoji}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#2D1F5E' }}>Order #{order.id}</h4>
                        <span className="badge" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, fontSize: '0.68rem' }}>
                          {cfg.label}
                        </span>
                      </div>
                      {order.createdAt && (
                        <p style={{ fontSize: '0.8rem', color: '#8B7BA8', marginTop: '0.2rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 900, fontSize: '1.15rem', background: 'linear-gradient(135deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#8B7BA8' }}>Total amount</p>
                    </div>
                    <div style={{ color: '#8B7BA8', transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.25s ease' }}>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>

                {/* Expanded Items */}
                {isExp && order.items?.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(205,180,255,0.2)', background: 'rgba(245,240,255,0.25)', padding: '1.1rem 1.6rem' }}>
                    <div className="section-label" style={{ marginBottom: '0.85rem' }}>Order Items</div>
                    {order.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.75rem 0',
                        borderBottom: i < order.items.length - 1 ? '1px solid rgba(205,180,255,0.15)' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'linear-gradient(135deg, rgba(205,180,255,0.2), rgba(255,200,221,0.2))',
                            border: '1px solid rgba(205,180,255,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                          }}>🛍️</div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2D1F5E' }}>{item.productName}</p>
                            <p style={{ fontSize: '0.75rem', color: '#8B7BA8' }}>Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#9333EA' }}>
                          ₹{item.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
