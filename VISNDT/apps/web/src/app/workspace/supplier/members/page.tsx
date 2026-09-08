'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import {
  getOrganizationMembers,
  createInvitation,
  updateMemberRole,
} from '@/services/organization.service';
import type { OrganizationMemberItem } from '@/lib/api/organizations';

/**
 * M35 Supplier Multi-user — 成员管理（复用 Organization/OrganizationMember/User/UserInvitation 现有承载）。
 * 提供：成员列表 + 角色展示 +（ADMIN 可见）邀请成员 + 基础角色管理。
 * 仅操作当前登录组织的成员与角色，保持组织作用域可见性与既有授权语义。
 * 不创建 SupplierUser / Sales Entity / 第二套权限架构 / 新 Domain。
 */

function formatDateTime(value?: string | null) {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: '管理员',
  MEMBER: '成员',
};

function roleLabel(role: string): string {
  return ROLE_LABEL[role] ?? '未知角色';
}

function roleTone(role: string): string {
  if (role === 'ADMIN') return 'bg-industrial-cyan/10 text-industrial-cyan border-industrial-cyan/20';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function MembersContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const organizationId = user?.organizationId;

  const membersQuery = useQuery({
    queryKey: ['organization', organizationId, 'members'],
    queryFn: () => getOrganizationMembers(organizationId!),
    enabled: !!organizationId,
  });

  const members = membersQuery.data ?? [];

  // 当前用户是否组织管理员（JWT 成员角色优先，兜底成员列表匹配）
  const isAdmin =
    user?.organizationMember?.role === 'ADMIN' ||
    members.some((m) => m.userId === user?.id && m.role === 'ADMIN');

  let adminCount = 0;
  for (const m of members) {
    if (m.role === 'ADMIN') adminCount += 1;
  }
  const summary = { total: members.length, adminCount };

  // ── Invite（复用既有邀请 API：POST /auth/invitations，仅 ADMIN）──
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const inviteMutation = useMutation({
    mutationFn: () =>
      createInvitation({ email: inviteEmail.trim(), role: inviteRole }),
    onSuccess: () => {
      setInviteMsg('邀请已创建。受邀人需通过注册页使用邀请注册以加入组织。');
      setInviteError(null);
      setInviteEmail('');
      setInviteRole('MEMBER');
      setInviteOpen(false);
    },
    onError: (error: Error) => {
      setInviteError(error.message || '创建邀请失败，请稍后重试。');
    },
  });

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      setInviteError('请输入有效的邮箱。');
      return;
    }
    setInviteMsg(null);
    setInviteError(null);
    inviteMutation.mutate();
  };

  // ── Role management（PATCH /organizations/:id/members/:memberId/role，仅 ADMIN）──
  const roleMutation = useMutation({
    mutationFn: (vars: { memberId: string; role: 'ADMIN' | 'MEMBER' }) =>
      updateMemberRole(organizationId!, vars.memberId, vars.role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['organization', organizationId, 'members'] });
    },
  });

  const handleRoleChange = (member: OrganizationMemberItem, role: 'ADMIN' | 'MEMBER') => {
    if (role === member.role) return;
    roleMutation.mutate({ memberId: member.id, role });
  };

  if (!organizationId) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]">
          <EmptyState message="未关联组织，无法查看成员。" />
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">组织成员</h1>
            <p className="mt-1 text-sm text-slate-500">
              管理您所在组织的成员与角色，保持组织作用域下的可见性。仅展示当前组织成员。
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setInviteOpen((v) => !v);
                setInviteMsg(null);
                setInviteError(null);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              邀请成员
            </button>
          )}
        </div>

        {/* Invite form（仅 ADMIN 可见）*/}
        {isAdmin && inviteOpen && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">邀请新成员</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="成员邮箱"
                className="w-full sm:min-w-0 sm:flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER')}
                className="w-full sm:w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="MEMBER">成员</option>
                <option value="ADMIN">管理员</option>
              </select>
              <button
                onClick={handleInvite}
                disabled={inviteMutation.isPending}
                className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {inviteMutation.isPending ? '发送中…' : '发送邀请'}
              </button>
            </div>
            {inviteMsg && <p className="text-sm text-emerald-600">{inviteMsg}</p>}
            {inviteError && <p className="text-sm text-rose-600">{inviteError}</p>}
          </section>
        )}

        {/* Overview */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">成员总数</p>
            <p className="text-2xl font-bold text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">管理员</p>
            <p className="text-2xl font-bold text-slate-900">{summary.adminCount}</p>
          </div>
        </section>

        {/* Member list */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-industrial-cyan rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">成员列表</h2>
            <span className="text-xs text-slate-400 ml-auto">基于现有组织成员承载</span>
          </div>

          {membersQuery.isLoading ? (
            <Loading />
          ) : membersQuery.isError ? (
            <ErrorState
              message="加载成员失败，请稍后重试。"
              onRetry={() => void membersQuery.refetch()}
            />
          ) : members.length === 0 ? (
            <EmptyState message="暂无组织成员。" />
          ) : (
            <div className="divide-y divide-slate-100">
              {members.map((member) => (
                <div key={member.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold shrink-0">
                    {(member.user.name || member.user.email || '?').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {member.user.name || '未命名成员'}
                      {member.userId === user?.id && (
                        <span className="ml-1.5 text-[11px] text-slate-400">（我）</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{member.user.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${roleTone(member.role)}`}
                  >
                    {roleLabel(member.role)}
                  </span>
                  {isAdmin && (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member, e.target.value as 'ADMIN' | 'MEMBER')
                      }
                      disabled={roleMutation.isPending}
                      aria-label={`调整 ${member.user.email} 的角色`}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-primary focus:outline-none disabled:opacity-50"
                    >
                      <option value="MEMBER">成员</option>
                      <option value="ADMIN">管理员</option>
                    </select>
                  )}
                  <span className="text-[11px] text-slate-400">
                    加入于 {formatDateTime(member.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg shrink-0">
              &#9432;
            </span>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">M35 复用说明</h3>
              <p className="mt-1 text-sm text-blue-700">
                组织成员复用 Organization / OrganizationMember / User / UserInvitation 现有架构，
                未创建新供应商用户域 / 销售域 / 权限架构。邀请与角色管理仅限当前组织作用域（ADMIN 可执行）。
              </p>
            </div>
          </div>
        </section>
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierMembersPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <MembersContent />
      </RoleGuard>
    </AuthGuard>
  );
}