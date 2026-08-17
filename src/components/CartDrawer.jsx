import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import './CartDrawer.css';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartTotal, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    const success = applyCoupon(code.trim());
    if (success) {
      showToast(`Coupon "${code.toUpperCase()}" applied successfully!`, 'success');
      setCouponInput('');
    } else {
      showToast('Invalid coupon code. Try SAVE20 or FREESHIP.', 'error');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="modal-overlay cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer glass-card animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={22} className="cart-icon" />
            <h3>Your Shopping Cart</h3>
            <span className="cart-item-count">{cartItems.length} Items</span>
          </div>
          <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-bar">
          <div className="fs-text">
            <Truck size={16} />
            {remainingForFreeShipping > 0 ? (
              <span>Add <b>{formatPrice(remainingForFreeShipping)}</b> more for <b>FREE Shipping</b></span>
            ) : (
              <span className="fs-unlocked"><Check size={14} /> You've unlocked <b>FREE Express Shipping!</b></span>
            )}
          </div>
          <div className="fs-track">
            <div className="fs-fill" style={{ width: `${progressToFreeShipping}%` }} />
          </div>
        </div>

        {/* Drawer Body Items */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <ShoppingBag size={56} className="empty-cart-icon" />
              <h4>Your Cart is Empty</h4>
              <p>Looks like you haven't added any products to your shopping cart yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-meta">
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    </div>
                    
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                      
                      <div className="qty-controls-sm">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}>+</button>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Coupon Section */}
            {appliedCoupon ? (
              <div className="applied-coupon-pill">
                <Tag size={15} />
                <span>Coupon: <b>{appliedCoupon.code}</b> ({appliedCoupon.discountPercent}% Off)</span>
                <button onClick={removeCoupon} className="remove-coupon-btn"><X size={14} /></button>
              </div>
            ) : (
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Promo Code (SAVE20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="coupon-drawer-input"
                />
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleApplyCoupon()}
                >
                  Apply
                </button>
              </div>
            )}

            {/* Quick Copy Promo Chips */}
            {!appliedCoupon && (
              <div className="quick-coupons">
                <span>Quick Codes:</span>
                <button className="quick-code-btn" onClick={() => handleApplyCoupon('SAVE20')}>SAVE20 (20%)</button>
                <button className="quick-code-btn" onClick={() => handleApplyCoupon('AURA10')}>AURA10 (10%)</button>
              </div>
            )}

            {/* Subtotal & Total */}
            <div className="drawer-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Estimated Total:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg drawer-checkout-btn" onClick={handleCheckoutClick}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <Link 
              to="/cart" 
              className="view-full-cart-link"
              onClick={() => setIsCartOpen(false)}
            >
              View Full Cart Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
