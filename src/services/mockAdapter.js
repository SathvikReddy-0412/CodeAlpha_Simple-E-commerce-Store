import api from './api';
import { PRODUCTS, PROMO_CODES } from './productsData';

// Simulated delay helper
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage helpers for Orders
const ORDERS_KEY = 'aura_orders_db';

const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [
      {
        id: "ORD-98421",
        date: "2026-07-18T14:32:00Z",
        status: "Delivered",
        step: 4,
        shippingAddress: {
          fullName: "John Doe",
          street: "742 Evergreen Terrace",
          city: "Springfield",
          postalCode: "97477",
          country: "United States"
        },
        paymentMethod: "Credit Card",
        items: [
          {
            id: "prod-1",
            name: "Aura Pro Wireless Noise-Canceling Headphones",
            price: 249.99,
            quantity: 1,
            color: "Space Black",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
          }
        ],
        subtotal: 249.99,
        discount: 0,
        shippingFee: 0,
        tax: 20.00,
        total: 269.99,
        estimatedDelivery: "2026-07-21"
      }
    ];
  } catch (e) {
    return [];
  }
};

const saveStoredOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// API Services exposing clean asynchronous methods wrapping Axios/mock requests
export const productService = {
  async getProducts(params = {}) {
    await delay();
    let result = [...PRODUCTS];

    // 1. Search Query Filter
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (params.category && params.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }

    // 3. Price Filter
    if (params.maxPrice) {
      result = result.filter(p => p.price <= Number(params.maxPrice));
    }

    // 4. Rating Filter
    if (params.minRating) {
      result = result.filter(p => p.rating >= Number(params.minRating));
    }

    // 5. In Stock Only
    if (params.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // 6. Sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          result.sort((a, b) => b.id.localeCompare(a.id));
          break;
      }
    }

    return { products: result, total: result.length };
  },

  async getProductById(id) {
    await delay();
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    return product;
  },

  async validateCoupon(code) {
    await delay(100);
    const formattedCode = code.trim().toUpperCase();
    const coupon = PROMO_CODES[formattedCode];
    if (!coupon) {
      throw new Error("Invalid promo code. Try SAVE20 or AURA10!");
    }
    return { code: formattedCode, ...coupon };
  }
};

export const orderService = {
  async createOrder(orderPayload) {
    await delay(300);
    const existingOrders = getStoredOrders();
    
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      status: "Processing",
      step: 2, // 1: Placed, 2: Processing, 3: Shipped, 4: Delivered
      ...orderPayload,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const updatedOrders = [newOrder, ...existingOrders];
    saveStoredOrders(updatedOrders);
    return newOrder;
  },

  async getOrders() {
    await delay(150);
    return getStoredOrders();
  },

  async getOrderById(id) {
    await delay(150);
    const orders = getStoredOrders();
    const order = orders.find(o => o.id === id);
    if (!order) {
      throw new Error(`Order ${id} not found.`);
    }
    return order;
  }
};
