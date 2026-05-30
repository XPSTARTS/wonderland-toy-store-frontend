import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const response = await api.post<AuthResponse>('/auth/login', credentials);
                    // axios interceptor in src/services/api.ts already returns response.data
                    const { token, email, fullName, role } = response as any;


                    // console.log('🔐 Login response:', { token: token?.substring(0, 50), email, fullName, role });

                    // Save token to localStorage
                    localStorage.setItem('token', token);

                    set({
                        user: {
                            id: 0,
                            email,
                            fullName,
                            role,
                            createdAt: new Date().toISOString(),
                        },
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    console.log('✅ Auth state updated, token saved');
                } catch (error: any) {
                    console.error('Login error raw:', error);
                    console.error('Login error details:', {
                        url: error?.config?.url,
                        method: error?.config?.method,
                        status: error?.response?.status,
                        responseData: error?.response?.data,
                        message: error?.message,
                    });

                    set({ isLoading: false });
                    throw new Error(error?.response?.data?.message || error?.message || 'Login failed');
                }

            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    await api.post('/auth/register', userData);
                    set({ isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || 'Registration failed');
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            checkAuth: () => {
                const token = localStorage.getItem('token');
                if (token && !get().isAuthenticated) {
                    // Optionally verify token with backend
                    return true;
                }
                return get().isAuthenticated;
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);