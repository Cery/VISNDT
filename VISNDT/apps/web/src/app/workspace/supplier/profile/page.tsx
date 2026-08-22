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
import { getOrganization, updateOrganization } from '@/services/organization.service';

function formatDateTime(value?: string | null) {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

function ProfileContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const organizationId = user?.organizationId;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const orgQuery = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => getOrganization(organizationId!),
    enabled: !!organizationId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; type?: string }) =>
      updateOrganization(organizationId!, data),
    onSuccess: (updated) => {
      // Reflect the returned data immediately so the page does not depend on a manual refresh.
      queryClient.setQueryData(['organization', organizationId], updated);
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      setIsEditing(false);
      setSaveError(null);
    },
    onError: (error: Error) => {
      setSaveError(error.message || '保存失败，请稍后重试。');
    },
  });

  const handleStartEdit = () => {
    if (!orgQuery.data) return;
    setEditName(orgQuery.data.name);
    setEditType(orgQuery.data.type);
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = () => {
    if (!editName.trim()) {
      setSaveError('企业名称不能为空。');
      return;
    }
    updateMutation.mutate({
      name: editName.trim(),
      type: editType.trim(),
    });
  };

  if (!organizationId) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]">
          <EmptyState message="未关联组织，无法查看企业资料。" />
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
            <h1 className="text-2xl font-bold text-slate-900">企业资料</h1>
            <p className="mt-1 text-sm text-slate-500">
              管理您所在组织的基础信息，更新后将同步至公开展示。
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              disabled={orgQuery.isLoading || !orgQuery.data}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑资料
            </button>
          )}
        </div>

        {/* Content */}
        {orgQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Loading />
          </div>
        ) : orgQuery.isError ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState
              message="加载企业资料失败，请稍后重试。"
              onRetry={() => orgQuery.refetch()}
            />
          </div>
        ) : !orgQuery.data ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="暂无企业资料。" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Organization Info Card */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h2 className="text-lg font-semibold text-slate-900">基本信息</h2>
              </div>

              {isEditing ? (
                <div className="space-y-4 max-w-lg">
                  {saveError && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                      {saveError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      企业名称 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="请输入企业名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      企业类型
                    </label>
                    <input
                      type="text"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="例如：检测设备制造商"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          保存中...
                        </>
                      ) : (
                        '保存修改'
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={updateMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 mb-1">企业名称</p>
                    <p className="text-sm font-semibold text-slate-900">{orgQuery.data.name}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 mb-1">企业类型</p>
                    <p className="text-sm font-semibold text-slate-900">{orgQuery.data.type || '未设置'}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 mb-1">状态</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      orgQuery.data.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {orgQuery.data.status === 'ACTIVE' ? '活跃' : orgQuery.data.status}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Meta Information */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-slate-400 rounded-full" />
                <h2 className="text-lg font-semibold text-slate-900">元信息</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 mb-1">组织 ID</p>
                  <p className="text-sm font-mono text-slate-700 break-all">{orgQuery.data.id}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 mb-1">创建时间</p>
                  <p className="text-sm font-medium text-slate-700">{formatDateTime(orgQuery.data.createdAt)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 mb-1">最后更新</p>
                  <p className="text-sm font-medium text-slate-700">{formatDateTime(orgQuery.data.updatedAt)}</p>
                </div>
              </div>
            </section>

            {/* Data Consistency Note */}
            <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg shrink-0">
                  &#9432;
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">数据一致性说明</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    修改企业资料后，更新将实时同步至公开供应商身份展示页面。
                    供应商能力展示、Offer 管理和 RFQ 响应均使用此组织信息。
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierProfilePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <ProfileContent />
      </RoleGuard>
    </AuthGuard>
  );
}