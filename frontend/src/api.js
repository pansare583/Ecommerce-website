import axios from 'axios';

// Use relative base URLs — Vite proxy routes them to http://localhost:8080
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = axios.create({
  baseURL: '/auth',
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
