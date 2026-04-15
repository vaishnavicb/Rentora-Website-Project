// Auth Services
import api from './api';

export const authService = {
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  adminRegister: (name, email, password, adminCode) =>
    api.post('/auth/register-admin', { name, email, password, adminCode }),

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Product Services
export const productService = {
  getAllProducts: (page = 1, keyword = '', category = '') =>
    api.get('/products', { params: { page, keyword, category } }),

  getProductsInfinite: (offset = 0, limit = 10, keyword = '', category = '', sort = 'latest') =>
    api.get('/products', { params: { offset, limit, keyword, category, sort } }),

  createProduct: (productData) =>
    api.post('/products', productData),

  getVendorProducts: () =>
    api.get('/products/my-products'),

  getProductById: (id) => api.get(`/products/${id}`),

  updateProduct: (productId, productData) =>
  api.put(`/products/${productId}`, productData),

  deleteProduct: (productId) =>
    api.delete(`/products/${productId}`)
};

// Order Services
export const orderService = {
  createOrder: (productId, startDate, endDate, quantity = 1) =>
    api.post('/orders', { productId, startDate, endDate, quantity }),

  getMyOrders: () =>
    api.get('/orders/my-orders'),

  getVendorOrders: () =>
    api.get('/orders/vendor-orders'),

  updateOrderStatus: (orderId, status) =>
    api.put('/orders/update-status', { orderId, status }),

  returnProduct: (orderId, returnDate) =>
    api.put('/orders/return', { orderId, returnDate }),

  cancelOrder: (orderId) =>
    api.put(`/orders/cancel/${orderId}`)
};

// Review Services
export const reviewService = {
  addReview: (productId, reviewData) =>
    api.post('/reviews', { productId, ...reviewData }),

  getProductReviews: (productId) =>
    api.get(`/reviews/${productId}`),

  deleteReview: (reviewId) =>
    api.delete(`/reviews/${reviewId}`)
};

// Wishlist Services
export const wishlistService = {
  addToWishlist: (productId) =>
    api.post('/wishlist', { productId }),

  getWishlist: () =>
    api.get('/wishlist'),

  removeFromWishlist: (id) =>
    api.delete(`/wishlist/${id}`)
};

// Wallet Services
export const walletService = {
  getBalance: () =>
    api.get('/wallet'),

  addMoney: (amount) =>
    api.post('/wallet/add-money', { amount }),

  withdrawMoney: (amount) =>
    api.post('/wallet/withdraw', { amount })
};

// Grievance Services
export const grievanceService = {
  createGrievance: (orderId, message) =>
    api.post('/grievances', { orderId, message }),

  getCustomerGrievances: () =>
    api.get('/grievances/customer'),

  getVendorGrievances: () =>
    api.get('/grievances/vendor'),

  getGrievanceById: (grievanceId) =>
    api.get(`/grievances/${grievanceId}`),

  getOrderGrievances: (orderId) =>
    api.get(`/grievances/order/${orderId}`),

  respondToGrievance: (grievanceId, payload) =>
    api.put(`/grievances/${grievanceId}/respond`, payload)
};

// Admin Services
export const adminService = {
  getDashboardStats: () =>
    api.get('/admin/dashboard')
};
