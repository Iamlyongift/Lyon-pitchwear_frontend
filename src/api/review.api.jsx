import api from './axios';

// Get reviews for a product (public)
export const getProductReviews = (productId, params) =>
  api.get(`/reviews/product/${productId}`, { params });

// Submit a review
export const submitReview = (data) => api.post('/reviews', data);

// Get my reviews
export const getMyReviews = () => api.get('/reviews/my-reviews');

// Update my review
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);

// Delete my review
export const deleteReview = (id) => api.delete(`/reviews/${id}`);