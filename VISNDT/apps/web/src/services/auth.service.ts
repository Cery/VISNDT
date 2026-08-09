/**
 * Auth Service Layer
 *
 * Encapsulates Auth API calls (login, register, logout, refresh) for page-level consumption.
 * Cookie-based auth — no localStorage.
 */
import { apiClient } from '@/lib/api-client';

// --- Types ---

export type WorkspaceRole = 'SUPPLIER' | 'BUYER' | null;

export interface AuthOrganization {
  id: string;
  name: string;
  type: string;
}

export interface AuthOrganizationMember {
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
  organization: AuthOrganization | null;
  organizationMember: AuthOrganizationMember | null;
  workspaceRole: WorkspaceRole;
}

export interface AuthResponse {
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
 * Backend sets HttpOnly cookies (access_token, refresh_token).
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Register a new user.
 * POST /auth/register
 * Backend sets HttpOnly cookies (access_token, refresh_token).
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient<{ data: AuthResponse }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Logout: call backend to revoke refresh token, then clear cookies.
 * POST /auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
  } catch {
    // Ignore errors — cookies will be cleared by backend regardless
  }
}

/**
 * Get current user from /auth/me.
 */
export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await apiClient<{ data: AuthUser }>('/auth/me');
    return res.data;
  } catch {
    return null;
  }
}
