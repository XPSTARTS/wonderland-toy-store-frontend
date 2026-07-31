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
api.interceptors.response.use(
  (response) => {
    // ✅ SAFE RETURN: return the whole response, but we'll pick data in the store
    return response; 
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔴 401 Unauthorized - Token may be expired');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
    }
    return Promise.reject(error);
  }
);

// Response interceptor
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