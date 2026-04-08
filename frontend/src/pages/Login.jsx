import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Shield, Smartphone, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyLoginOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.otpRequired) { setOtpSent(true); setError('Verification code sent to your email. 📨'); }
      else if (res.role === 'ROLE_ADMIN') navigate('/admin');
      else navigate('/');
    } else { setError(res.message); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyLoginOtp(email, otp);
    if (res.success) {
      if (res.role === 'ROLE_ADMIN') navigate('/admin');
      else navigate('/');
    }
    else setError(res.message);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(205,180,255,0.25)', filter: 'blur(60px)', top: '-100px', right: '-80px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,200,221,0.2)', filter: 'blur(60px)', bottom: '-80px', left: '-60px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="gradient-header-icon">
            {otpSent ? <Smartphone size={28} color="white" /> : <Sparkles size={28} color="white" />}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2D1F5E', marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>
            {otpSent ? 'Check Your Email 📬' : 'Welcome Back! 👋'}
          </h1>
          <p style={{ color: '#8B7BA8', fontSize: '0.95rem' }}>
            {otpSent ? `We sent a code to ${email}` : 'Sign in to your Trendify account'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-container" style={{ padding: '2.25rem' }}>
          {error && (
            <div className={`alert ${otpSent && error.includes('sent') ? 'alert-success' : 'alert-error'}`}>
              <Shield size={15} /> {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label inline-icon"><Mail size={13} /> Email Address</label>
                <input type="email" className="form-input" placeholder="name@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label inline-icon"><Lock size={13} /> Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className="form-input"
                    placeholder="Enter your password" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="btn-icon-inside">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? 'Sending Code…' : '✨ Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input type="text" className="form-input" placeholder="Enter 6-digit code"
                  value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '0.6em', fontSize: '1.35rem', fontWeight: 700, color: '#2D1F5E' }} />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying…' : '🔐 Verify & Sign In'}
              </button>
              <button type="button" className="btn-secondary"
                style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => setOtpSent(false)}>
                ← Back to Login
              </button>
            </form>
          )}

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8B7BA8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#9333EA', fontWeight: 700, textDecoration: 'none' }}>
              Create one 🌸
            </Link>
          </p>
        </div>

        {/* Trust line */}
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: '#B0A0CC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Shield size={12} /> Secure, encrypted login
        </p>
      </div>
    </div>
  );
};

export default Login;
