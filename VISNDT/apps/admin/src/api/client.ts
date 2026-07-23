import axios from 'axios';
import { authStore } from '../stores/auth.store';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject Authorization header
apiClient.interceptors.request.use((config) => {
  const { accessToken } = authStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: unwrap data + handle 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Skip redirect for login endpoint — allow Login page to show error
      const isLoginRequest = error.config?.url === '/auth/login';
      if (!isLoginRequest) {
        authStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);