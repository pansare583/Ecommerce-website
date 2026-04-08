import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Save, Sparkles, Package, LogOut, Settings, Clock, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const sidebarLinks = [
  { icon: User, label: 'Profile', path: '/profile', active: true },
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: Settings, label: 'Wishlist', path: '/wishlist' },
];

const InputField = ({ label, icon: Icon, name, type = 'text', value, onChange, placeholder }) => (
  <div className="form-group">
    <label className="form-label inline-icon"><Icon size={13} /> {label}</label>
    <input type={type} name={name} value={value || ''} onChange={onChange}
      className="form-input" placeholder={placeholder || label} />
  </div>
);

const Profile = () => {
  const [profile, setProfile] = useState({ fullName: '', email: '', phoneNumber: '', address: '', city: '', state: '', zipCode: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/orders')
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data || []);
      } catch (e) {
        addToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      await api.put('/users/profile', profile);
      addToast('Profile updated successfully! 🎉', 'success');
    } catch { 
      addToast('Failed to update profile', 'error'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: '70vh' }}>
      <div className="spinner" />
      <span style={{ color: '#8B7BA8', fontWeight: 500 }}>Unpacking your profile… ✨</span>
    </div>
  );

  return (
    <div className="page-container">
      <div className="profile-layout">

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Profile Card */}
          <div className="glass-container" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #CDB4FF, #FFC8DD)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', boxShadow: '0 8px 28px rgba(168,85,247,0.25)'
            }}>
              <User size={36} color="#7C3AED" />
            </div>
            <h3 style={{ fontWeight: 800, color: '#2D1F5E', marginBottom: '0.25rem' }}>
              {profile.fullName || 'Member'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#8B7BA8' }}>{profile.email}</p>
            <span className="badge badge-primary" style={{ marginTop: '0.75rem' }}>
              <Sparkles size={10} /> Certified Shopper
            </span>
          </div>

          {/* Sidebar Nav */}
          <div className="glass-container" style={{ overflow: 'hidden' }}>
            {sidebarLinks.map((item, i) => (
              <Link key={i} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '1rem 1.35rem',
                borderBottom: i < sidebarLinks.length - 1 ? '1px solid rgba(205,180,255,0.2)' : 'none',
                color: item.active ? '#9333EA' : '#6B5B93', fontWeight: item.active ? 700 : 500,
                fontSize: '0.9rem', background: item.active ? 'rgba(205,180,255,0.12)' : 'transparent',
                transition: 'all 0.2s ease', textDecoration: 'none'
              }}
              >
                <item.icon size={17} color={item.active ? '#A855F7' : '#8B7BA8'} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 className="page-title">Personal Dashboard</h1>
            <p className="page-subtitle">Refine your identity and track your style journey</p>
          </div>

          {/* Edit Profile Form */}
          <div className="glass-container" style={{ padding: '2rem' }}>
            <form onSubmit={handleSave}>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>
                <User size={13} /> Identity Details
              </div>
              <div className="form-grid-2">
                <InputField label="Full Name" icon={User} name="fullName" value={profile.fullName} onChange={handleChange} placeholder="First & Last Name" />
                <InputField label="Email Address" icon={Mail} name="email" type="email" value={profile.email} onChange={handleChange} placeholder="email@example.com" />
              </div>
              <InputField label="Phone Number" icon={Phone} name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} placeholder="+1 (000) 000-0000" />

              <div className="divider" />

              <div className="section-label" style={{ marginBottom: '1.25rem' }}>
                <MapPin size={13} /> Shipping destination
              </div>
              <InputField label="Address Line" icon={MapPin} name="address" value={profile.address} onChange={handleChange} placeholder="123 Pastel Street" />
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" value={profile.city || ''} onChange={handleChange} className="form-input" placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input type="text" name="state" value={profile.state || ''} onChange={handleChange} className="form-input" placeholder="State" />
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input type="text" name="zipCode" value={profile.zipCode || ''} onChange={handleChange} className="form-input" placeholder="00000" />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem', width: 'auto', padding: '0.85rem 2rem' }}>
                {saving ? 'Saving changes…' : <><Save size={17} /> Save Profile</>}
              </button>
            </form>
          </div>

          {/* Recent Orders Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2D1F5E', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#A855F7" /> Recent Orders
              </h2>
              <Link to="/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9333EA', textDecoration: 'none' }}>View All →</Link>
            </div>

            {orders.length === 0 ? (
              <div className="glass-container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#8B7BA8', fontSize: '0.9rem' }}>No orders yet. Treat yourself to something new!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="glass-container" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/orders')}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                       <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Package size={20} color="#A855F7" />
                       </div>
                       <div>
                         <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2D1F5E' }}>Order #{order.id}</p>
                         <p style={{ fontSize: '0.75rem', color: '#8B7BA8' }}>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <div>
                         <p style={{ fontWeight: 800, color: '#9333EA', fontSize: '1rem' }}>${order.totalAmount?.toFixed(2)}</p>
                         <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.6rem' }}>{order.status}</span>
                       </div>
                       <ChevronRight size={18} color="#D1C4E9" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
