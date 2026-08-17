import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './Footer.css';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing! Check your inbox for your 10% welcome voucher code.', 'success');
      setEmail('');
    }
  };

  const handleInfoClick = (e, title, message) => {
    e.preventDefault();
    showToast(`${title}: ${message}`, 'info');
  };

  return (
    <footer className="main-footer">
      {/* Value Proposition Highlights Bar */}
      <div className="footer-benefits-bar">
        <div className="container benefits-grid">
          <div className="benefit-item">
            <Truck className="benefit-icon" size={24} />
            <div>
              <strong>Complimentary Express Delivery</strong>
              <p>On all orders over $50 storewide</p>
            </div>
          </div>

          <div className="benefit-item">
            <RotateCcw className="benefit-icon" size={24} />
            <div>
              <strong>30-Day Hassle-Free Returns</strong>
              <p>100% money-back guarantee</p>
            </div>
          </div>

          <div className="benefit-item">
            <ShieldCheck className="benefit-icon" size={24} />
            <div>
              <strong>256-Bit Encrypted Payments</strong>
              <p>Bank-level checkout security</p>
            </div>
          </div>

          <div className="benefit-item">
            <Headphones className="benefit-icon" size={24} />
            <div>
              <strong>24/7 VIP Concierge Support</strong>
              <p>Dedicated customer care team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="footer-body">
        <div className="container footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-icon"><Sparkles size={20} /></span>
              <span className="logo-text">AURA</span>
            </Link>
            <p className="brand-tagline">
              Curating high-performance acoustic gear, artisan lifestyle essentials, and sustainable luxury for the modern minimalist.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter email for VIP updates..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Store Collections</h4>
            <ul>
              <li><Link to="/shop?category=Electronics">Audio & Electronics</Link></li>
              <li><Link to="/shop?category=Fashion">Fashion & Footwear</Link></li>
              <li><Link to="/shop?category=Home%20%26%20Living">Home & Living</Link></li>
              <li><Link to="/shop?category=Beauty">Beauty & Wellness</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Customer Support</h4>
            <ul>
              <li><Link to="/orders">Order Tracking Status</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li>
                <a href="#shipping" onClick={(e) => handleInfoClick(e, 'Shipping Policy', 'Express Delivery 1-2 Days. Free on orders over $50!')}>
                  Shipping & Return Policy
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleInfoClick(e, 'Customer Support', 'Questions? Email support@aura.com or call 1-800-AURA-VIP')}>
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Company & Trust</h4>
            <ul>
              <li>
                <a href="#about" onClick={(e) => handleInfoClick(e, 'About AURA', 'Precision acoustic gear & handcrafted lifestyle luxury.')}>
                  About AURA
                </a>
              </li>
              <li>
                <a href="#sustainability" onClick={(e) => handleInfoClick(e, 'Sustainability', '100% Organic Viscose & Plastic-Free Packaging.')}>
                  Sustainability Commitment
                </a>
              </li>
              <li>
                <a href="#careers" onClick={(e) => handleInfoClick(e, 'Careers', 'Send your CV to careers@aura.com')}>
                  Careers & Press
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => handleInfoClick(e, 'Privacy Guarantee', '256-bit SSL encrypted. Data is 100% confidential.')}>
                  Privacy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>© 2026 AURA E-Commerce Inc. Designed & Developed by <b>Sathvik Reddy Surasani</b>. All Rights Reserved. Crafted with <Heart size={14} fill="#ec4899" color="#ec4899" className="inline-heart" /> for quality living.</p>
          <div className="payment-badges">
            <span className="pay-chip">VISA</span>
            <span className="pay-chip">Mastercard</span>
            <span className="pay-chip">Apple Pay</span>
            <span className="pay-chip">Google Pay</span>
            <span className="pay-chip">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
