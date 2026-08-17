import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Calendar, ChevronRight, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/formatters';
import './Orders.css';

export const Orders = () => {
  const { orders, loading } = useOrders();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-page page-wrapper container">
      <div className="orders-header">
        <div>
          <h1>My Orders & Tracking</h1>
          <p className="orders-subtitle">Manage, view details, and track real-time delivery status for all your purchases.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="orders-controls glass-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. ORD-98421) or item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-tabs">
          <button
            className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`status-tab ${statusFilter === 'processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('processing')}
          >
            Processing
          </button>
          <button
            className={`status-tab ${statusFilter === 'delivered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="orders-loading">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading your order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders glass-card">
          <Package size={54} strokeWidth={1.5} className="empty-icon" />
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders matching this search filter yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card glass-card">
              <div className="order-card-header">
                <div className="order-meta-info">
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">
                    <Calendar size={14} /> {formatDate(order.date)}
                  </span>
                </div>

                <div className="order-header-right">
                  <span className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </span>
                  <span className="order-total-price">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-thumb-row">
                    <img src={item.image} alt={item.name} className="thumb-img" />
                    <div className="thumb-info">
                      <strong>{item.name}</strong>
                      <span>Qty: {item.quantity} {item.color ? `• ${item.color}` : ''}</span>
                    </div>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span className="delivery-est">
                  Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
                </span>

                <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                  <span>View Details & Invoice</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
