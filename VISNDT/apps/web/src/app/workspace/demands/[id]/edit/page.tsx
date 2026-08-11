'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { getDemand, updateDemand } from '@/services/demand.service';
import type { DemandDetailItem } from '@/lib/api/demands';

interface DemandEditFormState {
  title: string;
  description: string;
  budgetRange: string;
  quantity: string;
  expectedDeliveryDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactVisible: boolean;
}

function toDateInputValue(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

function sanitizeProtectedContactValue(value?: string | null) {
  if (!value || value === '***') {
    return '';
  }
  return value;
}

function toFormState(demand: DemandDetailItem): DemandEditFormState {
  return {
    title: demand.title ?? '',
    description: demand.description ?? '',
    budgetRange: demand.budgetRange ?? '',
    quantity: demand.quantity != null ? String(demand.quantity) : '',
    expectedDeliveryDate: toDateInputValue(demand.expectedDeliveryDate),
    contactName: demand.contactName ?? '',
    contactPhone: sanitizeProtectedContactValue(demand.contactPhone),
    contactEmail: sanitizeProtectedContactValue(demand.contactEmail),
    contactVisible: Boolean(demand.contactVisible),
  };
}

function DemandEditContent({ id }: { id: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const [demand, setDemand] = useState<DemandDetailItem | null>(null);
  const [form, setForm] = useState<DemandEditFormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDemand = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await getDemand(id);
      setDemand(result);
      setForm(toFormState(result));
    } catch {
      setLoadError('加载需求失败，可能不存在或无权访问。');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDemand();
  }, [loadDemand]);

  const canEdit = demand?.status === 'DRAFT';

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form) {
        throw new Error('需求表单未初始化。');
      }

      return updateDemand(id, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        budgetRange: form.budgetRange.trim() || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        expectedDeliveryDate: form.expectedDeliveryDate || undefined,
        contactName: form.contactName.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        contactVisible: form.contactVisible,
      });
    },
    onSuccess: () => {
      router.push(`/workspace/demands/${id}`);
    },
  });

  const validate = useCallback(() => {
    if (!form) {
      return false;
    }

    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) {
      nextErrors.title = '标题不能为空';
    }
    if (form.quantity && Number.isNaN(Number(form.quantity))) {
      nextErrors.quantity = '数量必须为数字';
    }
    if (form.quantity && Number(form.quantity) <= 0) {
      nextErrors.quantity = '数量必须为正数';
    }
    if (
      form.contactEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())
    ) {
      nextErrors.contactEmail = '请输入有效邮箱地址';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleChange = useCallback(
    <K extends keyof DemandEditFormState>(field: K, value: DemandEditFormState[K]) => {
      setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      setErrors((prev) => {
        if (!prev[field as string]) {
          return prev;
        }
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canEdit || !validate()) {
        return;
      }
      mutation.mutate();
    },
    [canEdit, mutation, validate],
  );

  const pageSubtitle = useMemo(() => {
    if (!demand) {
      return '更新需求信息';
    }
    return `更新需求：${demand.title}`;
  }, [demand]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div>
              <button
                onClick={() => router.push(`/workspace/demands/${id}`)}
                className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors"
              >
                ← 返回需求详情
              </button>
              <h2 className="text-xl font-bold text-slate-900">编辑需求</h2>
              <p className="text-slate-500 text-sm mt-1">{pageSubtitle}</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse" />
                <div className="h-40 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : loadError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {loadError}
              </div>
            ) : !demand || !form ? null : !canEdit ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 space-y-3">
                <h3 className="text-sm font-semibold text-amber-900">
                  当前状态不可编辑
                </h3>
                <p className="text-sm text-amber-800">
                  需求进入发布后流程后，不再开放基础信息编辑。当前状态：{demand.status}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/workspace/demands/${id}`)}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    返回详情
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg border border-slate-200 p-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="例如：需要100台工业内窥镜"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 ${
                      errors.title
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    描述
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="请详细描述您的需求..."
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 resize-y"
                  />
                </div>

                <div>
                  <label
                    htmlFor="budgetRange"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    预算范围
                  </label>
                  <input
                    id="budgetRange"
                    type="text"
                    value={form.budgetRange}
                    onChange={(e) => handleChange('budgetRange', e.target.value)}
                    placeholder="例如：10000-50000"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    数量
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="例如：100"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 ${
                      errors.quantity
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expectedDeliveryDate"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    预计交付日期
                  </label>
                  <input
                    id="expectedDeliveryDate"
                    type="date"
                    value={form.expectedDeliveryDate}
                    onChange={(e) =>
                      handleChange('expectedDeliveryDate', e.target.value)
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      联系人
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={form.contactName}
                      onChange={(e) => handleChange('contactName', e.target.value)}
                      placeholder="例如：张女士"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactPhone"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      联系电话
                    </label>
                    <input
                      id="contactPhone"
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      placeholder="例如：13800000000"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    联系邮箱
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="例如：buyer@example.com"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 ${
                      errors.contactEmail
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.contactVisible}
                    onChange={(e) =>
                      handleChange('contactVisible', e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      公开联系人信息
                    </p>
                    <p className="text-xs text-slate-500">
                      开启后，需求详情可按后端规则显示联系方式。
                    </p>
                  </div>
                </label>

                {mutation.isError && (
                  <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {(mutation.error as Error)?.message || '更新需求失败，请重试。'}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? '保存中...' : '保存修改'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/workspace/demands/${id}`)}
                    className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <DemandEditContent id={id} />
      </RoleGuard>
    </AuthGuard>
  );
}
