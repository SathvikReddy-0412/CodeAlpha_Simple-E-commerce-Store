import express from 'express';
import { query, getOne, run } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aura_ecommerce_secret_key_2026';

// Helper middleware to extract user if token present (optional auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

// POST /api/orders
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      tax = 0,
      total
    } = req.body;

    if (!items || !items.length || !shippingAddress || !total) {
      return res.status(400).json({ message: 'Invalid order payload. Items and shipping address are required.' });
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const userId = req.user ? req.user.id : null;
    const userName = shippingAddress.fullName || (req.user ? req.user.name : 'Guest Customer');
    const userEmail = shippingAddress.email || (req.user ? req.user.email : 'guest@example.com');
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await run(
      `INSERT INTO orders 
      (id, user_id, user_name, user_email, shipping_address, payment_method, items, subtotal, discount, shipping_fee, tax, total, status, step, estimated_delivery)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        userName,
        userEmail,
        JSON.stringify(shippingAddress),
        paymentMethod || 'Credit Card',
        JSON.stringify(items),
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        'Processing',
        2,
        estimatedDelivery
      ]
    );

    const createdOrder = {
      id: orderId,
      userId,
      userName,
      userEmail,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      items,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      status: 'Processing',
      step: 2,
      date: new Date().toISOString(),
      estimatedDelivery
    };

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Server error creating order' });
  }
});

// GET /api/orders
router.get('/', optionalAuth, async (req, res) => {
  try {
    let sql = 'SELECT * FROM orders ORDER BY date DESC';
    let params = [];

    if (req.user) {
      sql = 'SELECT * FROM orders WHERE user_id = ? OR user_email = ? ORDER BY date DESC';
      params = [req.user.id, req.user.email];
    }

    const rows = await query(sql, params);

    const orders = rows.map(o => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      userEmail: o.user_email,
      shippingAddress: JSON.parse(o.shipping_address),
      paymentMethod: o.payment_method,
      items: JSON.parse(o.items),
      subtotal: o.subtotal,
      discount: o.discount,
      shippingFee: o.shipping_fee,
      tax: o.tax,
      total: o.total,
      status: o.status,
      step: o.step,
      date: o.date,
      estimatedDelivery: o.estimated_delivery
    }));

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const o = await getOne('SELECT * FROM orders WHERE id = ?', [id]);

    if (!o) {
      return res.status(404).json({ message: `Order ${id} not found.` });
    }

    const order = {
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      userEmail: o.user_email,
      shippingAddress: JSON.parse(o.shipping_address),
      paymentMethod: o.payment_method,
      items: JSON.parse(o.items),
      subtotal: o.subtotal,
      discount: o.discount,
      shippingFee: o.shipping_fee,
      tax: o.tax,
      total: o.total,
      status: o.status,
      step: o.step,
      date: o.date,
      estimatedDelivery: o.estimated_delivery
    };

    return res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ message: 'Server error fetching order' });
  }
});

export default router;
