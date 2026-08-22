/**
 * Auth Service Layer
 *
 * Encapsulates Auth API calls (login, register, logout, refresh) for page-level consumption.
 * Cookie-based auth — no localStorage.
 */
import { apiClient, ApiError } from '@/lib/api-client';

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
 *
 * Return semantics（区分未登录与异常，D1 fix）：
 * - 401（未登录 / 会话过期）→ 返回 null，属正常状态，页面展示登录入口。
 * - 网络异常 / 服务不可用 / 5xx → 抛出错误，由 AuthProvider 呈现错误态与重试，避免误判为“角色未配置”。
 */
export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await apiClient<{ data: AuthUser }>('/auth/me');
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return null;
    }
    throw err;
  }
}
