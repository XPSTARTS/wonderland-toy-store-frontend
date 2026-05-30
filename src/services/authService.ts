// services/authService.ts (camelCase filename)
import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Use 'any' temporarily to avoid type errors
    const response: any = await api.post('/auth/login', credentials);
    console.log('Login response:', response);
    
    // Store token and user data if they exist
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.email,
        fullName: response.fullName,
        role: response.role
      }));
    }
    
    return response as AuthResponse;
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    const response: any = await api.post('/auth/register', userData);
    console.log('Register response:', response);
    return response;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): any => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'Admin';
  }
};