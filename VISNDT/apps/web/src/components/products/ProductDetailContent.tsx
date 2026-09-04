'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product, ProductDetail, ParameterGroup } from '@/types/product';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';
import type { Content } from '@/types/content';
import type { CapabilitySupplierProduct } from '@/types/capability';
import type { EngineeringAnnotation } from '@/lib/engineering-insight/annotation';
import { buildCapabilityContext } from '@/lib/capability-context';
import { buildSupplierRelationshipContext } from '@/lib/supplier-context';
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
import EngineeringContextTags from '@/components/capability/EngineeringContextTags';
import RelevantEngineeringDiscovery from '@/components/engineering/RelevantEngineeringDiscovery';

interface ProductDetailContentProps {
  product: ProductDetail;
  parameterGroups: ParameterGroup[];
  relatedKnowledge?: RelatedKnowledgeItem[];
  relatedProducts?: Product[];
  /** Related solutions feed (deterministic public Content API, type=SOLUTION) */
  relatedSolutions?: Content[];
  /** Public Capability Discovery — published Supplier Models as non-commercial model context (M28.0 / P2) */
  supplierModels?: CapabilitySupplierProduct[];
  /** Engineering-context annotation lookup keyed by parameter name (M37 Insight Annotation) */
  parameterAnnotations?: Record<string, EngineeringAnnotation>;
}

