import { API_BASE_URL, REFRESH_PATH } from './constants';
import { getCsrfToken } from './csrf';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/** Methods that require CSRF protection */
const CSRF_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Endpoints excluded from CSRF (whitelisted in backend) */
const CSRF_EXCLUDED_PATHS = new Set([REFRESH_PATH, '/auth/login', '/auth/register', '/auth/csrf']);

/**
 * Attempt to refresh the access token via the refresh token cookie.
 * Returns true if refresh succeeded, false otherwise.
 */
async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${REFRESH_PATH}`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Centralized API client.
 * - Sends credentials: 'include' for HttpOnly cookie auth.
 * - Auto-refreshes on 401 and retries once.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Attach CSRF token for state-changing requests
  const method = (init.method ?? 'GET').toUpperCase();
  if (CSRF_METHODS.has(method) && !CSRF_EXCLUDED_PATHS.has(endpoint)) {
    try {
      const csrfToken = await getCsrfToken();
      headers['X-CSRF-Token'] = csrfToken;
    } catch {
      // CSRF token fetch failed — proceed without token
      // Backend will reject with 403, which the caller handles
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    credentials: 'include',
  });

  // Auto-refresh on 401 and retry once
  if (response.status === 401 && endpoint !== REFRESH_PATH) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry the original request
      const retryResponse = await fetch(url.toString(), {
        ...init,
        headers,
        credentials: 'include',
      });
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, `Request failed with status ${retryResponse.status}`);
      }
      const data = await retryResponse.json();
      return data as T;
    }
    // Refresh failed — throw so caller can handle logout
    throw new ApiError(401, 'Session expired');
  }

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data as T;
}

export { ApiError };