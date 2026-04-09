import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
const authBaseUrl = import.meta.env.VITE_AUTH_URL || '/auth';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = axios.create({
  baseURL: authBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every authenticated request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global error handler
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    console.warn('Session expired. Please login again.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
