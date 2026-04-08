import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Truck, ShoppingBag, ArrowRight, Sparkles, Package } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '82vh' }}>
      <div className="glass-container success-card" style={{ 
        maxWidth: 580, width: '100%', padding: '3.5rem 2.5rem', 
        textAlign: 'center', position: 'relative', overflow: 'hidden' 
      }}>
        {/* Floating Blobs for aesthetics */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 120, height: 120, background: 'rgba(168,85,247,0.1)', borderRadius: '50%', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 150, height: 150, background: 'rgba(236,72,153,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: 88, height: 88, borderRadius: '50%', background: 'rgba(72,199,116,0.15)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            border: '2px solid rgba(72,199,116,0.3)', position: 'relative'
          }}>
            <CheckCircle size={44} color="#1A8F47" style={{ animation: 'scaleUp 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)' }} />
            <div style={{ position: 'absolute', top: -10, right: -10 }}>
              <Sparkles size={24} color="#FFD700" />
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#2D1F5E', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Order Confirmed! 🌸
        </h1>
        <p style={{ color: '#6B5B93', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Thank you for your purchase. Your style discovery is now processing and will be arriving at your doorstep soon.
        </p>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', 
          marginBottom: '3rem', padding: '1.5rem', background: 'rgba(205,180,255,0.1)', 
          borderRadius: 24, border: '1.5px solid rgba(205,180,255,0.2)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}><ShieldCheck size={20} color="#9333EA" /></div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D1F5E', textTransform: 'uppercase' }}>Verified</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}><Truck size={20} color="#9333EA" /></div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D1F5E', textTransform: 'uppercase' }}>Shipping</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}><ShoppingBag size={20} color="#9333EA" /></div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D1F5E', textTransform: 'uppercase' }}>Confirmed</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/orders')} className="btn-primary" style={{ width: 'auto', padding: '0.85rem 1.75rem' }}>
            Track Your Order <Package size={16} />
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: 'auto', padding: '0.85rem 1.75rem' }}>
            Continue Shopping <ArrowRight size={16} />
          </button>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#B0A0CC' }}>
          A confirmation email with the full receipt and tracking link has been sent to your inbox.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
