import { getOrganization } from '@/services/organization.service';
import { getOffers } from '@/services/offer.service';
import SupplierPublicProfile from '@/components/supplier/SupplierPublicProfile';
import SupplierOfferList from '@/components/supplier/SupplierOfferList';
import SupplierCapability from '@/components/commercial/SupplierCapability';
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

    return {
      title: `${org.name} ${typeLabel} Profile`,
      description:
        `${org.name}（${typeLabel}，${statusLabel}）在 VISNDT 平台提供的工业检测设备供应能力。` ||
        SITE_DESCRIPTION,
      openGraph: {
        title: `${org.name} ${typeLabel} Profile | ${SITE_NAME}`,
        description:
          `${org.name}（${typeLabel}，${statusLabel}）在 VISNDT 平台提供的工业检测设备供应能力。`,
        type: 'website',
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
    { name: '产品列表', url: absoluteUrl('/products') },
    { name: organization.name, url: absoluteUrl(`/suppliers/${id}`) },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <JsonLdScript data={buildBreadcrumbListJsonLd(breadcrumbItems)} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          产品列表
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[200px]">
          {organization.name}
        </span>
      </nav>

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
    </div>
  );
}