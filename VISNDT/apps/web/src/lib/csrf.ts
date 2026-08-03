import { API_BASE_URL } from './constants';

/**
 * CSRF token cached in memory.
 * NOT stored in localStorage or sessionStorage — XSS-safe.
 */
let csrfToken: string | null = null;
let fetchPromise: Promise<string> | null = null;

/**
 * Get a CSRF token for Double Submit Cookie pattern.
 *
 * 1. Returns cached token if available
 * 2. Otherwise fetches from GET /auth/csrf
 * 3. Caches token in memory
 * 4. Returns token
 *
 * The backend sets `csrf_token` cookie (httpOnly: false) and returns
 * the same token in the response body. Client must send it back as
 * X-CSRF-Token header for state-changing requests.
 */
export async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  // Deduplicate concurrent fetches
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/csrf`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`CSRF token fetch failed: ${res.status}`);
      }

      const data = await res.json();
      csrfToken = data?.data?.csrfToken ?? data?.csrfToken ?? null;

      if (!csrfToken) {
        throw new Error('CSRF token not found in response');
      }

      return csrfToken;
    } catch (error) {
      // Reset on failure so next call can retry
      fetchPromise = null;
      throw error;
    }
  })();

  return fetchPromise;
}

/**
 * Clear the cached CSRF token.
 * Call after logout or when token is invalidated.
 */
export function clearCsrfToken(): void {
  csrfToken = null;
  fetchPromise = null;
}