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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLinks = ({ mobile = false }) => {
    const linkClass = mobile ? "drawer-link" : "nav-link";
    return (
      <>
        {(!user || !user?.roles?.includes('ROLE_ADMIN')) && (
          <Link to="/" className={`${linkClass} ${isActive('/') ? 'active' : ''}`}>
            <ShoppingBag size={18} /><span>Shop</span>
          </Link>
        )}
        {user && (
          <>
            {!user?.roles?.includes('ROLE_ADMIN') && (
              <>
                <Link to="/wishlist" className={`${linkClass} ${isActive('/wishlist') ? 'active' : ''}`}>
                  <Heart size={18} /><span>Wishlist</span>
                </Link>
                <Link to="/cart" className={`${linkClass} ${isActive('/cart') ? 'active' : ''}`}>
                  <ShoppingCart size={18} /><span>Cart</span>
                </Link>
                <Link to="/orders" className={`${linkClass} ${isActive('/orders') ? 'active' : ''}`}>
                  <ShoppingBag size={18} /><span>Orders</span>
                </Link>
              </>
            )}
            {user?.roles?.includes('ROLE_ADMIN') && (
              <Link to="/admin" className={`${linkClass} ${isActive('/admin') ? 'active' : ''}`}>
                <LayoutDashboard size={18} /><span>Admin Panel</span>
              </Link>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? '0 10px 30px rgba(168,85,247,0.12)' : '0 4px 20px rgba(168,85,247,0.06)' }}>
        <div className="navbar-container">

          {/* ── Logo ── */}
          <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #A855F7, #EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(168,85,247,0.4)', flexShrink: 0
            }}>
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.4rem' }}>Trendify</span>
          </Link>

          {/* ── Search Bar ── */}
          {(!user || !user?.roles?.includes('ROLE_ADMIN')) && (
            <form onSubmit={handleSearch} className="nav-search-wrapper" style={{
              position: 'relative',
              flex: '0 1 400px',
              margin: '0 1rem',
              display: window.innerWidth < 640 ? 'none' : 'block' // Simple CSS hide logic for JS render
            }}>
              <Search size={18} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: '#A855F7' }} />
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
                style={{ paddingLeft: '3rem', borderRadius: '999px', height: '44px', background: 'rgba(168,85,247,0.04)' }}
              />
            </form>
          )}

          {/* ── Desktop Nav ── */}
          <div className="nav-links" style={{ flex: 1, justifyContent: 'flex-start', marginLeft: '1rem' }}>
            <NavLinks />
          </div>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user ? (
                <>
                  <Link to="/profile" style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.4rem 1.1rem 0.4rem 0.6rem',
                    background: 'rgba(168,85,247,0.08)',
                    border: '1.5px solid rgba(168,85,247,0.2)',
                    borderRadius: '999px',
                    fontSize: '0.9rem', color: isActive('/profile') ? '#9333EA' : '#2D1F5E',
                    fontWeight: 600, transition: 'all 0.2s ease'
                  }} className="desktop-only">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #CDB4FF, #FFC8DD)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <User size={16} color="#7C3AED" />
                    </div>
                    <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.sub}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="btn-danger desktop-only"
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary desktop-only" style={{ padding: '0.5rem 1.5rem', width: 'auto' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary desktop-only" style={{ padding: '0.5rem 1.7rem', width: 'auto' }}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ display: 'none' }} // Controlled by CSS media query
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar Drawer ── */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#A855F7' }}>Menu</div>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', color: '#8B7BA8' }}>
            <X size={24} />
          </button>
        </div>

        {user && (
          <div style={{
            padding: '1rem',
            background: 'rgba(168,85,247,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(168,85,247,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #CDB4FF, #FFC8DD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={22} color="#7C3AED" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.75rem', color: '#8B7BA8', fontWeight: 600, textTransform: 'uppercase' }}>Logged in as</div>
              <div style={{ fontWeight: 700, color: '#2D1F5E', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.sub}</div>
            </div>
          </div>
        )}

        {/* Search for mobile */}
        {(!user || !user?.roles?.includes('ROLE_ADMIN')) && (
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A855F7' }} />
            <input
              className="form-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '42px' }}
            />
          </form>
        )}

        <div className="drawer-links">
          <NavLinks mobile />
          {user && (
            <Link to="/profile" className={`drawer-link ${isActive('/profile') ? 'active' : ''}`}>
              <User size={18} /><span>My Profile</span>
            </Link>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {user ? (
            <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', padding: '0.85rem' }}>
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ width: '100%' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ width: '100%' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};



export default Navbar;
