import { productService as mockProductService, orderService as mockOrderService } from './mockAdapter';

// Fast direct mock services for sub-millisecond instant page loads & option switches
export const authService = {
  async register(name, email, password) {
    return { token: 'mock_jwt_token', user: { id: 'usr-1', name, email } };
  },

  async login(email, password) {
    return { token: 'mock_jwt_token', user: { id: 'usr-1', name: 'Alex Mercer', email } };
  },

  async getMe() {
    return { id: 'usr-1', name: 'Alex Mercer', email: 'alex.mercer@aura.com' };
  }
};

export const productService = {
  async getProducts(params = {}) {
    return mockProductService.getProducts(params);
  },

  async getProductById(id) {
    return mockProductService.getProductById(id);
  },

  async validateCoupon(code) {
    return mockProductService.validateCoupon(code);
  }
};

export const orderService = {
  async createOrder(orderPayload) {
    return mockOrderService.createOrder(orderPayload);
  },

  async getOrders() {
    return mockOrderService.getOrders();
  },

  async getOrderById(id) {
    return mockOrderService.getOrderById(id);
  }
};
