'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { createDemand } from '@/services/demand.service';

export default function DemandCreatePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <DemandCreateContent />
      </RoleGuard>
    </AuthGuard>
  );
}

function DemandCreateContent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const [form, setForm] = useState({
    title: '',
    description: '',
    budgetRange: '',
    quantity: '',
    quantityUnit: '',
    expectedDeliveryDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () =>
      createDemand({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        budgetRange: form.budgetRange.trim() || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        quantityUnit: form.quantityUnit.trim() || undefined,
        expectedDeliveryDate: form.expectedDeliveryDate || undefined,
      }),
    onSuccess: () => {
      router.push('/workspace/demands');
    },
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) {
      errs.title = '标题不能为空';
    }
    if (form.quantity && isNaN(Number(form.quantity))) {
      errs.quantity = '数量必须为数字';
    }
    if (form.quantity && Number(form.quantity) <= 0) {
      errs.quantity = '数量必须为正数';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  const handleChange = (
    field: string,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">创建需求</h2>
              <p className="text-slate-500 text-sm mt-1">
                描述您的检测设备需求。
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg border border-slate-200 p-6 space-y-5"
            >
              {/* Title (required) */}
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

              {/* Description */}
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

              {/* Budget Range */}
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

              {/* 数量 + 单位 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-xs text-red-500 mt-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="quantityUnit"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    单位
                  </label>
                  <input
                    id="quantityUnit"
                    type="text"
                    value={form.quantityUnit}
                    onChange={(e) =>
                      handleChange('quantityUnit', e.target.value)
                    }
                    placeholder="例如：pcs, sets, 台"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Expected Delivery Date */}
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

              {/* Error State */}
              {mutation.isError && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {(mutation.error as Error)?.message ||
                    '创建需求失败，请重试。'}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      创建中...
                    </>
                  ) : (
                    '创建需求'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/workspace/demands')}
                  className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
