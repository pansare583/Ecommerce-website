import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LayoutDashboard, LogOut, User, Sparkles, Menu, X, Heart, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 24px rgba(168,85,247,0.12)' : '0 2px 12px rgba(168,85,247,0.06)' }}>
      <div className="navbar-container">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'linear-gradient(135deg, #A855F7, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(168,85,247,0.4)', flexShrink: 0
          }}>
            <Sparkles size={18} color="white" strokeWidth={2.5} />
          </div>
          <span>Trendify</span>
        </Link>

        {/* ── Search Bar (Hide for Admin) ── */}
        {(!user || !user?.roles?.includes('ROLE_ADMIN')) && (
          <form onSubmit={handleSearch} style={{ position: 'relative', flex: '0 1 300px', margin: '0 1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A855F7' }} />
            <input
              className="form-input"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2 || e.target.value.length === 0) {
                   navigate(`/?q=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
              style={{ paddingLeft: '2.75rem', borderRadius: '999px', height: '40px' }}
            />
          </form>
        )}

        {/* ── Desktop Nav ── */}
        <div className="nav-links" style={{ flex: 1, justifyContent: 'flex-start' }}>
          {(!user || !user?.roles?.includes('ROLE_ADMIN')) && (
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <ShoppingBag size={15} /><span>Shop</span>
            </Link>
          )}
          {user && (
            <>
              {!user?.roles?.includes('ROLE_ADMIN') && (
                <>
                  <Link to="/wishlist" className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}>
                    <Heart size={15} /><span>Wishlist</span>
                  </Link>
                  <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                    <ShoppingCart size={15} /><span>Cart</span>
                  </Link>
                  <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                    <ShoppingBag size={15} /><span>Orders</span>
                  </Link>
                </>
              )}
              {user?.roles?.includes('ROLE_ADMIN') && (
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                  <LayoutDashboard size={15} /><span>Admin Panel</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* ── Right Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {user ? (
            <>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem 0.4rem 0.5rem',
                background: 'rgba(205,180,255,0.15)',
                border: '1.5px solid rgba(205,180,255,0.4)',
                borderRadius: '999px',
                fontSize: '0.85rem', color: isActive('/profile') ? '#9333EA' : '#6B5B93',
                fontWeight: 600, transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #CDB4FF, #FFC8DD)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <User size={14} color="#7C3AED" />
                </div>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.sub}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn-danger"
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1.2rem', fontSize: '0.875rem', width: 'auto' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.45rem 1.4rem', fontSize: '0.875rem', width: 'auto' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
