import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { QuickViewModal } from './QuickViewModal';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist!',
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="product-card glass-card">
        {/* Card Image Container */}
        <div className="card-image-wrapper">
          <Link to={`/product/${product.id}`} className="card-image-link">
            <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
          </Link>

          {/* Badges */}
          <div className="card-badges">
            {discountPercent > 0 && (
              <span className="card-badge discount-badge">-{discountPercent}%</span>
            )}
            {product.badge && (
              <span className="card-badge tag-badge">{product.badge}</span>
            )}
          </div>

          {/* Hover Overlay Action Bar */}
          <div className="card-overlay-actions">
            <button 
              className="action-btn qv-btn" 
              onClick={handleOpenQuickView}
              title="Quick View"
            >
              <Eye size={18} />
              <span>Quick View</span>
            </button>
            
            <button 
              className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleToggleWishlist}
              title={isWishlisted ? 'Remove Wishlist' : 'Add Wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? '#ec4899' : 'none'} color={isWishlisted ? '#ec4899' : 'currentColor'} />
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="card-details">
          <div className="card-category-row">
            <span className="card-category">{product.category}</span>
            <div className="card-rating">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="card-title-link">
            <h3 className="card-title">{product.name}</h3>
          </Link>

          <div className="card-price-row">
            <div className="price-group">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <button 
              className="card-add-cart-btn"
              onClick={handleAddToCart}
              title="Add to Shopping Cart"
            >
              <ShoppingBag size={17} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal 
          product={product} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      )}
    </>
  );
};
