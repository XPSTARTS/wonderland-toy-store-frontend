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

// ✅ Request interceptor - ADD THIS BACK
api.interceptors.request.use(
  (config) => {
    // Check for token in localStorage (or cookie)
    const token = localStorage.getItem('accessToken');

    // If we have a token, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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