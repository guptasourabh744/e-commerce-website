import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Users API (Admin only)
export const usersAPI = {
  getAllUsers: (params?: any) => api.get('/auth/users', { params }),
  updateUser: (userId: string, data: any) => api.put(`/auth/users/${userId}`, data),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data: { productId: string; quantity?: number }) =>
    api.post('/cart/items', data),
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/cart/items/${itemId}`, data),
  removeFromCart: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  createOrder: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: any) => api.get('/orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, data: { status: string }) =>
    api.put(`/orders/${id}/status`, data),
  getAllOrders: (params?: any) => api.get('/orders/admin/all', { params }),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data: any) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (data: any) => api.post('/payments/confirm-payment', data),
  createMockPayment: (data: any) => api.post('/payments/mock-payment', data),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data: { email: string }) => api.post('/newsletter/subscribe', data),
  unsubscribe: (data: { email: string }) => api.post('/newsletter/unsubscribe', data),
  getSubscribers: () => api.get('/newsletter/subscribers'),
};

// Reviews API
export const reviewsAPI = {
  createReview: (data: { productId: string; orderId: string; rating: number; comment?: string }) =>
    api.post('/reviews', data),
  getProductReviews: (productId: string, params?: any) =>
    api.get(`/reviews/product/${productId}`, { params }),
  getUserReviews: () => api.get('/reviews/user'),
};

// Contact API
export const contactAPI = {
  submitContactForm: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),
};

// Coupons API
export const couponsAPI = {
  validateCoupon: (data: { code: string; orderAmount: number }) =>
    api.post('/coupons/validate', data),
  getAllCoupons: (params?: any) => api.get('/coupons', { params }),
  createCoupon: (data: any) => api.post('/coupons', data),
  updateCoupon: (id: string, data: any) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
};

export default api;
