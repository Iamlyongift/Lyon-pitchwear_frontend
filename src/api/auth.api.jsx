import api from './axios';

// Register new user
export const registerUser = (data) => api.post('/auth/register', data);

// Login user
export const loginUser = (data) => api.post('/auth/login', data);

// Forgot password
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);

// Reset password
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// Get my profile
export const getMyProfile = () => api.get('/user/me');

// Update my profile
export const updateMyProfile = (data) => api.put('/user/me', data);

// Change password
export const changePassword = (data) => api.patch('/user/me/change-password', data);