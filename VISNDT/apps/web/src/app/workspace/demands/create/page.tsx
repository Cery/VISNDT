'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import WorkspaceSectionHeader from '@/components/workspace/WorkspaceSectionHeader';
import DemandParameterEditor, {
  type DemandParameterDraft,
} from '@/components/demand/DemandParameterEditor';
import {
  createDemand,
  addDemandParameter,
} from '@/services/demand.service';
import { getFilterParameterDefinitions } from '@/services/parameter-definition.service';
import { getParameterGroups } from '@/lib/api/parameter-groups';
import { getCategories } from '@/lib/api/categories';
import type { FilterParameterDefinition } from '@/services/parameter-definition.service';
import type { ParameterGroup } from '@/types/product';
import type { ProductCategory } from '@/types/category';

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

  const [form, setForm] = useState({
    title: '',
    description: '',
    budgetRange: '',
    quantity: '',
    quantityUnit: '',
    expectedDeliveryDate: '',
    categoryId: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactVisible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [definitions, setDefinitions] = useState<FilterParameterDefinition[]>([]);
  const [groups, setGroups] = useState<ParameterGroup[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [parameterDrafts, setParameterDrafts] = useState<DemandParameterDraft[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getFilterParameterDefinitions(),
      getParameterGroups(1, 100),
      getCategories(1, 100),
    ])
      .then(([defs, groupRes, categoryRes]) => {
        if (cancelled) return;
        setDefinitions(defs);
        setGroups(groupRes.data ?? []);
        setCategories(categoryRes.data ?? []);
      })
      .catch(() => {
        // 参数/分类定义加载失败不影响基础需求创建，仅相关选择区不可用
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const created = await createDemand({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        budgetRange: form.budgetRange.trim() || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        quantityUnit: form.quantityUnit.trim() || undefined,
        expectedDeliveryDate: form.expectedDeliveryDate || undefined,
        categoryId: form.categoryId || undefined,
        contactName: form.contactName.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        contactVisible: form.contactVisible,
      });

      for (const p of parameterDrafts) {
        await addDemandParameter(created.id, {
          parameterDefinitionId: p.parameterDefinitionId,
          value: p.value?.trim() || undefined,
          valueMin: p.valueMin ?? undefined,
          valueMax: p.valueMax ?? undefined,
          required: p.required,
          priority: p.priority,
        });
      }

      return created;
    },
    onSuccess: (created) => {
      router.push(`/workspace/demands/${created.id}`);
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
    if (
      form.contactEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())
    ) {
      errs.contactEmail = '请输入有效邮箱地址';
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
    value: string | boolean,
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
    <WorkspaceLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <WorkspaceSectionHeader
          title="创建需求"
          eyebrow="BUYER · DEMAND"
          description="描述您的检测设备需求，作为采购旅程的起点。"
        />

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 space-y-5"
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

              {/* Category */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  需求分类
                </label>
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">请选择检测能力分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  用于帮助系统与供应商理解需求所属的检测能力领域。
                </p>
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

              {/* Contact */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    联系人
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    联系方式将展示给响应需求的供应商。
                  </p>
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
              </div>

              {/* Technical Parameters */}
              <div className="border-t border-slate-100 pt-4">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-slate-800">
                    技术参数
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    填写需求的检测技术要求，将用于能力匹配与询价展示。
                  </p>
                </div>
                <DemandParameterEditor
                  definitions={definitions}
                  groups={groups}
                  value={parameterDrafts}
                  onChange={setParameterDrafts}
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
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
      </div>
    </WorkspaceLayout>
  );
}
