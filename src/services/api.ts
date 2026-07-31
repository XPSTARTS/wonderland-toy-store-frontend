// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7069/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor
api.interceptors.request.use(
  (config) => {
    // We do NOT need to add Authorization header manually.
    // The browser sends the HttpOnly cookie automatically.
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔴 401 Unauthorized - Token may be expired');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;