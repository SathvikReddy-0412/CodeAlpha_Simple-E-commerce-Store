import axios from 'axios';

// Create custom Axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We can inject auth token or custom headers if needed
    const token = localStorage.getItem('aura_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Response Error:', error.response || error.message);
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;
