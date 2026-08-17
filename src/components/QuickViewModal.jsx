import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Star, ShieldCheck, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import './QuickViewModal.css';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const gallery = product.gallery || [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    showToast(`Added ${quantity} x ${product.name} to cart!`, 'success');
    onClose();
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quickview-modal glass-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-content">
          {/* Gallery View */}
          <div className="quickview-gallery">
            <div className="main-image-frame">
              <img src={selectedImage} alt={product.name} className="main-img" />
              {discountPercent > 0 && (
                <span className="qv-badge-discount">-{discountPercent}% OFF</span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="qv-thumbnails">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    className={`qv-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumb ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="quickview-info">
            <div className="qv-header">
              <span className="badge badge-primary">{product.category}</span>
              {product.badge && <span className="badge badge-secondary">{product.badge}</span>}
            </div>

            <h2 className="qv-title">{product.name}</h2>

            <div className="qv-rating-row">
              <div className="star-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span className="rating-val">{product.rating}</span>
              </div>
              <span className="rating-count">({product.reviewsCount || 0} Customer Reviews)</span>
            </div>

            <div className="qv-price-row">
              <span className="qv-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="qv-original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="qv-description">{product.description}</p>

            {/* Colors Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="qv-option-group">
                <label className="qv-option-label">Color: <b>{selectedColor}</b></label>
                <div className="qv-color-chips">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`qv-color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="qv-option-group">
                <label className="qv-option-label">Size: <b>{selectedSize}</b></label>
                <div className="qv-size-chips">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`qv-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA Buttons */}
            <div className="qv-action-row">
              <div className="qv-qty-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-num">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button className="btn btn-primary qv-add-btn" onClick={handleAddToCart}>
                <ShoppingBag size={18} />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                className={`btn-icon qv-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => {
                  toggleWishlist(product);
                  showToast(
                    isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist!',
                    isWishlisted ? 'info' : 'success'
                  );
                }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} fill={isWishlisted ? '#ec4899' : 'none'} color={isWishlisted ? '#ec4899' : 'currentColor'} />
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="qv-guarantees">
              <div className="guarantee-item">
                <Truck size={15} /> Free Express Shipping Over $50
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={15} /> 2-Year Authentic Warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
