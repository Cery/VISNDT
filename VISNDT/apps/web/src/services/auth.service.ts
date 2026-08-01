/**
 * Auth Service Layer
 *
 * Encapsulates Auth API calls (login, register, logout) for page-level consumption.
 */
import { apiClient } from '@/lib/api-client';
import { setToken, removeToken, setCurrentUser, removeCurrentUser } from '@/lib/auth';

// --- Types ---

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  inviteToken?: string;
}

// --- Public API ---

/**
 * Login with email and password.
 * POST /auth/login
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const { accessToken, user } = res.data;
  setToken(accessToken);
  setCurrentUser(user);

  return res.data;
}

/**
 * Register a new user.
 * POST /auth/register
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient<{ data: AuthResponse }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const { accessToken, user } = res.data;
  setToken(accessToken);
  setCurrentUser(user);

  return res.data;
}

/**
 * Logout: clear stored token and user.
 */
export function logout(): void {
  removeToken();
  removeCurrentUser();
}