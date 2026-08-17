import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Sun, Moon, Package, Menu, X, Sparkles, User, LogIn, LogOut, ChevronDown, Globe, Palette } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { PRODUCTS } from '../services/productsData';
import './Navbar.css';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);

  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme, preset, changePreset, presets } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { currency, setCurrency, formatPrice, currencies } = useCurrency();
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const currencyRef = useRef(null);
  const presetRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter products for autocomplete
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Keyboard shortcut Ctrl+K to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (presetRef.current && !presetRef.current.contains(event.target)) {
        setIsPresetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSelectSearchResult = (productId) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header glass-nav">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><Sparkles size={22} /></span>
          <span className="logo-text">AURA</span>
        </Link>

        {/* Desktop Search Bar with Live Autocomplete */}
        <div className="navbar-search-wrapper">
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search audio, watches, linen, shoes... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
            <kbd className="search-kbd">⌘K</kbd>
          </form>

          {/* Autocomplete Dropdown Panel */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-autocomplete-dropdown animate-scale-up">
              <div className="autocomplete-header">Quick Matches</div>
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className="autocomplete-item"
                  onMouseDown={() => handleSelectSearchResult(product.id)}
                >
                  <img src={product.image} alt={product.name} className="ac-thumb" />
                  <div className="ac-details">
                    <span className="ac-name">{product.name}</span>
                    <div className="ac-meta">
                      <span className="ac-cat">{product.category}</span>
                      <span className="ac-price">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-item ${isActive('/shop') ? 'active' : ''}`}>
            Shop Catalog
          </Link>
          <Link to="/orders" className={`nav-item ${isActive('/orders') ? 'active' : ''}`}>
            Orders
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Theme Palette Switcher Dropdown */}
          <div className="theme-preset-menu-wrapper" ref={presetRef}>
            <button
              className="btn-icon theme-preset-btn"
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              title="Change Theme Palette"
            >
              <Palette size={19} />
            </button>
            {isPresetDropdownOpen && (
              <div className="theme-preset-dropdown animate-scale-up">
                <div className="preset-header">Select Palette</div>
                {Object.values(presets).map(p => (
                  <button
                    key={p.id}
                    className={`preset-option ${preset === p.id ? 'active' : ''}`}
                    onClick={() => {
                      changePreset(p.id);
                      setIsPresetDropdownOpen(false);
                    }}
                  >
                    <span>{p.icon} {p.name}</span>
                    <span className="preset-swatch" style={{ background: p.primary }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="currency-menu-wrapper" ref={currencyRef}>
            <button 
              className="currency-btn"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              title="Change Currency"
            >
              <Globe size={16} />
              <span>{currency}</span>
              <ChevronDown size={12} />
            </button>
            {isCurrencyDropdownOpen && (
              <div className="currency-dropdown animate-scale-up">
                {Object.values(currencies).map(c => (
                  <button
                    key={c.code}
                    className={`currency-option ${currency === c.code ? 'active' : ''}`}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                  >
                    <span>{c.symbol} {c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Control */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button 
                className="user-profile-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-text">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu animate-scale-up">
                  <div className="user-dropdown-header">
                    <span className="user-full-name">{user.name}</span>
                    <span className="user-email-text">{user.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link 
                    to="/orders" 
                    className="dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Package size={16} /> My Orders
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Heart size={16} /> My Wishlist ({wishlistCount})
                  </Link>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item logout-item"
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn-auth-signin" 
              onClick={() => openAuthModal('login')}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button 
            className="btn-icon theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Wishlist Button */}
          <Link to="/wishlist" className="btn-icon badge-wrapper" title="Wishlist">
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="nav-badge badge-secondary">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart Drawer Trigger Button */}
          <button 
            className="cart-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            title="Open Shopping Cart"
          >
            <ShoppingBag size={19} />
            <span className="cart-trigger-label">Cart</span>
            {itemCount > 0 && (
              <span className="cart-count-pill">{itemCount}</span>
            )}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fade-in">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          {/* Mobile Palette Switcher */}
          <div className="mobile-preset-picker">
            <span>Theme Palette:</span>
            <div className="preset-chips">
              {Object.values(presets).map(p => (
                <button
                  key={p.id}
                  className={`preset-chip ${preset === p.id ? 'active' : ''}`}
                  onClick={() => changePreset(p.id)}
                >
                  {p.icon} {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {isAuthenticated ? (
            <div className="mobile-user-card">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="mobile-user-info">
                <span className="user-full-name">{user.name}</span>
                <span className="user-email-text">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-actions">
              <button 
                className="mobile-btn-signin"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                <LogIn size={18} /> Sign In / Register
              </button>
            </div>
          )}

          <div className="mobile-nav-links">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Catalog</Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
            {isAuthenticated && (
              <button 
                className="mobile-nav-logout"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} /> Logout Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
