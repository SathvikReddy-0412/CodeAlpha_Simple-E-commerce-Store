import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/backendService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('aura_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('aura_auth_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Validate stored token on mount
  useEffect(() => {
    if (token) {
      authService.getMe()
        .then(u => {
          if (u) {
            setUser(u);
            localStorage.setItem('aura_user', JSON.stringify(u));
          } else {
            // Invalid token
            logout(false);
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aura_auth_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      addToast(`Welcome back, ${data.user.name}!`, 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aura_auth_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      addToast(`Account created! Welcome to AURA, ${data.user.name}!`, 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = (notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aura_auth_token');
    localStorage.removeItem('aura_user');
    if (notify) {
      addToast('Logged out successfully', 'info');
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isAuthModalOpen,
      authModalMode,
      loading,
      login,
      register,
      logout,
      openAuthModal,
      closeAuthModal,
      setAuthModalMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
