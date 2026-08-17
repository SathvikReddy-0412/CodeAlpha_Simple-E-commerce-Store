import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Award, ShoppingBag, ShieldCheck, Copy, Check, Star, Flame } from 'lucide-react';
import { productService } from '../services/backendService';
import { ProductCard } from '../components/ProductCard';
import { FlashSaleTimer } from '../components/FlashSaleTimer';
import { useToast } from '../context/ToastContext';
import './Home.css';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const { products } = await productService.getProducts();
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    showToast(`Voucher code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="home-page page-wrapper">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <div className="hero-badge badge-primary">
            <Sparkles size={14} />
            <span>Next-Gen Curated Shopping Experience</span>
          </div>
          
          <h1 className="hero-title">
            Elevate Your Everyday <br />
            <span className="gradient-text">Lifestyle Essentials</span>
          </h1>

          <p className="hero-description">
            Discover precision-engineered wireless audio, artisan Italian leathercraft, and eco-conscious organic bamboo textiles designed for modern aesthetic living.
          </p>

          <div className="hero-cta-group">
            <Link to="/shop" className="btn btn-primary btn-lg">
              <span>Explore Entire Catalog</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/shop?category=Electronics" className="btn btn-secondary btn-lg">
              <Zap size={18} />
              <span>Trending Tech Gear</span>
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">4.9★</span>
              <span className="metric-label">Over 15,000+ Customer Reviews</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Authentic & Guaranteed</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">2-Day</span>
              <span className="metric-label">Express Worldwide Shipping</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual">
          <div className="hero-image-wrapper glass-card">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80" 
              alt="Aura Pro Headphones Showcase"
              className="hero-img" 
            />

            <div className="floating-card top-right-card animate-fade-in">
              <Award size={22} color="var(--primary)" />
              <div>
                <strong>Best ANC Headphones 2026</strong>
                <p>Awarded by AudioTech Review</p>
              </div>
            </div>

            <div className="floating-card bottom-left-card animate-fade-in">
              <Zap size={22} color="var(--secondary)" />
              <div>
                <strong>Exclusive Flash Sale</strong>
                <p>Use Code: <b className="code-pill">SAVE20</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner with Live Timer */}
      <section className="flash-sale-section container">
        <div className="flash-sale-card glass-card">
          <div className="flash-sale-info">
            <div className="flash-sale-badge">
              <Flame size={16} />
              <span>Limited Time Deal</span>
            </div>
            <h2>Supercharged Flash Sale Event</h2>
            <p>Save up to 30% off top-rated acoustic noise-canceling gear & artisan leather tote bags.</p>
          </div>
          <div className="flash-sale-action">
            <FlashSaleTimer targetHours={12} />
            <Link to="/shop" className="btn btn-primary">
              Grab Flash Deals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Shortcut Grid */}
      <section className="categories-section container">
        <div className="section-header">
          <div>
            <h2>Shop by Curated Category</h2>
            <p className="section-subtitle">Browse products tailored to your lifestyle</p>
          </div>
          <Link to="/shop" className="see-all-link">View All Categories <ArrowRight size={16} /></Link>
        </div>

        <div className="category-grid">
          <Link to="/shop?category=Electronics" className="category-card cat-electronics">
            <div className="cat-bg-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80)` }} />
            <div className="cat-overlay" />
            <div className="cat-content">
              <h3>Consumer Electronics</h3>
              <p>Headphones, Smartwatches & Keyboards</p>
              <span className="cat-btn">Explore <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/shop?category=Fashion" className="category-card cat-fashion">
            <div className="cat-bg-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80)` }} />
            <div className="cat-overlay" />
            <div className="cat-content">
              <h3>Fashion & Apparel</h3>
              <p>Tuscan Leather Totes & Running Shoes</p>
              <span className="cat-btn">Explore <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/shop?category=Home%20%26%20Living" className="category-card cat-home">
            <div className="cat-bg-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80)` }} />
            <div className="cat-overlay" />
            <div className="cat-content">
              <h3>Home & Living</h3>
              <p>Organic Bamboo Linen & Ceramic Diffusers</p>
              <span className="cat-btn">Explore <ArrowRight size={14} /></span>
            </div>
          </Link>

          <Link to="/shop?category=Beauty" className="category-card cat-beauty">
            <div className="cat-bg-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80)` }} />
            <div className="cat-overlay" />
            <div className="cat-content">
              <h3>Beauty & Wellness</h3>
              <p>HydraGlow Serums & Self-Care</p>
              <span className="cat-btn">Explore <ArrowRight size={14} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section container">
        <div className="section-header">
          <div>
            <h2>Featured & Trending Products</h2>
            <p className="section-subtitle">Handpicked items with top customer ratings and verified reviews</p>
          </div>
          <Link to="/shop" className="btn btn-outline">Explore Full Shop</Link>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Coupon Banner */}
      <section className="promo-banner-section container">
        <div className="promo-banner-card glass-card">
          <div className="promo-banner-content">
            <span className="badge badge-secondary">Special Promotion</span>
            <h2>Get 20% Off Your Order Today</h2>
            <p>Use voucher code below at checkout to instantly unlock 20% savings & complimentary express delivery.</p>

            <div className="coupon-copy-wrapper">
              <div className="coupon-code-display">SAVE20</div>
              <button 
                className="btn btn-primary coupon-copy-btn"
                onClick={() => handleCopyCoupon('SAVE20')}
              >
                {copiedCoupon ? <Check size={18} /> : <Copy size={18} />}
                <span>{copiedCoupon ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="testimonials-section container">
        <div className="section-header center">
          <h2>Loved by Modern Minimalists</h2>
          <p className="section-subtitle">Here is what our verified buyers have to say about AURA</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card glass-card">
            <div className="star-rating">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
            <p className="testimonial-quote">
              "The Aura Pro headphones completely exceeded my expectations. Sound clarity is crisp and battery lasts over a week of daily commutes."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AM</div>
              <div>
                <strong>Alex Mercer</strong>
                <span>Verified Buyer • San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card glass-card">
            <div className="star-rating">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
            <p className="testimonial-quote">
              "The Italian Leather tote smells amazing and holds my 15” MacBook perfectly. Shipping arrived in 2 days. Couldn’t be happier!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EW</div>
              <div>
                <strong>Emma Watson</strong>
                <span>Verified Buyer • London, UK</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card glass-card">
            <div className="star-rating">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
            <p className="testimonial-quote">
              "Organic bamboo sheet sets are so soft and cool. Best night’s sleep I've had in a long time. Definitely buying a second set."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">CM</div>
              <div>
                <strong>Chloe M.</strong>
                <span>Verified Buyer • New York, NY</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
