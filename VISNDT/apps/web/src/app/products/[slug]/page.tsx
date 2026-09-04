import { getProduct, getProductRelatedKnowledge, getProductRelatedProducts } from '@/services/product.service';
import { getCapabilityDetail } from '@/services/capability.service';
import { getContentList } from '@/services/content.service';
import { getParameterGroups } from '@/services/parameter-group.service';
import ProductDetailContent from '@/components/products/ProductDetailContent';
import ProductDetailNav from '@/components/products/ProductDetailNav';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { translateCategoryName } from '@/lib/translate';
import { SITE_DESCRIPTION, absoluteUrl, buildProductJsonLd, buildBreadcrumbListJsonLd, JsonLdScript } from '@/lib/seo';
import TrackOnMount from '@/components/analytics/TrackOnMount';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';
import type { Product, ProductDetail } from '@/types/product';
import type { EngineeringAnnotation } from '@/lib/engineering-insight/annotation';
import { resolveEngineeringAnnotations } from '@/lib/engineering-insight/annotation';
import type { Content } from '@/types/content';
import type { CapabilitySupplierProduct } from '@/types/capability';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** 产品详情页动态 SEO Metadata（复用 service 层 getProduct，不引入新数据访问） */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    const productUrl = absoluteUrl(`/products/${slug}`);
    return {
      title: product.name,
      description:
        (product.description?.slice(0, 160) ?? '') ||
        `VISNDT能力详情：${product.name}`,
      alternates: { canonical: productUrl },
      openGraph: {
        title: product.name,
        description:
          (product.description?.slice(0, 160) ?? '') || SITE_DESCRIPTION,
        type: 'website',
        url: productUrl,
      },
      twitter: {
        card: 'summary',
        title: product.name,
        description:
          (product.description?.slice(0, 160) ?? '') || SITE_DESCRIPTION,
      },
    };
  } catch {
    return {
      title: '能力详情',
      description: SITE_DESCRIPTION,
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  // Load parameter groups for grouped display (public endpoint, no schema change)
  const parameterGroups = await getParameterGroups();

  // Load related knowledge (deterministic mapping, graceful degradation on error)
  let relatedKnowledge: RelatedKnowledgeItem[] = [];
  try {
    relatedKnowledge = await getProductRelatedKnowledge(slug);
  } catch {
    // Related knowledge failure must not block product detail — degrade to empty.
    relatedKnowledge = [];
  }

  // Load related products (deterministic same-category discovery, graceful degradation)
  let relatedProducts: Product[] = [];
  try {
    relatedProducts = await getProductRelatedProducts(slug);
  } catch {
    // Related products failure must not block product detail — degrade to empty.
    relatedProducts = [];
  }

  // Load related solutions (deterministic published SOLUTION feed, newest-first)
  let relatedSolutions: Content[] = [];
  try {
    const solutions = await getContentList({
      type: 'SOLUTION',
      pageSize: 6,
      sort: 'publishedAt',
      order: 'desc',
    });
    relatedSolutions = solutions.data;
  } catch {
    // Related solutions failure must not block product detail — degrade to empty.
    relatedSolutions = [];
  }

  // Load public Capability Discovery (published Supplier Models, non-commercial context).
  // P2 frozen: backend enforces SupplierProduct.status = PUBLISHED and never exposes
  // price / currency / commercialSummary / offer payload on this public path.
  let supplierModels: CapabilitySupplierProduct[] = [];
  try {
    const capability = await getCapabilityDetail(product.id);
    supplierModels = capability.supplierProducts ?? [];
  } catch {
    // Capability discovery failure must not block product detail — degrade to empty.
    supplierModels = [];
  }

  // Build M37 engineering-context annotations for parameter names (Insight Annotation, deterministic).
  // Reuses existing public Content/Knowledge — no new API/entity. Degrades gracefully.
  let parameterAnnotations: Record<string, EngineeringAnnotation> = {};
  try {
    const terms = (product.parameterValues ?? []).map(
      (pv) => pv.parameterDefinition.name,
    );
    const annos = await resolveEngineeringAnnotations(terms);
    parameterAnnotations = Object.fromEntries(annos.map((a) => [a.term, a]));
  } catch {
    parameterAnnotations = {};
  }

  // Build structured data
  const productUrl = absoluteUrl(`/products/${slug}`);
  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    url: productUrl,
    image: product.media?.[0]?.fileAssetId
      ? absoluteUrl(`/files/${product.media[0].fileAssetId}/download`)
      : null,
    brand: product.createdBy?.organization?.name ?? null,
    category: product.category ? translateCategoryName(product.category.name) : null,
    model: product.model ?? null,
  });

  const breadcrumbItems = [
    { name: '首页', url: absoluteUrl('/') },
    { name: '能力列表', url: absoluteUrl('/products') },
  ];
  if (product.category) {
    breadcrumbItems.push({
      name: translateCategoryName(product.category.name),
      url: absoluteUrl(`/products?categoryId=${product.category.id}`),
    });
  }
  breadcrumbItems.push({ name: product.name, url: productUrl });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
      <TrackOnMount
        event="product_view"
        targetId={product.id}
        metadata={{
          productName: product.name,
          category: product.category?.name ?? null,
          model: product.model ?? null,
        }}
      />
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={buildBreadcrumbListJsonLd(breadcrumbItems)} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors whitespace-nowrap">
          能力列表
        </Link>
        {product.category && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              {translateCategoryName(product.category.name)}
            </Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
      </nav>

      {/* Two-column layout: Nav sidebar + Main content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <ProductDetailNav />

        <div className="flex-1 min-w-0">
          <ProductDetailContent
            product={product}
            parameterGroups={parameterGroups}
            relatedKnowledge={relatedKnowledge}
            relatedProducts={relatedProducts}
            relatedSolutions={relatedSolutions}
            supplierModels={supplierModels}
            parameterAnnotations={parameterAnnotations}
          />
        </div>
      </div>
    </div>
  );
}