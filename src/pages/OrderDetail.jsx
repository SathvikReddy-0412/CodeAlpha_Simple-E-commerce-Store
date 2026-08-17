import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Printer, MapPin, CreditCard, Calendar, PackageCheck, RefreshCw } from 'lucide-react';
import { orderService } from '../services/mockAdapter';
import { OrderTracker } from '../components/OrderTracker';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/formatters';
import './OrderDetail.css';

export const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="page-wrapper container detail-loading">
        <RefreshCw className="spin-icon" size={36} />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-wrapper container detail-error">
        <h2>Order Not Found</h2>
        <p>{error || "Could not retrieve details for this order number."}</p>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Back to Orders List
        </button>
      </div>
    );
  }

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="order-detail-page page-wrapper container">
      {/* Top Header Controls */}
      <div className="no-print detail-top-bar">
        <button className="back-link-btn" onClick={() => navigate('/orders')}>
          <ArrowLeft size={16} />
          <span>Back to All Orders</span>
        </button>

        <button className="btn btn-secondary" onClick={handlePrintReceipt}>
          <Printer size={18} />
          <span>Print Tax Invoice</span>
        </button>
      </div>

      {/* Invoice Receipt Container */}
      <div className="printable-receipt glass-card">
        <div className="receipt-header">
          <div>
            <span className="receipt-brand">AURA PLATFORM</span>
            <h1 className="receipt-id">Order Summary #{order.id}</h1>
            <span className="receipt-date">Placed on {formatDate(order.date)}</span>
          </div>

          <div className="status-box">
            <span className="status-title">Status</span>
            <span className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Visual Progress Tracker (hidden during print) */}
        <div className="no-print tracker-container">
          <OrderTracker currentStep={order.step || 2} status={order.status} />
        </div>

        {/* Info Grid: Shipping & Payment */}
        <div className="info-cards-grid">
          <div className="info-card">
            <div className="card-title">
              <MapPin size={18} className="icon" />
              <h3>Shipping Destination</h3>
            </div>
            <p><strong>{order.shippingAddress.fullName}</strong></p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
          </div>

          <div className="info-card">
            <div className="card-title">
              <CreditCard size={18} className="icon" />
              <h3>Payment & Delivery</h3>
            </div>
            <p>Payment Method: <strong>{order.paymentMethod}</strong></p>
            <p>Shipping Speed: <strong>{order.shippingSpeed || 'Standard Delivery'}</strong></p>
            <p>Estimated Delivery: <strong>{order.estimatedDelivery}</strong></p>
          </div>
        </div>

        {/* Items Table */}
        <div className="receipt-items-table">
          <div className="table-head">
            <span>Item Description</span>
            <span>Unit Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          <div className="table-body">
            {order.items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="item-info-col">
                  <img src={item.image} alt={item.name} className="item-receipt-img no-print" />
                  <div>
                    <strong>{item.name}</strong>
                    <div className="item-meta">
                      {item.color && item.color !== 'Default' && <span>Color: {item.color}</span>}
                      {item.size && item.size !== 'Standard' && <span>Size: {item.size}</span>}
                    </div>
                  </div>
                </div>

                <span>{formatPrice(item.price)}</span>
                <span>{item.quantity}</span>
                <span className="row-total">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="receipt-summary-footer">
          <div className="summary-col">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-line text-success">
                <span>Discount Applied:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="summary-line">
              <span>Estimated Tax (8%):</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="summary-line grand-total-line">
              <span>Grand Total Paid:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
