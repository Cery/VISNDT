import axios from 'axios';
import { authStore } from '../stores/auth.store';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extract the actual error message from an axios error response.
 * The backend wraps messages in { success, data, message, timestamp }.
 * Falls back to the generic error message if unavailable.
 */
export function extractErrorMessage(err: unknown, fallback = '操作失败'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

/**
 * In-memory CSRF token — fetched on demand via GET /auth/csrf.
 * Double-submit cookie pattern: the backend sets the same token both as the
 * `csrf_token` cookie and in the response body; the client must echo it back
 * via the X-CSRF-Token header on state-changing requests.
 */
let _csrfToken: string | null = null;
let _csrfFetchPromise: Promise<string | null> | null = null;

export function setCsrfToken(token: string | null) {
  _csrfToken = token;
}

function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getCsrfToken(): string | null {
  if (_csrfToken) return _csrfToken;
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) _csrfToken = cookieToken;
  return cookieToken;
}

/**
 * Ensure a CSRF token is available, fetching from /auth/csrf if needed.
 * Deduplicated: concurrent callers share a single fetch (avoids header/cookie
 * diverging under React StrictMode double-invocation of effects).
 */
export async function ensureCsrfToken(): Promise<string | null> {
  const existing = getCsrfToken();
  if (existing) return existing;

  if (_csrfFetchPromise) return _csrfFetchPromise;

  _csrfFetchPromise = (async () => {
    try {
      const res = (await apiClient.get('/auth/csrf')) as {
        data?: { csrfToken?: string };
      };
      const token = res?.data?.csrfToken ?? null;
      setCsrfToken(token);
      return token;
    } catch {
      return null;
    } finally {
      _csrfFetchPromise = null;
    }
  })();

  return _csrfFetchPromise;
}

// Request interceptor: inject Authorization header + CSRF token
apiClient.interceptors.request.use(async (config) => {
  const { accessToken } = authStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Inject CSRF token for state-changing requests
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = (await ensureCsrfToken()) ?? getCsrfToken();
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