'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { createOffer } from '@/services/offer.service';
import { getProducts } from '@/lib/api/products';
import type { Product } from '@/types/product';

function OfferCreateContent() {
  const router = useRouter();

  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [productSearch, setProductSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: ['products', 'list', productSearch],
    queryFn: () => getProducts({ keyword: productSearch || undefined, pageSize: 20 }),
    staleTime: 30_000,
  });

  const products = productsQuery.data?.data ?? [];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!productId || !title.trim()) {
        setError('请选择产品并填写报价标题。');
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const created = await createOffer({
          productId,
          title: title.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : undefined,
          currency: currency || undefined,
        });
        router.push(`/workspace/supplier/offers/${created.id}/edit`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '创建报价失败，请稍后重试。';
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [productId, title, description, price, currency, router],
  );

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[720px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">创建报价</h1>
          <p className="mt-1 text-sm text-slate-500">
            创建新的供应能力报价，关联平台产品并填写供应信息。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">选择产品</h2>
            <p className="mt-1 text-sm text-slate-500">选择要关联的平台产品（Global Catalog）。</p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="搜索产品名称..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />

              {productsQuery.isLoading ? (
                <Loading />
              ) : productsQuery.isError ? (
                <ErrorState
                  message="加载产品列表失败。"
                  onRetry={() => productsQuery.refetch()}
                />
              ) : products.length === 0 ? (
                <p className="text-sm text-slate-500">未找到产品，请尝试其他关键词。</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-1 rounded-lg border border-slate-100">
                  {products.map((p: Product) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProductId(p.id);
                        setTitle(p.name);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                        productId === p.id
                          ? 'bg-primary/5 text-primary font-medium border-l-2 border-primary'
                          : 'text-slate-700 hover:bg-slate-50 border-l-2 border-transparent'
                      }`}
                    >
                      <span className="font-medium">{p.name}</span>
                      {p.model && <span className="ml-2 text-xs text-slate-400">{p.model}</span>}
                    </button>
                  ))}
                </div>
              )}

              {productId && (
                <div className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-primary">
                  已选择产品 ID: {productId}
                </div>
              )}
            </div>
          </section>

          {/* Offer Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">报价信息</h2>
            <p className="mt-1 text-sm text-slate-500">填写报价的基本信息。</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  报价标题 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="例如：高端工业相机供应方案"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="描述您的供应能力、服务范围、交付方式等..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">价格</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="例如：1999.99"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">货币</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="CNY">CNY (人民币)</option>
                    <option value="USD">USD (美元)</option>
                    <option value="EUR">EUR (欧元)</option>
                    <option value="JPY">JPY (日元)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? '创建中...' : '创建报价'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </WorkspaceLayout>
  );
}

export default function OfferCreatePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <OfferCreateContent />
      </RoleGuard>
    </AuthGuard>
  );
}