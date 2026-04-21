import React, { useState } from 'react';
import { Sparkles, Mail, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      showToast(res.data.message, 'success');
      setEmail('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #A855F7, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(135deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Trendify
              </span>
            </div>
            <p style={{ color: '#8B7BA8', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Curating premium fashion & lifestyle products tailored for the modern trendsetter.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#2D1F5E', fontSize: '0.9rem' }}>Quick Links</h4>
            {['Shop', 'Wishlist', 'Orders', 'Profile'].map(l => (
              <div key={l} style={{ marginBottom: '0.5rem' }}>
                <Link to={l === 'Shop' ? '/' : `/${l.toLowerCase()}`} style={{ color: '#8B7BA8', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#A855F7'}
                  onMouseLeave={e => e.target.style.color = '#8B7BA8'}>
                  {l}
                </Link>
              </div>
            ))}
          </div>
          {/* Support */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#2D1F5E', fontSize: '0.9rem' }}>Support</h4>
            {['FAQ', 'Returns', 'Shipping', 'Contact Us'].map(l => (
              <div key={l} style={{ marginBottom: '0.5rem' }}>
                <Link to={`/support/${l.toLowerCase().replace(' ', '-')}`} style={{ color: '#8B7BA8', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#A855F7'}
                  onMouseLeave={e => e.target.style.color = '#8B7BA8'}>
                  {l}
                </Link>
              </div>
            ))}
          </div>
          {/* Newsletter */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#2D1F5E', fontSize: '0.9rem' }}>Newsletter</h4>
            <p style={{ color: '#8B7BA8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Get exclusive deals & new arrivals straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div style={{ position: 'relative', flex: 1 }}>
                <Mail size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#A855F7' }} />
                <input 
                  type="email"
                  className="form-input" 
                  placeholder="Your email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem 0.9rem 0.6rem 2.2rem' }} 
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.8rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        <div className="divider" />
        <p style={{ textAlign: 'center', color: '#B0A0CC', fontSize: '0.8rem' }}>
          © 2025 Trendify. Made with 💜 for fashion lovers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
