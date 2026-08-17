import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/backendService';
import { useToast } from './ToastContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const placeOrder = async (orderPayload) => {
    try {
      setLoading(true);
      const createdOrder = await orderService.createOrder(orderPayload);
      setOrders(prev => [createdOrder, ...prev]);
      addToast(`Order ${createdOrder.id} placed successfully!`, 'success');
      return createdOrder;
    } catch (err) {
      addToast('Failed to place order. Please try again.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id) => {
    return await orderService.getOrderById(id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      placeOrder,
      getOrderById,
      refreshOrders: loadOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
