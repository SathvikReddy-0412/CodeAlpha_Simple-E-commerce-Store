import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import './Cart.css';

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-wrapper container">
        <div className="empty-cart-page glass-card">
          <ShoppingBag size={64} strokeWidth={1.5} className="empty-icon" />
          <h2>Your Cart is Currently Empty</h2>
          <p>You haven't added any products to your shopping bag yet.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Start Shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper container">
      <div className="cart-page-header">
        <h1>Shopping Bag ({cartItems.length} items)</h1>
        <button className="btn btn-secondary btn-sm" onClick={clearCart}>
          Clear Entire Cart
        </button>
      </div>

      <div className="cart-page-grid">
        {/* Items Table / List */}
        <div className="cart-table-container glass-card">
          <div className="cart-table-header">
            <span>Product Details</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span>Action</span>
          </div>

          <div className="cart-table-rows">
            {cartItems.map((item) => (
              <div key={item.cartItemId || item.id} className="cart-row">
                <div className="cart-col-product">
                  <img src={item.image} alt={item.name} className="cart-row-img" />
                  <div>
                    <h3 className="cart-row-title">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <div className="cart-row-tags">
                      {(item.color || item.selectedColor) && <span>Color: {item.color || item.selectedColor}</span>}
                      {(item.size || item.selectedSize) && <span>Size: {item.size || item.selectedSize}</span>}
                    </div>
                  </div>
                </div>

                <div className="cart-col-price">
                  {formatPrice(item.price)}
                </div>

                <div className="cart-col-qty">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}>+</button>
                  </div>
                </div>

                <div className="cart-col-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <div className="cart-col-action">
                  <button className="trash-btn" onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-table-footer">
            <Link to="/shop" className="continue-shopping">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="cart-summary-panel glass-card">
          <h2>Order Summary</h2>

          {/* Promo section */}
          <div className="promo-box">
            {appliedCoupon ? (
              <div className="applied-coupon">
                <div>
                  <Tag size={16} />
                  <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)
                </div>
                <button onClick={removeCoupon}><X size={14} /></button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="promo-form">
                <input
                  type="text"
                  placeholder="Promo Code (SAVE20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="btn btn-secondary">
                  Apply
                </button>
              </form>
            )}
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-item text-success">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="summary-item">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-success">FREE</strong> : formatPrice(shippingFee)}</span>
            </div>
            <div className="summary-item">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-item grand-total">
              <span>Grand Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={() => navigate('/checkout')}>
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
