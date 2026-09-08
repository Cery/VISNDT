import { getOrganization } from '@/services/organization.service';
import { getOffers } from '@/services/offer.service';
import SupplierPublicProfile from '@/components/supplier/SupplierPublicProfile';
import SupplierOfferList from '@/components/supplier/SupplierOfferList';
import SupplierCapability from '@/components/commercial/SupplierCapability';
import PageContainer from '@/components/common/PageContainer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl, buildBreadcrumbListJsonLd, JsonLdScript } from '@/lib/seo';

interface SupplierPageProps {
  params: Promise<{ id: string }>;
}

/** 供应商页面动态 SEO Metadata */
export async function generateMetadata({
  params,
}: SupplierPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const org = await getOrganization(id);
    const typeLabel = org.type || '供应商';
    const statusLabel = org.status === 'ACTIVE' ? '活跃' : org.status;
    // M38 统一 Discoverability：Supplier 公开 Profile（Capability Provider Profile）规范地址，
    // 闭合机器可读 canonical（与 Breadcrumb/Structured Data/导航一致）。
    const canonical = absoluteUrl(`/suppliers/${id}`);

    return {
      title: `${org.name} ${typeLabel} Profile`,
      description:
        `${org.name}（${typeLabel}，${statusLabel}）在 VISNDT 平台提供的工业检测设备供应能力。` ||
        SITE_DESCRIPTION,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        title: `${org.name} ${typeLabel} Profile | ${SITE_NAME}`,
        description:
          `${org.name}（${typeLabel}，${statusLabel}）在 VISNDT 平台提供的工业检测设备供应能力。`,
        type: 'website',
        url: canonical,
      },
    };
  } catch {
    return {
      title: '供应商详情',
      description: SITE_DESCRIPTION,
    };
  }
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  const { id } = await params;

  let organization;
  try {
    organization = await getOrganization(id);
  } catch {
    notFound();
  }

  // Fetch supplier's active/submitted offers
  const offersResult = await getOffers({
    organizationId: id,
    pageSize: 50,
  });

  const offers = offersResult.data ?? [];

  const breadcrumbItems = [
    { name: '首页', url: absoluteUrl('/') },
    { name: '检测产品', url: absoluteUrl('/products') },
    { name: organization.name, url: absoluteUrl(`/suppliers/${id}`) },
  ];

  return (
    <PageContainer variant="content" paddingY={32}>
      <JsonLdScript data={buildBreadcrumbListJsonLd(breadcrumbItems)} />
      {/* Breadcrumb — 846 §53: Home → Domain → Object */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          检测产品
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[200px]">
          {organization.name}
        </span>
      </nav>

      {/* 802 — Capability Provider context frame: engineering role, not storefront */}
      <div className="mb-6 rounded-xl border border-slate-200/80 bg-industrial-dark/95 px-4 py-3 flex items-center gap-3">
        <span className="h-3 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
          CAPABILITY PROVIDER
        </span>
        <span className="text-slate-600">/</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
          {organization.type || 'Supplier'}
        </span>
        <span className="hidden sm:inline ml-auto font-mono text-[10px] uppercase tracking-widest text-slate-500">
          CAPABILITY · PRODUCTS · CONNECTION
        </span>
      </div>

      {/* Supplier Profile */}
      <section className="mb-8">
        <SupplierPublicProfile organization={organization} />
      </section>

      {/* Supplier Capability Image — tags + related products + inquiry entry */}
      <SupplierCapability organization={organization} offers={offers} />

      {/* Supplier Offer List */}
      <section>
        <h2 className="text-2xl font-extrabold text-foreground mb-6">
          供应能力
        </h2>
        <SupplierOfferList offers={offers} />
      </section>

      {/* 802 — Cross-surface Next Connection：能力提供方的工程连接下一步 */}
      <div className="mt-10 rounded-xl border border-slate-200/80 bg-surface-1 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">与该能力提供方的下一步工程连接</p>
            <p className="text-sm text-muted-foreground mt-1">
              核对供应产品型号、评估能力适配性，或通过询价建立工程连接（Inquiry = Connection）。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
            >
              浏览能力注册表<span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/products/compare"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
            >
              评估对比能力<span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
            >
              能力分类<span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}