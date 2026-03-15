import api from './axios';

// Get all products with optional filters
export const getAllProducts = (params) => api.get('/products', { params });

// Get products by category
export const getProductsByCategory = (category, params) =>
  api.get(`/products/category/${category}`, { params });

// Get single product
export const getProductById = (id) => api.get(`/products/${id}`);