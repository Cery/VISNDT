'use client';

import Link from 'next/link';
import type { Product, ProductDetail, ParameterGroup } from '@/types/product';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';
import type { Content } from '@/types/content';
import type { CapabilitySupplierProduct } from '@/types/capability';
import type { EngineeringAnnotation } from '@/lib/engineering-insight/annotation';
import { buildCapabilityContext } from '@/lib/capability-context';
import { stripGovernanceLabels } from '@/lib/display-text';
import ProductGallery from './ProductGallery';
import ProductParameters from './ProductParameters';
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
  // 846 §60 — 治理标签退出公开买方视图（纯显示层剥离，数据本身不变）
  const description = stripGovernanceLabels(product.description);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: '已发布',
    INACTIVE: '已下架',
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

  // M34.1 — Capability = Product 语义角色（视图模型，非独立实体；不新增 Schema / 持久化）
  const capability = buildCapabilityContext(product, supplierModels);

  const providerCount = capability.supplier.providerCount;
  const modelCount = capability.supplier.publishedModelCount;

  // 技术规格台账单元格（展示性 mono 计量元数据，来源均为既有真实数据）
  const SpecCell = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white px-3 py-2.5 min-w-0">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-xs text-slate-700 tabular-nums truncate">{value}</div>
    </div>
  );

  // 工业技术章节标题：mono 索引 + 眉标 + 受控 accent 竖条 + 副题
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
          {/* Overview Tab — 846 §27 Hero/Identity + §29 单一能力概览 */}
          {activeTab === 'overview' && (
            <section id="overview">
              {/* §27 Hero / Identity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section id="media">
                  <ProductGallery media={product.media} productName={product.name} />
                </section>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 mb-1 w-full">
                        <span className="text-industrial-cyan">产品</span>
                        <span className="mx-2 text-slate-300">/</span>
                        明细
                      </span>
                      <h1 className="text-3xl font-extrabold text-foreground">
                        {product.name}
                      </h1>
                      {product.status && (
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[product.status] || 'bg-slate-100 text-slate-500'}`}
                        >
                          {statusLabel[product.status] || '未知状态'}
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

                    {/* Core Specs ledger — §27: Category / Core Specs */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-slate-200/80 bg-slate-200/80">
                      <SpecCell label="MODEL" value={product.model || '未提供'} />
                      <SpecCell
                        label="CATEGORY"
                        value={
                          product.category
                            ? (translateCategoryName(product.category.name) || '').toUpperCase()
                            : '未提供'
                        }
                      />
                      <SpecCell
                        label="SPEC FIELDS"
                        value={String(product.parameterValues?.length ?? 0)}
                      />
                      <SpecCell
                        label="REV"
                        value={product.updatedAt ? formatDate(product.updatedAt) : '未提供'}
                      />
                    </div>

                    {/* §27: Supplier Model Count */}
                    <p className="mt-3 text-sm text-slate-600">
                      {modelCount > 0 ? (
                        <>
                          <span className="font-semibold text-foreground">{modelCount}</span> 个供应型号
                          <span className="mx-1.5 text-slate-300">·</span>
                          <span className="font-semibold text-foreground">{providerCount}</span> 家供应商
                          <Link
                            href="#supplier-models"
                            className="ml-2 text-primary hover:text-primary/80 font-medium"
                          >
                            查看型号 →
                          </Link>
                        </>
                      ) : (
                        <span className="text-slate-400">暂无已发布供应型号</span>
                      )}
                    </p>
                  </div>

                  {/* §27/§36: CTA — 任务语言：1 Primary + 1 Secondary */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Link
                      href={`/workspace/demands/create?productId=${encodeURIComponent(product.id)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      提交采购需求
                      <span className="text-xs">&rarr;</span>
                    </Link>
                    <Link
                      href={`/products/compare?ids=${encodeURIComponent(product.id)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      加入对比
                    </Link>
                  </div>
                </div>
              </div>

              {/* §29 — 唯一「能力概览」：检测对象 / 应用场景 / 能力说明 / 关键参数
                  （原「能力描述」+「能力档案」双区已合并） */}
              <CapabilitySection
                eyebrow="Capability Overview"
                title="能力概览"
                subtitle="检测对象、应用场景、能力说明与关键参数"
                className="mt-10"
              >
                <div className="space-y-4">
                  <ApplicationScenario categoryName={product.category?.name} />
                  <EngineeringContextTags
                    application={capability.engineeringContext.application}
                    detectionObject={capability.engineeringContext.detectionObject}
                  />
                  {description && (
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {description}
                    </p>
                  )}
                  <CapabilitySummary parameters={product.parameterValues} />
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
                title="供应商"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {product.media
                    .filter((m) => m.mediaType !== 'IMAGE')
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md transition-all duration-300 bg-white p-4 flex items-center gap-3"
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
                  fileAssetId: p.primaryMedia?.fileAssetId ?? null,
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
                  fileAssetId:
                    s.coverImage?.id ??
                    s.media?.find((m) => m.type === 'IMAGE')?.fileAsset?.id ??
                    null,
                })),
                seeAllHref: '/solutions',
              },
              {
                label: '供应商',
                mono: '供应商',
                items: capability.supplier.providers.map((sup) => ({
                  href: `/suppliers/${sup.id}`,
                  title: sup.name,
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