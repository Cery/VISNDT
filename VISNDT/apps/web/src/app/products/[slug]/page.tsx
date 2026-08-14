import { getProduct } from '@/services/product.service';
import { getParameterGroups } from '@/services/parameter-group.service';
import ProductDetailContent from '@/components/products/ProductDetailContent';
import ProductDetailNav from '@/components/products/ProductDetailNav';
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

      {/* Two-column layout: Nav sidebar + Main content */}
      <div className="flex gap-8">
        <ProductDetailNav />

        <div className="flex-1 min-w-0">
          <ProductDetailContent
            product={product}
            parameterGroups={parameterGroups}
          />
        </div>
      </div>
    </div>
  );
}