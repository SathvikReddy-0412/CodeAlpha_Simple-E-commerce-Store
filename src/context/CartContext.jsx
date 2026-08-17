import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { productService } from '../services/mockAdapter';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('aura_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const itemColor = selectedColor || (product.colors && product.colors[0]) || 'Default';
    const itemSize = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    const cartItemId = `${product.id}-${itemColor}-${itemSize}`;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity,
            color: itemColor,
            size: itemSize,
            stockCount: product.stockCount
          }
        ];
      }
    });

    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyPromoCode = async (code) => {
    try {
      const coupon = await productService.validateCoupon(code);
      setAppliedCoupon(coupon);
      addToast(`Promo code "${coupon.code}" applied! (${coupon.description})`, 'success');
      return { success: true, coupon };
    } catch (err) {
      addToast(err.message || 'Failed to apply coupon', 'error');
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promo code removed', 'info');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.discountPercent) {
    discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
  }

  const isFreeShipping = subtotal > 100 || (appliedCoupon && appliedCoupon.freeShipping);
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : 10.00);
  const tax = (subtotal - discountAmount) * 0.08; // 8% estimated tax
  const total = Math.max(0, subtotal - discountAmount + shippingFee + tax);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      subtotal,
      discountAmount,
      shippingFee,
      tax,
      total,
      itemCount,
      appliedCoupon,
      applyPromoCode,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
