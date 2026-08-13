import { getProduct } from '@/services/product.service';
import { getParameterGroups } from '@/services/parameter-group.service';
import ProductGallery from '@/components/products/ProductGallery';
import ProductParameters from '@/components/products/ProductParameters';
import ManufacturerInfo from '@/components/products/ManufacturerInfo';
import SupplierInquirySection from '@/components/inquiry/SupplierInquirySection';
import EmptyState from '@/components/common/EmptyState';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { translateCategoryName } from '@/lib/translate';
import { SITE_DESCRIPTION } from '@/lib/seo';

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
    return {
      title: product.name,
      description:
        (product.description?.slice(0, 160) ?? '') ||
        `VISNDT产品详情：${product.name}`,
      openGraph: {
        title: product.name,
        description:
          (product.description?.slice(0, 160) ?? '') || SITE_DESCRIPTION,
        type: 'website',
      },
    };
  } catch {
    return {
      title: '产品详情',
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

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          产品列表
        </Link>
        {product.category && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="hover:text-primary transition-colors"
            >
              {translateCategoryName(product.category.name)}
            </Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <section id="media">
          <ProductGallery media={product.media} productName={product.name} />
        </section>

        {/* Product Info */}
        <section id="overview" className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">{product.name}</h1>
            {product.model && (
              <p className="text-slate-500 mt-1 font-mono text-sm">型号：{product.model}</p>
            )}
            {product.category && (
              <span className="inline-block mt-3 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {translateCategoryName(product.category.name)}
              </span>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="font-semibold text-sm text-slate-700 mb-2">产品描述</h2>
              <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Manufacturer Info (derived from offers.organization) */}
          <ManufacturerInfo
            offers={product.offers}
            productName={product.name}
          />

          {/* Supplier Capability + Inquiry (user must select Offer explicitly) */}
          <SupplierInquirySection
            productId={product.id}
            productName={product.name}
            offers={product.offers ?? []}
          />
        </section>
      </div>

      {/* Technical Parameters (grouped by ParameterGroup) */}
      <section id="specifications" className="mb-12">
        <h2 className="text-2xl font-extrabold text-foreground mb-6">技术参数</h2>
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

      {/* Product Media Documents */}
      <section id="documents" className="mb-12">
        <h2 className="text-2xl font-extrabold text-foreground mb-6">文档与证书</h2>
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
    </div>
  );
}