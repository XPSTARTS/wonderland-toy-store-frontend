// services/api.ts
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5248/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - adds token for all non-public endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const url = config.url || '';
    
    // Public endpoints that don't need token
    const isPublicEndpoint = 
      url === '/products' && config.method === 'get' ||
      url?.startsWith('/products?') && config.method === 'get' ||
      url?.match(/\/products\/\d+$/) && config.method === 'get' ||
      url === '/auth/login' ||
      url === '/auth/register';
    
    // Add token for all non-public requests
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token added for:', config.method?.toUpperCase(), url);
    } else {
      console.log('🔓 Public request:', config.method?.toUpperCase(), url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;