// services/api.ts
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5248/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - adds token for protected endpoints only
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    // Don't add token for public product endpoints
    const isPublicEndpoint = url === '/products' || 
                             url.startsWith('/products?') || 
                             url === '/products/' ||
                             url.startsWith('/products/');
    
    const token = localStorage.getItem('token');
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - returns ONLY the data
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log(`API Response: ${response.config.url} - Status: ${response.status}`);
    // ✅ IMPORTANT: Return response.data directly
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