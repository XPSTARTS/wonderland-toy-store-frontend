import api from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  TwoFactorResponse, 
  User 
} from '../types';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse | TwoFactorResponse> => {
    try {
      const response: any = await api.post('/auth/login', credentials);
      
      // Handle 2FA
      if (response.requiresTwoFactor) {
        return response as TwoFactorResponse;
      }
      
      // ✅ JSON body might be empty. The token is in the cookie.
      // But we still need the user info.
      if (response.email && response.fullName && response.role) {
        localStorage.setItem(USER_KEY, JSON.stringify({
          email: response.email,
          fullName: response.fullName,
          role: response.role
        }));
      }
      
      // ✅ Force the auth state to update
      window.dispatchEvent(new Event('auth-change'));
      
      return response as AuthResponse;
    } catch (error: any) {
      throw error;
    }
  },

  // Register
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse | null> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const response: any = await api.post('/auth/refresh-token', { refreshToken });
      
      if (response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        return response as AuthResponse;
      }
      return null;
    } catch (error) {
      authService.logout();
      return null;
    }
  },

    // ✅ NEW: Verify 2FA code
  verifyTwoFactor: async (data: { email: string; code: string }): Promise<AuthResponse> => {
    const response: any = await api.post('/auth/2fa/verify', data);
    
    if (response.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify({
        email: response.email,
        fullName: response.fullName,
        role: response.role
      }));
    }
    return response as AuthResponse;
  },

  // ✅ NEW: Resend 2FA code
  sendTwoFactorCode: async (email: string): Promise<void> => {
    await api.post('/auth/2fa/send', { email });
  },

  // Revoke token
  revokeToken: async (): Promise<void> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await api.post('/auth/revoke-token', { refreshToken });
      } catch (error) {
        console.error('Failed to revoke token:', error);
      }
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await authService.revokeToken();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    // If we have user data, assume we are logged in
    return !!localStorage.getItem(USER_KEY);
  },
  // Check if admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'Admin';
  }
};