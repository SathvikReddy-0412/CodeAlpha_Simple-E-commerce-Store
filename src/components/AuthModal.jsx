import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus, Sparkles, AlertCircle, Zap } from 'lucide-react';
import './AuthModal.css';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register, 
    loading 
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authModalMode === 'register') {
      if (!name.trim()) {
        setError('Full Name is required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password');
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
      }
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.mercer@aura.com');
    setPassword('password123');
    await login('alex.mercer@aura.com', 'password123');
  };

  const handleTabSwitch = (mode) => {
    setError('');
    setAuthModalMode(mode);
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card glass-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close-btn" onClick={closeAuthModal} aria-label="Close auth modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-badge">
            <Sparkles size={24} className="auth-sparkle-icon" />
          </div>
          <h2>{authModalMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {authModalMode === 'login' 
              ? 'Access your orders, saved cart, and personalized wishlist' 
              : 'Join AURA to unlock exclusive perks and seamless checkout'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${authModalMode === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            <LogIn size={16} /> Login
          </button>
          <button 
            className={`auth-tab ${authModalMode === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {/* Quick Demo Login Helper */}
        <div className="demo-login-box">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm demo-btn"
            onClick={handleDemoLogin}
          >
            <Zap size={14} color="var(--primary)" /> Sign In with Demo Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {authModalMode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="auth-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-dots">Processing...</span>
            ) : authModalMode === 'login' ? (
              <>Sign In <LogIn size={18} /></>
            ) : (
              <>Create Account <UserPlus size={18} /></>
            )}
          </button>
        </form>

        {/* Footer Toggle Text */}
        <div className="auth-modal-footer">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => handleTabSwitch('register')}>
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => handleTabSwitch('login')}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
