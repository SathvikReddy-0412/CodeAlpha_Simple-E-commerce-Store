import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './Checkout.css';

export const Checkout = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, tax, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Jane Smith',
    email: user ? user.email : 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    street: '124 Conch Street',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    shippingSpeed: 'standard', // 'standard' | 'express'
    paymentMethod: 'card', // 'card' | 'upi' | 'paypal' | 'cod'
    cardNumber: '4532 •••• •••• 8912',
    cardExp: '12/28',
    cardCvc: '888'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="checkout-page page-wrapper container">
        <div className="empty-checkout glass-card">
          <h2>No items to checkout</h2>
          <p>Please add products to your cart before proceeding to checkout.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const expressFee = formData.shippingSpeed === 'express' ? 15 : 0;
    const finalShipping = shippingFee + expressFee;
    const finalTotal = total + expressFee;

    const orderPayload = {
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      },
      shippingSpeed: formData.shippingSpeed === 'express' ? 'Express Delivery (1-2 Days)' : 'Standard Delivery (3-5 Days)',
      paymentMethod: formData.paymentMethod.toUpperCase(),
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color || item.selectedColor,
        size: item.size || item.selectedSize,
        image: item.image
      })),
      subtotal,
      discount: discountAmount,
      shippingFee: finalShipping,
      tax,
      total: finalTotal
    };

    try {
      const createdOrder = await placeOrder(orderPayload);
      clearCart();
      navigate(`/orders/${createdOrder.id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page page-wrapper container">
      {/* Checkout Wizard Header */}
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
        <div className="checkout-steps-bar">
          <div className={`step-tab ${step >= 1 ? 'active' : ''}`}>1. Address</div>
          <div className="step-arrow">→</div>
          <div className={`step-tab ${step >= 2 ? 'active' : ''}`}>2. Shipping</div>
          <div className="step-arrow">→</div>
          <div className={`step-tab ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
        </div>
      </div>

      <div className="checkout-grid">
        {/* Step Forms */}
        <div className="checkout-form-container glass-card">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="step-form animate-fade-in">
              <div className="step-title">
                <MapPin className="icon" size={22} />
                <h2>Shipping & Contact Information</h2>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg step-next-btn">
                <span>Continue to Shipping Method</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: SHIPPING METHOD */}
          {step === 2 && (
            <div className="step-form animate-fade-in">
              <div className="step-title">
                <Truck className="icon" size={22} />
                <h2>Select Shipping Method</h2>
              </div>

              <div className="shipping-options-list">
                <label className={`option-card ${formData.shippingSpeed === 'standard' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingSpeed"
                    value="standard"
                    checked={formData.shippingSpeed === 'standard'}
                    onChange={handleInputChange}
                  />
                  <div className="option-details">
                    <strong>Standard Delivery (3-5 Business Days)</strong>
                    <p>Tracked parcel delivery to your doorstep.</p>
                  </div>
                  <span className="option-price">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </label>

                <label className={`option-card ${formData.shippingSpeed === 'express' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingSpeed"
                    value="express"
                    checked={formData.shippingSpeed === 'express'}
                    onChange={handleInputChange}
                  />
                  <div className="option-details">
                    <strong>Priority Air Express (1-2 Business Days)</strong>
                    <p>Includes priority handling & signature on delivery.</p>
                  </div>
                  <span className="option-price">{formatPrice(15.00)}</span>
                </label>
              </div>

              <div className="wizard-actions">
                <button className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="step-form animate-fade-in">
              <div className="step-title">
                <CreditCard className="icon" size={22} />
                <h2>Payment Details</h2>
              </div>

              <div className="payment-methods-grid">
                <button
                  type="button"
                  className={`pm-btn ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  type="button"
                  className={`pm-btn ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                >
                  ⚡ Instant UPI / Wallet
                </button>
                <button
                  type="button"
                  className={`pm-btn ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                >
                  🅿️ PayPal
                </button>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-fields-box">
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="4532 •••• •••• 8912"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">Security CVC</label>
                      <input
                        type="password"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="form-input"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="security-notice">
                <Lock size={16} />
                <span>256-bit Encrypted SSL Gateway. Your payment is 100% safe & protected.</span>
              </div>

              <div className="wizard-actions">
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary btn-lg flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing Order...' : `Pay ${formatPrice(total + (formData.shippingSpeed === 'express' ? 15 : 0))}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary-sidebar glass-card">
          <h3>Order Review</h3>

          <div className="mini-items-list">
            {cartItems.map((item) => (
              <div key={item.cartItemId || item.id} className="mini-item">
                <img src={item.image} alt={item.name} className="mini-img" />
                <div className="mini-details">
                  <strong>{item.name}</strong>
                  <span className="mini-meta">Qty: {item.quantity} {item.color && item.color !== 'Default' ? `• ${item.color}` : ''}</span>
                </div>
                <span className="mini-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row text-success">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping ({formData.shippingSpeed})</span>
              <span>{formatPrice(shippingFee + (formData.shippingSpeed === 'express' ? 15 : 0))}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Total Payable</span>
              <span>{formatPrice(total + (formData.shippingSpeed === 'express' ? 15 : 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
