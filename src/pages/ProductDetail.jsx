import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Sparkles, MessageSquare } from 'lucide-react';
import { productService } from '../services/backendService';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews' | 'shipping'

  // Review Form state
  const [newReviewUser, setNewReviewUser] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState([]);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        setSelectedImage(data.image);
        setSelectedColor(data.colors?.[0] || '');
        setSelectedSize(data.sizes?.[0] || '');
        setReviewsList(data.reviews || []);

        // Load related category products
        const { products: all } = await productService.getProducts();
        const related = all.filter(p => p.category === data.category && p.id !== data.id);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page page-wrapper container">
        <div className="detail-skeleton glass-card" style={{ height: '500px' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page page-wrapper container">
        <div className="glass-card detail-error-card">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/shop" className="btn btn-primary">Back to Shop Catalog</Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const gallery = product.gallery || [product.image];
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    showToast(`Added ${quantity} x ${product.name} to cart!`, 'success');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (newReviewUser.trim() && newReviewComment.trim()) {
      const newEntry = {
        id: `r-${Date.now()}`,
        user: newReviewUser.trim(),
        rating: Number(newReviewRating),
        date: new Date().toISOString().split('T')[0],
        comment: newReviewComment.trim()
      };
      setReviewsList([newEntry, ...reviewsList]);
      showToast('Thank you! Your product review has been published.', 'success');
      setNewReviewUser('');
      setNewReviewComment('');
    }
  };

  return (
    <div className="product-detail-page page-wrapper container">
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop Catalog</Link> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> / <span>{product.name}</span>
      </nav>

      {/* Main Detail Grid */}
      <div className="detail-main-grid glass-card">
        {/* Image Gallery */}
        <div className="detail-gallery-col">
          <div className="detail-main-image-frame">
            <img src={selectedImage} alt={product.name} className="detail-main-img" />
            {discountPercent > 0 && (
              <span className="detail-discount-badge">-{discountPercent}% OFF</span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="detail-thumbnails-row">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  className={`detail-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="detail-info-col">
          <div className="detail-header-badges">
            <span className="badge badge-primary">{product.category}</span>
            {product.badge && <span className="badge badge-secondary">{product.badge}</span>}
            {product.inStock && <span className="badge badge-success">In Stock</span>}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Ratings row */}
          <div className="detail-rating-row">
            <div className="star-rating">
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span className="rating-val">{product.rating}</span>
            </div>
            <span className="rating-count">({reviewsList.length} Verified Customer Reviews)</span>
          </div>

          {/* Pricing Row */}
          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Stock Level Progress Indicator */}
          {product.stockCount && (
            <div className="stock-level-box">
              <div className="stock-level-header">
                <span>Stock Status: <b>{product.stockCount} units remaining</b></span>
              </div>
              <div className="stock-progress-track">
                <div 
                  className="stock-progress-fill" 
                  style={{ width: `${Math.min(100, (product.stockCount / 50) * 100)}%` }} 
                />
              </div>
            </div>
          )}

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="detail-option-group">
              <label className="option-label">Color: <b>{selectedColor}</b></label>
              <div className="color-options-row">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="detail-option-group">
              <label className="option-label">Size: <b>{selectedSize}</b></label>
              <div className="size-options-row">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and CTA Buttons */}
          <div className="detail-cta-row">
            <div className="qty-selector-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button className="btn btn-primary btn-lg detail-add-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag size={20} />
              <span>Add {quantity} to Cart</span>
            </button>

            <button
              className={`btn-icon detail-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => {
                toggleWishlist(product);
                showToast(
                  isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist!',
                  isWishlisted ? 'info' : 'success'
                );
              }}
              title={isWishlisted ? 'Remove Wishlist' : 'Add Wishlist'}
            >
              <Heart size={22} fill={isWishlisted ? '#ec4899' : 'none'} color={isWishlisted ? '#ec4899' : 'currentColor'} />
            </button>
          </div>

          {/* Value Propositions */}
          <div className="detail-guarantees">
            <div className="guarantee-chip"><Truck size={16} /> Free Express Delivery</div>
            <div className="guarantee-chip"><ShieldCheck size={16} /> 2-Year Full Warranty</div>
            <div className="guarantee-chip"><RotateCcw size={16} /> 30-Day Money Back</div>
          </div>
        </div>
      </div>

      {/* Tabbed Technical & Review Section */}
      <section className="detail-tabs-section glass-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Technical Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({reviewsList.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-pane overview-pane">
              <h3>Product Highlights</h3>
              <p>{product.description}</p>
              <ul>
                <li>Precision engineered from top-tier aerospace components and materials.</li>
                <li>Designed for long-lasting durability, eco-efficiency, and daily luxury.</li>
                <li>Comes with full brand packaging and authenticity card.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="tab-pane specs-pane">
              <h3>Technical Specifications</h3>
              {product.specifications ? (
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane reviews-pane">
              <div className="reviews-header-row">
                <div>
                  <h3>Customer Reviews & Ratings</h3>
                  <p>Read genuine feedback from verified owners</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviewsList.map(r => (
                  <div key={r.id} className="review-item-card">
                    <div className="review-user-row">
                      <div className="review-avatar">{r.user.charAt(0)}</div>
                      <div>
                        <strong>{r.user}</strong>
                        <span className="review-date">{r.date}</span>
                      </div>
                      <div className="star-rating margin-left-auto">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < r.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">"{r.comment}"</p>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div className="write-review-box glass-card">
                <h4><MessageSquare size={18} /> Write a Customer Review</h4>
                <form onSubmit={handleAddReview} className="review-form">
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Mercer"
                        value={newReviewUser}
                        onChange={(e) => setNewReviewUser(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(e.target.value)}
                        className="form-select"
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                        <option value={2}>2 Stars ★★☆☆☆</option>
                        <option value={1}>1 Star ★☆☆☆☆</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Review Comment</label>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit Product Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane shipping-pane">
              <h3>Shipping & Returns Policy</h3>
              <p>We deliver globally with express tracked carrier services.</p>
              <br />
              <strong>Delivery Times:</strong>
              <p>Standard Shipping: 3 - 5 Business Days | Express Air: 1 - 2 Business Days</p>
              <br />
              <strong>Returns:</strong>
              <p>30-Day Hassle-Free Returns. Returned items must be in original condition with tags intact.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Related Products You Might Like</h2>
          <div className="product-grid" style={{ marginTop: '1.5rem' }}>
            {relatedProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
