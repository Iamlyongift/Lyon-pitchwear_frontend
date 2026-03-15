import api from './axios';

// Place an order
export const placeOrder = (data) => api.post('/orders', data);

// Get my orders
export const getMyOrders = (params) => api.get('/orders/my-orders', { params });

// Get single order
export const getMyOrderById = (id) => api.get(`/orders/my-orders/${id}`);

// Cancel order
export const cancelOrder = (id) => api.patch(`/orders/my-orders/${id}/cancel`);