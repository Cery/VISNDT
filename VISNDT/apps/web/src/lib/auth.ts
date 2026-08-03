/**
 * Auth helpers — cookie-based auth (no localStorage).
 *
 * Authentication is managed via HttpOnly cookies set by the backend.
 * The frontend checks auth status via the /auth/me endpoint.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
}

/**
 * Check if the user is authenticated by calling /auth/me.
 * Returns the user object if authenticated, null otherwise.
 */
export async function checkAuth(): Promise<AuthUser | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/me`,
      { credentials: 'include' },
    );
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}