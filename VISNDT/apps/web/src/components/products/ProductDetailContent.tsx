'use client';

import { useState } from 'react';
import type { ProductDetail } from '@/types/product';
import type { ParameterGroup } from '@/types/product';
import ProductGallery from './ProductGallery';
import ProductParameters from './ProductParameters';
import ManufacturerInfo from './ManufacturerInfo';
import SupplierInquirySection from '@/components/inquiry/SupplierInquirySection';
import ProductDetailTabs from './ProductDetailTabs';
import EmptyState from '@/components/common/EmptyState';
import { translateCategoryName } from '@/lib/translate';

interface ProductDetailContentProps {
  product: ProductDetail;
  parameterGroups: ParameterGroup[];
}

export default function ProductDetailContent({
  product,
  parameterGroups,
}: ProductDetailContentProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const descShouldTruncate = (product.description?.length ?? 0) > 200;
  const displayDescription =
    descShouldTruncate && !descExpanded
      ? product.description?.slice(0, 200) + '...'
      : product.description;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: '在售',
    INACTIVE: '下架',
    DRAFT: '草稿',
    REVIEW: '审核中',
    ARCHIVED: '已归档',
  };

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-slate-100 text-slate-500',
    DRAFT: 'bg-yellow-100 text-yellow-700',
    REVIEW: 'bg-blue-100 text-blue-700',
    ARCHIVED: 'bg-slate-100 text-slate-400',
  };

  return (
    <ProductDetailTabs>
      {(activeTab) => (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <section id="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section id="media">
                  <ProductGallery media={product.media} productName={product.name} />
                </section>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h1 className="text-3xl font-extrabold text-foreground">
                        {product.name}
                      </h1>
                      {product.status && (
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[product.status] || 'bg-slate-100 text-slate-500'}`}
                        >
                          {statusLabel[product.status] || product.status}
                        </span>
                      )}
                    </div>
                    {product.model && (
                      <p className="text-slate-500 mt-1 font-mono text-sm">
                        型号：{product.model}
                      </p>
                    )}
                    {product.category && (
                      <span className="inline-block mt-3 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {translateCategoryName(product.category.name)}
                      </span>
                    )}
                    {product.updatedAt && (
                      <p className="text-xs text-slate-400 mt-2">
                        最后更新：{formatDate(product.updatedAt)}
                      </p>
                    )}
                  </div>

                  {product.description && (
                    <div>
                      <h2 className="font-semibold text-sm text-slate-700 mb-2">
                        产品描述
                      </h2>
                      <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
                        {displayDescription}
                      </p>
                      {descShouldTruncate && (
                        <button
                          type="button"
                          onClick={() => setDescExpanded(!descExpanded)}
                          className="text-sm text-primary hover:text-primary/80 mt-1 font-medium"
                        >
                          {descExpanded ? '收起' : '展开全部'}
                        </button>
                      )}
                    </div>
                  )}

                  <ManufacturerInfo
                    offers={product.offers}
                    productName={product.name}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <section id="specifications">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                技术参数
              </h2>
              <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6">
                {product.parameterValues.length > 0 ? (
                  <ProductParameters
                    parameters={product.parameterValues}
                    parameterGroups={parameterGroups}
                  />
                ) : (
                  <EmptyState
                    icon="document"
                    message="暂无技术参数"
                    description="该产品尚未录入技术参数信息。"
                  />
                )}
              </div>
            </section>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <section id="suppliers">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                供应商
              </h2>
              <SupplierInquirySection
                productId={product.id}
                productName={product.name}
                offers={product.offers ?? []}
              />
            </section>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <section id="documents">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                文档与证书
              </h2>
              {product.media.filter((m) => m.mediaType !== 'IMAGE').length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.media
                    .filter((m) => m.mediaType !== 'IMAGE')
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-primary font-medium">
                            {doc.mediaType === 'CERTIFICATE' ? '证书' : '文档'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {doc.title || '文档'}
                          </p>
                          {doc.description && (
                            <p className="text-xs text-slate-400 truncate">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyState
                  icon="document"
                  message="暂无文档与证书"
                  description="该产品尚未上传相关文档或证书。"
                />
              )}
            </section>
          )}
        </>
      )}
    </ProductDetailTabs>
  );
}