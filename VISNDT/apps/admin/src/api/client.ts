import axios from 'axios';
import { authStore } from '../stores/auth.store';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * In-memory CSRF token — fetched once on app init and reused.
 * Cookie-based fallback is less reliable through Vite proxy.
 */
let _csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  _csrfToken = token;
}

function getCsrfToken(): string | null {
  // Primary: in-memory token set by initCsrfToken()
  if (_csrfToken) return _csrfToken;

  // Fallback: try reading the cookie (set by GET /auth/csrf)
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Request interceptor: inject Authorization header + CSRF token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = authStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Inject CSRF token for state-changing requests
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
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