export default function ProductDetailContent({
  product,
  parameterGroups,
  relatedKnowledge = [],
  relatedProducts = [],
  relatedSolutions = [],
  supplierModels = [],
  parameterAnnotations,
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

  // M34.1 — Capability = Product 语义角色：从现有 Product/Category/Parameter/SupplierProduct/Organization
  // 确定性派生 Capability Context（视图模型，非独立实体；不新增 Schema / 持久化）。
  const capability = buildCapabilityContext(product, supplierModels);

  // M34.2 — Supply Relationship Foundation：Product(Capability Authority) → Published SupplyProducts → Supplier(Organization)
  // 统一 Supplier Context 可见性。仅 PUBLISHED SupplierProduct + Organization（后端已强制过滤），零 Offer / 交易依赖。
  const supplierRel = buildSupplierRelationshipContext(product.id, supplierModels);

  // 技术规格台账单元格（展示性 mono 计量元数据，来源均为既有真实数据）
  const SpecCell = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white px-3 py-2.5 min-w-0">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-xs text-slate-700 tabular-nums truncate">{value}</div>
    </div>
  );

  // 工业技术章节标题：mono 索引 + 眉标 + 受控 accent 竖条 + 副题（信息层级 / 技术信息模块化）
  const SectionTitle = ({
    index,
    eyebrow,
    title,
    subtitle,
  }: {
    index: string;
    eyebrow: string;
    title: string;
    subtitle?: string;
  }) => (
    <div className="relative flex items-start gap-3 mb-6">
      <span className="h-6 w-1 rounded-sm bg-industrial-cyan mt-1 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
          <span className="text-industrial-cyan">{index}</span>
          <span className="mx-2 text-slate-300">/</span>
          {eyebrow}
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      <span className="flex-1 border-t border-slate-200/70 mt-3" aria-hidden="true" />
    </div>
  );

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
                      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 mb-1 w-full">
                        <span className="text-industrial-cyan">CAPABILITY</span>
                        <span className="mx-2 text-slate-300">/</span>
                        PRODUCT PROFILE
                      </span>
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
                    {product.category && (
                      <CapabilityBadge
                        label={translateCategoryName(product.category.name)}
                        tone="cyan"
                        className="mt-3"
                      />
                    )}

                    {/* Technical Spec Header — industrial capability/parameter metadata ledger (existing real data) */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-slate-200/80 bg-slate-200/80">
                      <SpecCell label="MODEL" value={product.model || '—'} />
                      <SpecCell
                        label="CATEGORY"
                        value={
                          product.category
                            ? (translateCategoryName(product.category.name) || '').toUpperCase()
                            : '—'
                        }
                      />
                      <SpecCell
                        label="SPEC FIELDS"
                        value={String(product.parameterValues?.length ?? 0)}
                      />
                      <SpecCell
                        label="REV"
                        value={product.updatedAt ? formatDate(product.updatedAt) : '—'}
                      />
                    </div>
                  </div>

                  {product.description && (
                    <div>
                      <h2 className="font-semibold text-sm text-slate-700 mb-2">
                        能力描述
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
                  <EngineeringContextTags
                    application={capability.engineeringContext.application}
                    detectionObject={capability.engineeringContext.detectionObject}
                  />
                  <CapabilitySummary parameters={product.parameterValues} />

                  {/* M34.1 — 能力提供商上下文：基于已发布 SupplierProduct / Organization，非 Offer / 交易 */}
                    <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-5">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rotate-45 bg-industrial-cyan" aria-hidden="true" />
                        能力提供商与供应关系
                      </h3>
                      {supplierRel.totalPublishedModels > 0 ? (
                        <div className="space-y-3 text-sm text-slate-600">
                          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                            <span className="text-industrial-cyan">{supplierRel.totalPublishedModels}</span>{' '}
                            已发布能力型号 · {supplierRel.supplierCount} 家提供商
                          </p>

                          {/* M34.2 — Product → Published SupplyProducts → Supplier (Organization) 关系 */}
                          <div className="divide-y divide-slate-100">
                            {supplierRel.suppliers.map((supplier) => (
                              <div key={supplier.organizationId} className="py-3 first:pt-1 last:pb-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <Link
                                    href={`/suppliers/${supplier.organizationId}`}
                                    className="font-medium text-slate-800 hover:text-primary transition-colors"
                                  >
                                    {supplier.name}
                                  </Link>
                                  <span className="text-xs text-slate-400">
                                    {supplier.publishedSupplyProductCount} 个供应型号
                                  </span>
                                  <span className="inline-flex items-center text-[11px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                                    已发布
                                  </span>
                                </div>
                                <ul className="mt-2 space-y-1.5">
                                  {supplier.models.map((model) => (
                                    <li
                                      key={model.id}
                                      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-slate-50 px-2.5 py-1.5"
                                    >
                                      <span className="font-mono text-xs text-slate-700">{model.model}</span>
                                      <span className="text-[11px] text-slate-400">
                                        {model.specifications.length} 项规格
                                      </span>
                                      {model.hasMedia && (
                                        <span className="text-[11px] text-slate-400">含媒体</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {capability.category.categoryId && (
                            <Link
                              href={capability.category.categoryPath}
                              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                            >
                              在「{capability.category.categoryName}」中查看更多存量能力 →
                            </Link>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">该能力暂未关联已发布的能力型号。</p>
                      )}
                      <p className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-3">
                        平台能力/产品对象由供应商以其自有型号实际提供；供应关系按已发布能力型号+供应商归并，不依赖报价或交易记录。
                      </p>
                    </div>
                </div>
              </CapabilitySection>
            </section>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <section id="specifications">
              <SectionTitle
                index="02"
                eyebrow="Technical Specification"
                title="技术参数"
                subtitle="核心技术参数与测定规格"
              />
              <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-4 sm:p-6">
                {product.parameterValues.length > 0 ? (
                  <ProductParameters
                    parameters={product.parameterValues}
                    parameterGroups={parameterGroups}
                    annotations={parameterAnnotations}
                  />
                ) : (
                  <EmptyState
                    icon="document"
                    message="暂无技术参数"
                    description="该能力尚未录入技术参数信息。"
                  />
                )}
              </div>
            </section>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <section id="suppliers">
              <SectionTitle
                index="03"
                eyebrow="Capability Providers"
                title="能力提供商"
                subtitle="提供该工业检测能力的合格服务方"
              />
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
              <SectionTitle
                index="04"
                eyebrow="Documents & Certificates"
                title="文档与证书"
                subtitle="规格书、证书与工程文档"
              />
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
                  description="该能力尚未上传相关文档或证书。"
                />
              )}
            </section>
          )}

          {/* Related Knowledge Tab */}
          {activeTab === 'knowledge' && (
            <section id="knowledge">
              <SectionTitle
                index="06"
                eyebrow="Related Knowledge"
                title="相关知识"
                subtitle="与核心检测分类确定性强相关的知识条目"
              />
              <RelatedKnowledge items={relatedKnowledge} />
            </section>
          )}

          {/* Related Products Tab — deterministic same-category discovery + Compare Entry */}
          {activeTab === 'related' && (
            <section id="related">
              <SectionTitle
                index="07"
                eyebrow="Related Capabilities"
                title="相关能力"
                subtitle="同分类下的推荐检测能力"
              />
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

          {/* 803_M39 — Capability → Parameters → Application → Knowledge → Solution →
              Capability Provider → Compare/Evaluate → Inquiry 的相关工程发现层（收口 802 BR-802-01）。
              复用既有导出的确定性相关数据（relatedProducts / relatedKnowledge / relatedSolutions /
              已发布供应商能力），折叠为分组的跨面工程发现，含跨面下一步发现 + 询价连接。
              非购物推荐，未引入 recommendation domain / 新数据源。 */}
          <RelevantEngineeringDiscovery
            capabilityAnchor={
              product.category
                ? translateCategoryName(product.category.name)
                : product.name
            }
            groups={[
              {
                label: '相关检测能力',
                mono: 'PRODUCT',
                items: relatedProducts.map((p) => ({
                  href: `/products/${p.id}`,
                  title: p.name,
                  sub: p.status === 'ACTIVE' ? '可用' : undefined,
                })),
                seeAllHref: `/products${
                  product.category ? `?categoryId=${product.category.id}` : ''
                }`,
              },
              {
                label: '相关技术知识',
                mono: 'KNOWLEDGE',
                items: relatedKnowledge.map((k) => ({
                  href: `/knowledge-base/${k.slug}`,
                  title: k.title,
                })),
                seeAllHref: '/knowledge-base',
              },
              {
                label: '相关解决方案',
                mono: 'SOLUTION',
                items: relatedSolutions.map((s) => ({
                  href: `/solutions/${s.slug}`,
                  title: s.title,
                })),
                seeAllHref: '/solutions',
              },
              {
                label: '能力提供方',
                mono: 'SUPPLIER',
                items: supplierRel.suppliers.map((sup) => ({
                  href: `/suppliers/${sup.organizationId}`,
                  title: sup.name,
                  sub: `${sup.publishedSupplyProductCount} 个供应型号`,
                })),
                seeAllHref: `/search?q=${encodeURIComponent(product.name ?? '')}`,
              },
            ]}
            nextActions={[
              { href: '/products/compare', label: '评估对比检测能力' },
              { href: '/search', label: '统一检索相关参数' },
              { href: `#suppliers`, label: '在该能力下发起询价' },
            ]}
          />
        </>
      )}
    </ProductDetailTabs>
  );
}