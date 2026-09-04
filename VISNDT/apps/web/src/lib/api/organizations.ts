import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type { Organization } from '@/types/organization';

/**
 * Get public organization information.
 * GET /organizations/:id
 */
export async function getOrganization(id: string): Promise<Organization> {
  const res = await apiClient<ApiResponse<Organization>>(
    `/organizations/${id}`,
  );
  return res.data;
}

/**
 * Update organization information (self-service for members).
 * PATCH /organizations/:id
 * Only allows name, type for non-admin users.
 */
export async function updateOrganization(
  id: string,
  data: { name?: string; type?: string },
): Promise<Organization> {
  const res = await apiClient<ApiResponse<Organization>>(
    `/organizations/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
  return res.data;
}

// ── M35 Supplier Multi-user ──────────────────────────────────────────────
// 复用 OrganizationMember / User 现有承载；OrganizedMember 角色展示。
// 不创建新 Entity / Schema / API 子系统。

export interface OrganizationMemberUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface OrganizationMemberItem {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  user: OrganizationMemberUser;
}

/**
 * List members of an organization.
 * GET /organizations/:id/members
 * 供应商工作台仅用当前登录组织的 organizationId 读取其成员，保持组织范围可见性。
 */
export async function getOrganizationMembers(id: string): Promise<OrganizationMemberItem[]> {
  const res = await apiClient<ApiResponse<OrganizationMemberItem[]>>(
    `/organizations/${id}/members`,
  );
  return res.data;
}

/**
 * Create a user invitation for the caller's organization.
 * POST /auth/invitations （复用既有邀请架构；仅 ADMIN 组织成员可调用）
 * M35 Supplier Multi-user Invitation —— 仅补齐 Web 调用，不新增邀请域。
 */
export interface CreateInvitationInput {
  email: string;
  role?: 'ADMIN' | 'MEMBER';
}

export async function createOrganizationInvitation(
  input: CreateInvitationInput,
): Promise<{ email: string; role: string; status: string; expiresAt: string }> {
  const res = await apiClient<ApiResponse<{ email: string; role: string; status: string; expiresAt: string }>>(
    '/auth/invitations',
    {
      method: 'POST',
      body: JSON.stringify({ email: input.email, role: input.role ?? 'MEMBER' }),
    },
  );
  return res.data;
}

/**
 * Change an existing member's role within an organization.
 * PATCH /organizations/:id/members/:memberId/role （复用 OrganizationMember 现有 role 语义；仅 ADMIN）
 * M35 Basic Role Management —— 复用现有角色，不建立第二套权限系统。
 */
export async function updateOrganizationMemberRole(
  id: string,
  memberId: string,
  role: 'ADMIN' | 'MEMBER',
): Promise<OrganizationMemberItem> {
  const res = await apiClient<ApiResponse<OrganizationMemberItem>>(
    `/organizations/${id}/members/${memberId}/role`,
    {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    },
  );
  return res.data;
}