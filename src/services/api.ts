// services/api.ts
import axios from 'axios';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7069/api';

// const API_URL = 'https://localhost:7069';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Track if token refresh is in progress
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    const url = config.url || '';
    
    const isPublicEndpoint = 
      url === '/auth/login' ||
      url === '/auth/register' ||
      url === '/auth/refresh-token' ||
      (url === '/products' && config.method === 'get') ||
      (url?.startsWith('/products?') && config.method === 'get');
    
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If not 401 or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      // Show error message
      const message = error.response?.data?.message || error.message;
      return Promise.reject(new Error(message));
    }

    // Mark as retried
    originalRequest._retry = true;

    // If refresh is in progress, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const response = await authService.refreshToken();
      
      if (response) {
        const newToken = response.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Retry the original request
        return api(originalRequest);
      } else {
        // Refresh failed
        processQueue(error, null);
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;