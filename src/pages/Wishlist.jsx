import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import './Wishlist.css';

export const Wishlist = () => {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item, 1);
    });
    showToast(`Moved all ${wishlistItems.length} items to your shopping cart!`, 'success');
  };

  if (wishlistCount === 0) {
    return (
      <div className="wishlist-page page-wrapper container">
        <div className="empty-wishlist glass-card">
          <Heart size={64} strokeWidth={1.5} className="empty-icon" />
          <h2>Your Wishlist is Currently Empty</h2>
          <p>Save products you love by clicking the heart icon on any product card.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-wrapper container">
      <div className="wishlist-header">
        <div>
          <h1>Saved Wishlist ({wishlistCount} items)</h1>
          <p className="wishlist-subtitle">Bookmarked items you want to keep track of or buy later.</p>
        </div>

        <div className="wishlist-actions">
          <button className="btn btn-primary" onClick={handleMoveAllToCart}>
            <ShoppingBag size={18} />
            <span>Move All Items to Cart</span>
          </button>
          <button className="btn btn-secondary" onClick={clearWishlist}>
            <Trash2 size={16} />
            <span>Clear Wishlist</span>
          </button>
        </div>
      </div>

      <div className="product-grid">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
