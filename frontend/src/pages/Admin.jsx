import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import {
  Plus, Trash2, Edit3, X, Save, Package, Search,
  BarChart3, ShoppingBag, ClipboardList, DollarSign, TrendingUp, Sparkles
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    CREATED: { bg: 'rgba(168,85,247,0.1)', color: '#9333EA', border: 'rgba(168,85,247,0.25)', label: 'Created' },
    PAID: { bg: 'rgba(72,199,116,0.1)', color: '#1A8F47', border: 'rgba(72,199,116,0.3)', label: 'Paid' },
    SHIPPED: { bg: 'rgba(189,224,254,0.2)', color: '#1565C0', border: 'rgba(189,224,254,0.5)', label: 'Shipped' },
    DELIVERED: { bg: 'rgba(72,199,116,0.1)', color: '#1A8F47', border: 'rgba(72,199,116,0.3)', label: 'Delivered' },
    PROCESS: { bg: 'rgba(255,171,64,0.1)', color: '#C65D00', border: 'rgba(255,171,64,0.3)', label: 'Processing' },
    PENDING: { bg: 'rgba(255,171,64,0.1)', color: '#C65D00', border: 'rgba(255,171,64,0.3)', label: 'Pending' },
    CANCELLED: { bg: 'rgba(240,98,146,0.1)', color: '#C62828', border: 'rgba(240,98,146,0.3)', label: 'Cancelled' },
  };
  const cfg = map[status] || map.CREATED;
  return (
    <span className="badge" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, fontSize: '0.68rem' }}>
      {cfg.label}
    </span>
  );
};

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [formData, setFormData] = useState({ 
    name: '', description: '', price: '', imageUrl: '', 
    category: 'Fashion', stock: 10, imageGallery: '' 
  });

  const fetchProducts = async () => {
    try { const r = await api.get('/products'); setProducts(r.data); }
    catch { addToast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try { const r = await api.get('/orders/admin'); setOrders(r.data); }
    catch { addToast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'products' || activeTab === 'dashboard') fetchProducts();
    if (activeTab === 'orders' || activeTab === 'dashboard') fetchOrders();
  }, [activeTab]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/status-update/${orderId}/${newStatus}`);
      addToast('Status updated! ✅', 'success');
      fetchOrders();
    } catch (err) { 
      console.error('Update status error:', err);
      addToast('Failed to update status', 'error'); 
    }
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', imageUrl: '', category: 'Fashion', stock: 10, imageGallery: '' });
    setEditingId(null); setIsFormOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try { await api.delete(`/products/${id}`); addToast(`"${name}" deleted`, 'success'); fetchProducts(); }
    catch { addToast('Failed to delete', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSavingProduct(true);
    const payload = { 
      ...formData, 
      price: parseFloat(formData.price || 0), 
      stock: parseInt(formData.stock || 0),
      imageGallery: formData.imageGallery.split(',').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      addToast(editingId ? 'Product updated! ✨' : 'Product created! 🎉', 'success');
      resetForm(); fetchProducts();
    } catch { addToast('Save failed', 'error'); }
    finally { setSavingProduct(false); }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({ 
      name: product.name, 
      description: product.description || '', 
      price: product.price, 
      imageUrl: product.imageUrl || '',
      category: product.category || 'Fashion',
      stock: product.stock || 0,
      imageGallery: (product.imageGallery || []).join(', ')
    });
    setIsFormOpen(true); setActiveTab('products');
  };

  if (!isAdmin) return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-container empty-state" style={{ maxWidth: 400 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h3>Access Denied</h3>
        <p>You don't have permission to view this page.</p>
      </div>
    </div>
  );

  const paidOrders = orders.filter(o => o.status === 'PAID' || o.status === 'DELIVERED');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
  ];

  const stats = [
    { label: 'Listed Products', value: products.length, icon: Package, gradient: 'linear-gradient(135deg, rgba(205,180,255,0.2), rgba(168,85,247,0.1))', iconBg: 'rgba(168,85,247,0.15)', iconColor: '#9333EA' },
    { label: 'Completed Sales', value: paidOrders.length, icon: ShoppingBag, gradient: 'linear-gradient(135deg, rgba(255,200,221,0.2), rgba(240,98,146,0.1))', iconBg: 'rgba(240,98,146,0.15)', iconColor: '#F06292' },
    { label: 'Confirmed Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: DollarSign, gradient: 'linear-gradient(135deg, rgba(181,234,215,0.2), rgba(72,199,116,0.1))', iconBg: 'rgba(72,199,116,0.15)', iconColor: '#1A8F47' },
    { label: 'Avg Sale Value', value: paidOrders.length ? `₹${(totalRevenue / paidOrders.length).toFixed(0)}` : '₹0', icon: TrendingUp, gradient: 'linear-gradient(135deg, rgba(189,224,254,0.2), rgba(100,181,246,0.1))', iconBg: 'rgba(100,181,246,0.15)', iconColor: '#1565C0' },
  ];

  const toggleProductStatus = async (product) => {
    try {
      await api.put(`/products/${product.id}`, { ...product, active: !product.active });
      addToast(`Product is now ${!product.active ? 'Active' : 'Inactive'}`, 'success');
      fetchProducts();
    } catch { addToast('Failed to update status', 'error'); }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <p className="page-subtitle">Manage products, orders, and store analytics</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(205,180,255,0.3)', borderRadius: '999px', padding: '0.35rem', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.35rem', borderRadius: '999px',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#8B7BA8',
              border: 'none', transition: 'all 0.25s ease',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(168,85,247,0.35)' : 'none'
            }}>
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Dashboard Tab ── */}
      {activeTab === 'dashboard' && (
        <>
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
            {stats.map(stat => (
              <div key={stat.label} className="glass-container stat-card" style={{ background: stat.gradient }}>
                <div className="stat-icon" style={{ background: stat.iconBg }}>
                  <stat.icon size={20} color={stat.iconColor} />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ color: stat.iconColor }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Recent Orders preview */}
          <div className="glass-container" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(205,180,255,0.2)', background: 'rgba(245,240,255,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ClipboardList size={16} color="#9333EA" />
                <h3 style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '0.95rem' }}>Recent Orders</h3>
              </div>
              <button onClick={() => setActiveTab('orders')} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', width: 'auto' }}>
                View All
              </button>
            </div>
            <table className="data-table">
              <thead><tr><th>Order #</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: '#2D1F5E' }}>#{o.id}</td>
                    <td style={{ fontWeight: 700, color: '#9333EA' }}>₹{o.totalAmount?.toFixed(2)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <select
                        className="form-input"
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                        style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '999px', background: 'white' }}
                      >
                        {['CREATED', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Products Tab ── */}
      {activeTab === 'products' && (
        <>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A855F7', pointerEvents: 'none' }} />
              <input className="form-input" placeholder="Search by name or category…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.75rem', borderRadius: '999px' }} />
            </div>
            {!isFormOpen && (
              <button className="btn-primary" style={{ width: 'auto', flexShrink: 0 }} onClick={() => setIsFormOpen(true)}>
                <Plus size={17} /> Add Product
              </button>
            )}
          </div>

          {/* Product Form */}
          {isFormOpen && (
            <div className="glass-container" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '2px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={16} color="#9333EA" />
                  <h3 style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '1rem' }}>
                    {editingId ? 'Edit Product' : 'New Product'}
                  </h3>
                </div>
                <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B7BA8' }}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input className="form-input" placeholder="e.g. Silk Shirt" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input className="form-input" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                      {['Fashion', 'Electronics', 'Shoes', 'Accessories', 'Beauty'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input className="form-input" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Main Image URL</label>
                    <input className="form-input" placeholder="https://…" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Gallery Images (Comma separated URLs)</label>
                    <textarea className="form-input" placeholder="url1, url2, url3" rows={2} value={formData.imageGallery} onChange={e => setFormData({ ...formData, imageGallery: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="Details about materials, sizing, etc." rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={savingProduct}>
                    <Save size={16} /> {savingProduct ? 'Saving…' : 'Save Product'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="glass-container" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(205,180,255,0.2)', background: 'rgba(245,240,255,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Package size={15} color="#9333EA" />
                <h3 style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '0.9rem' }}>{filteredProducts.length} Items Listed</h3>
              </div>
            </div>
            {loading ? (
              <div className="spinner-container"><div className="spinner" /></div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Product</th><th>Details</th><th>Price/Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: 'white', border: '1.5px solid rgba(205,180,255,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
                          }}>
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span>🛍️</span>}
                          </div>
                          <span style={{ fontWeight: 700, color: '#2D1F5E' }}>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <span className={`${p.active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem', cursor: 'pointer' }} onClick={() => toggleProductStatus(p)}>
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{p.category}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <span style={{ fontWeight: 800, color: '#9333EA' }}>₹{p.price?.toFixed(2)}</span>
                           <span style={{ fontSize: '0.75rem', color: p.stock > 5 ? '#1A8F47' : '#D32F2F' }}>Qty: {p.stock}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => startEdit(p)} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', width: 'auto' }}>
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} disabled={deletingId === p.id} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── Orders Tab ── */}
      {activeTab === 'orders' && (
        <div className="glass-container" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(205,180,255,0.2)', background: 'rgba(245,240,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ClipboardList size={15} color="#9333EA" />
            <h3 style={{ fontWeight: 700, color: '#2D1F5E', fontSize: '0.9rem' }}>{orders.length} Orders Recorded</h3>
          </div>
          {loading ? (
            <div className="spinner-container"><div className="spinner" /></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 800, color: '#2D1F5E' }}>Order #{o.id}</span>
                         <span style={{ fontSize: '0.7rem', color: '#8B7BA8' }}>Placed: {new Date(o.orderDate || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#9333EA' }}>₹{o.totalAmount?.toFixed(2)}</span></td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <select
                        className="form-input"
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                        style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8rem', borderRadius: '999px', background: 'white' }}
                      >
                        {['CREATED', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
