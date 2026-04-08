import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, RefreshCcw, Truck, Mail, ChevronRight, Send, Loader2 } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const Support = () => {
    const { topic } = useParams();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [topic]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', formData);
            showToast('Message sent! We will get back to you soon.', 'success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 'faq', title: 'FAQ', icon: HelpCircle, color: '#A855F7' },
        { id: 'returns', title: 'Returns', icon: RefreshCcw, color: '#EC4899' },
        { id: 'shipping', title: 'Shipping', icon: Truck, color: '#3B82F6' },
        { id: 'contact-us', title: 'Contact Us', icon: Mail, color: '#10B981' },
    ];

    const renderContent = () => {
        switch (topic) {
            case 'faq':
                return (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <HelpCircle color="#A855F7" /> Frequently Asked Questions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { q: "How can I track my order?", a: "Once your order is shipped, you will receive an email with a tracking link. You can also track it in your 'Orders' section." },
                                { q: "What is your return policy?", a: "We offer a 30-day return policy for most items. Items must be in their original condition and packaging." },
                                { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries. Shipping costs and delivery times vary by location." },
                                { q: "How do I use a discount code?", a: "You can enter your discount code at the checkout page before proceeding to payment." }
                            ].map((item, i) => (
                                <div key={i} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                    <h4 style={{ color: '#2D1F5E', marginBottom: '0.5rem' }}>{item.q}</h4>
                                    <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'returns':
                return (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <RefreshCcw color="#EC4899" /> Returns & Exchanges
                        </h2>
                        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                            We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery.
                        </p>
                        <div style={{ background: '#fdfbff', padding: '1.5rem', borderRadius: '15px', border: '1px solid #e9d5ff' }}>
                            <h4 style={{ color: '#9333EA', marginBottom: '0.5rem' }}>Conditions for Returns:</h4>
                            <ul style={{ color: '#6B7280', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                                <li>Items must be unworn, unwashed, and in original condition.</li>
                                <li>All tags must be attached.</li>
                                <li>Proof of purchase is required.</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'shipping':
                return (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Truck color="#3B82F6" /> Shipping Information
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px' }}>
                                <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>Standard Shipping</h4>
                                <p style={{ fontSize: '0.85rem', color: '#075985' }}>5-7 Business Days<br />Free on orders over ₹1000</p>
                            </div>
                            <div style={{ background: '#fdf4ff', padding: '1rem', borderRadius: '12px' }}>
                                <h4 style={{ color: '#701a75', marginBottom: '0.5rem' }}>Express Shipping</h4>
                                <p style={{ fontSize: '0.85rem', color: '#86198f' }}>1-2 Business Days<br />₹150 flat rate</p>
                            </div>
                        </div>
                        <p style={{ marginTop: '1.5rem', color: '#6B7280', fontSize: '0.9rem' }}>
                            All orders are processed within 24 hours of being placed. You will receive a notification email once your order has been dispatched.
                        </p>
                    </div>
                );
            case 'contact-us':
                return (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Mail color="#10B981" /> Contact Support
                        </h2>
                        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="Your Name" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email"
                                        className="form-input" 
                                        placeholder="Email Address" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    placeholder="How can we help you?" 
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    style={{ resize: 'none' }}
                                />
                            </div>
                            <button className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                );
            default:
                return (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <h2 style={{ color: '#2D1F5E' }}>Select a topic from the sidebar</h2>
                        <p style={{ color: '#8B7BA8' }}>We're here to help you with any questions or concerns.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', background: 'linear-gradient(to bottom, #fdfbff, #ffffff)', minHeight: 'calc(100vh - 80px)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#2D1F5E' }}>Help Center</h3>
                    {sections.map(s => {
                        const Icon = s.icon;
                        const isActive = topic === s.id;
                        return (
                            <Link 
                                key={s.id} 
                                to={`/support/${s.id}`}
                                className="glass-card"
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1rem', 
                                    padding: '1rem', 
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    border: isActive ? `1px solid ${s.color}` : '1px solid transparent',
                                    background: isActive ? `${s.color}08` : 'rgba(255, 255, 255, 0.6)'
                                }}
                            >
                                <div style={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: 12, 
                                    background: `${s.color}15`, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <Icon size={20} color={s.color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#2D1F5E', fontSize: '0.95rem' }}>{s.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#8B7BA8' }}>Learn more about {s.title.toLowerCase()}</div>
                                </div>
                                <ChevronRight size={16} color="#B0A0CC" />
                            </Link>
                        );
                    })}
                </aside>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Support;
