import api from './axios';

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/admin/auth/login', data);

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/admin/dashboard');

// ─── Products ──────────────────────────────────────────────────────────────────
export const adminGetAllProducts = (params) => api.get('/admin/products', { params });
export const adminGetProductById = (id) => api.get(`/admin/products/${id}`);
export const adminCreateProduct = (data) =>
  api.post('/admin/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const adminUpdateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const adminToggleFeatured = (id) => api.patch(`/admin/products/${id}/featured`);

// ─── Orders ────────────────────────────────────────────────────────────────────
export const adminGetAllOrders = (params) => api.get('/admin/orders', { params });
export const adminGetOrderById = (id) => api.get(`/admin/orders/${id}`);
export const adminUpdateOrderStatus = (id, data) => api.patch(`/admin/orders/${id}/status`, data);
export const adminUpdatePaymentStatus = (id, data) => api.patch(`/admin/orders/${id}/payment`, data);

// ─── Customers ─────────────────────────────────────────────────────────────────
export const adminGetAllUsers = (params) => api.get('/user/', { params });
export const adminGetUserById = (id) => api.get(`/user/${id}`);
export const adminToggleUserStatus = (id) => api.patch(`/user/${id}/status`);

// ─── Reviews ───────────────────────────────────────────────────────────────────
export const adminGetAllReviews = (params) => api.get('/admin/reviews', { params });
export const adminModerateReview = (id, data) => api.patch(`/admin/reviews/${id}/moderate`, data);
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);