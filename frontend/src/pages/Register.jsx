import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, verifyRegistration } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    const res = await register(formData.username, formData.email, formData.password);
    if (res.success) { setStep(2); addToast('Verification code sent! 📨', 'success'); }
    else setError(res.message);
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyRegistration(formData.email, verificationCode);
    if (res.success) setStep(3);
    else setError(res.message);
    setLoading(false);
  };

  const stepLabels = ['Account Details', 'Verify Email', 'Welcome!'];

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'rgba(205,180,255,0.22)', filter: 'blur(70px)', top: '-120px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,200,221,0.2)', filter: 'blur(70px)', bottom: '-80px', right: '-80px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(189,224,254,0.18)', filter: 'blur(50px)', bottom: '30%', left: '60%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.75rem', justifyContent: 'center' }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step > i + 1 ? 'linear-gradient(135deg, #A855F7, #EC4899)' :
                  step === i + 1 ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : 'rgba(205,180,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: step >= i + 1 ? 'white' : '#8B7BA8',
                transition: 'all 0.3s ease',
                boxShadow: step === i + 1 ? '0 4px 14px rgba(168,85,247,0.4)' : 'none'
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {i < stepLabels.length - 1 && (
                <div style={{ width: 28, height: 2, background: step > i + 1 ? 'linear-gradient(90deg, #A855F7, #EC4899)' : 'rgba(205,180,255,0.3)', borderRadius: 2, transition: 'all 0.3s ease' }} />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="gradient-header-icon">
            {step === 1 ? <UserPlus size={27} color="white" /> :
              step === 2 ? <Mail size={27} color="white" /> :
              <CheckCircle size={27} color="white" />}
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#2D1F5E', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            {step === 1 ? 'Create Account 🌸' : step === 2 ? 'Verify Email 📬' : 'You\'re In! 🎉'}
          </h1>
          <p style={{ color: '#8B7BA8', fontSize: '0.9rem' }}>
            {step === 1 ? 'Join the Trendify community' :
             step === 2 ? `Check your inbox at ${formData.email}` :
             'Account verified successfully!'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-container" style={{ padding: '2.25rem' }}>
          {error && <div className="alert alert-error"><Shield size={15} /> {error}</div>}

          {step === 1 && (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label inline-icon"><User size={13} /> Username</label>
                <input type="text" className="form-input" placeholder="Choose a unique name"
                  value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label inline-icon"><Mail size={13} /> Email Address</label>
                <input type="email" className="form-input" placeholder="name@example.com"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label inline-icon"><Lock size={13} /> Password</label>
                <input type="password" className="form-input" placeholder="Min 8 characters"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label inline-icon"><Shield size={13} /> Confirm Password</label>
                <input type="password" className="form-input" placeholder="Retype your password"
                  value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.25rem' }}>
                {loading ? 'Creating Account…' : '✨ Create Account'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <div style={{ textAlign: 'center', padding: '0.5rem 0 1.25rem' }}>
                <p style={{ color: '#8B7BA8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Enter the 6-digit verification code sent to your email.
                </p>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Verification Code</label>
                <input type="text" className="form-input" placeholder="○ ○ ○ ○ ○ ○"
                  value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
                  required maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 700, color: '#2D1F5E' }} />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying…' : '🔐 Verify Email'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎊</div>
              <p style={{ color: '#8B7BA8', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                Your account is all set. Start exploring Trendify's amazing products!
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary">
                <Sparkles size={17} /> Go to Sign In
              </button>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="divider" />
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8B7BA8' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#9333EA', fontWeight: 700 }}>Log In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
