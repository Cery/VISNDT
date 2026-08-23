'use client';

import { useState } from 'react';
import type { Product, ProductDetail, ParameterGroup } from '@/types/product';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';
import type { Content } from '@/types/content';
import type { CapabilitySupplierProductWithOffers } from '@/types/capability';
import ProductGallery from './ProductGallery';
import ProductParameters from './ProductParameters';
import SupplierInfo from './SupplierInfo';
import SupplierInquirySection from '@/components/inquiry/SupplierInquirySection';
import SupplierModelsSection from './SupplierModelsSection';
import ProductDetailTabs from './ProductDetailTabs';
import RelatedKnowledge from './RelatedKnowledge';
import RelatedProductsSection from './RelatedProductsSection';
import RelatedSolutions from '@/components/relation/RelatedSolutions';
import DemandCTA from '@/components/conversion/DemandCTA';
import EmptyState from '@/components/common/EmptyState';
import { translateCategoryName } from '@/lib/translate';
import CapabilitySection from '@/components/capability/CapabilitySection';
import ApplicationScenario from '@/components/capability/ApplicationScenario';
import CapabilitySummary from '@/components/capability/CapabilitySummary';
import CapabilityBadge from '@/components/capability/CapabilityBadge';

interface ProductDetailContentProps {
  product: ProductDetail;
  parameterGroups: ParameterGroup[];
  relatedKnowledge?: RelatedKnowledgeItem[];
  relatedProducts?: Product[];
  /** Related solutions feed (deterministic public Content API, type=SOLUTION) */
  relatedSolutions?: Content[];
  /** Public Capability Discovery — published Supplier Models with commercial summary (M28.0) */
  supplierModels?: CapabilitySupplierProductWithOffers[];
}

export default function ProductDetailContent({
  product,
  parameterGroups,
  relatedKnowledge = [],
  relatedProducts = [],
  relatedSolutions = [],
  supplierModels = [],
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
                      <CapabilityBadge
                        label={translateCategoryName(product.category.name)}
                        tone="cyan"
                        className="mt-3"
                      />
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

                  <SupplierInfo
                    offers={product.offers}
                    productName={product.name}
                  />
                </div>
              </div>

              {/* Capability Profile — deterministic capability interpretation */}
              <CapabilitySection
                eyebrow="Capability Profile"
                title="能力档案"
                subtitle="基于检测分类与核心技术参数的确定性能力解读"
                className="mt-8"
              >
                <div className="space-y-4">
                  <ApplicationScenario categoryName={product.category?.name} />
                  <CapabilitySummary parameters={product.parameterValues} />
                </div>
              </CapabilitySection>
            </section>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <section id="specifications">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                技术参数
              </h2>
              <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-4 sm:p-6">
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
                productModel={product.model ?? null}
                productCategory={product.category ? translateCategoryName(product.category.name) : null}
              />
            </section>
          )}

          {/* Supplier Models Tab — published SupplierProduct models with commercial summary */}
          {activeTab === 'supplier-models' && (
            <section id="supplier-models">
              <SupplierModelsSection
                productId={product.id}
                productName={product.name}
                models={supplierModels}
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
                            {doc.mediaType === 'CERTIFICATE'
                              ? '证书'
                              : doc.mediaType === 'SPEC_SHEET'
                                ? '规格书'
                                : doc.mediaType === 'ILLUSTRATION'
                                  ? '插图'
                                  : '文档'}
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

          {/* Related Knowledge Tab */}
          {activeTab === 'knowledge' && (
            <section id="knowledge">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                相关知识
              </h2>
              <RelatedKnowledge items={relatedKnowledge} />
            </section>
          )}

          {/* Related Products Tab — deterministic same-category discovery + Compare Entry */}
          {activeTab === 'related' && (
            <section id="related">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                相关产品
              </h2>
              <RelatedProductsSection
                currentProductId={product.id}
                currentProductName={product.name}
                products={relatedProducts}
              />
            </section>
          )}

          {/* Commercial foundation — cross-content relation + conversion (always visible) */}
          {relatedSolutions.length > 0 && (
            <RelatedSolutions items={relatedSolutions} className="mt-12" />
          )}
          <DemandCTA
            contextType="product"
            targetLabel={product.name}
            productId={product.id}
            className="mt-12"
          />
        </>
      )}
    </ProductDetailTabs>
  );
}