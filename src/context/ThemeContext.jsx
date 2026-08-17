import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_PRESETS = {
  cyber: { id: 'cyber', name: 'Cyber Midnight', icon: '🌌', primary: '#6366f1', secondary: '#06b6d4', darkBg: '#0b0f19' },
  emerald: { id: 'emerald', name: 'Emerald Luxury', icon: '💎', primary: '#10b981', secondary: '#f59e0b', darkBg: '#062016' },
  violet: { id: 'violet', name: 'Neon Violet', icon: '🍇', primary: '#a855f7', secondary: '#ec4899', darkBg: '#130924' },
  gold: { id: 'gold', name: 'Sunset Gold', icon: '🌅', primary: '#f59e0b', secondary: '#ef4444', darkBg: '#1a1007' },
  nordic: { id: 'nordic', name: 'Nordic Light', icon: '❄️', primary: '#3b82f6', secondary: '#64748b', darkBg: '#f8fafc' }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aura_theme_mode') || 'dark';
  });

  const [preset, setPreset] = useState(() => {
    return localStorage.getItem('aura_theme_preset') || 'cyber';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-preset', preset);
    localStorage.setItem('aura_theme_mode', theme);
    localStorage.setItem('aura_theme_preset', preset);
  }, [theme, preset]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changePreset = (newPreset) => {
    if (THEME_PRESETS[newPreset]) {
      setPreset(newPreset);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, preset, changePreset, presets: THEME_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
