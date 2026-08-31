/**
 * Supplier Semantic Context — M34.2 Supply Relationship Foundation
 *
 * 统一的代码级「Supplier Context」语义入口（前端 view model，非 Entity）。
 *
 * 冻结关系（751 / M34 Contract）：
 *   Product (Capability Authority)  ──1:N──▶  SupplyProduct (Supplier-owned)  ──N:1──▶  Organization(type=SUPPLIER)
 *
 * 契约要点：
 *   - Supplier   = Organization(type=SUPPLIER) 语义角色，不新增 Supplier 表 / Model / FK 层
 *   - SupplyProduct = Supplier-owned Commercial Product，不被重新解释为 Capability
 *   - Product    = 平台权威能力/产品对象（Canonical Authority），本路径绝不绕过 Product 直达 Supplier
 *   - 公开 Supplier Context 的供应主体来源 = PUBLISHED SupplierProduct + Organization；
 *     本路径 **不读取 Offer / RFQ / Transaction**（无商业层依赖）。
 *   - publishedStatus 恒为 PUBLISHED（后端 discovery.service 已强制过滤）。
 *
 * 本模块为纯展示层视图模型：
 *   - 不创建 Persistence Entity / Prisma Model / Migration / 表
 *   - 不虚构 Supplier Database Record
 *   - supplier identity 一律来自 SupplierProduct.organizationId / organization（非 Offer.organizationId）
 */

import type { CapabilitySupplierProductWithOffers } from '@/types/capability';

/** 供应商型号的规格（SupplierProduct 技术参数 override，Product-derived 原始值）。 */
export interface SupplierModelSpecContext {
  parameterDefinitionId: string;
  name: string;
  value: string | null;
  valueNumber: number | null;
  unit: string | null;
}

/**
 * 一个已发布供应商型号（SupplierProduct）。
 * model 为供应商自有型号标识（e.g. VISION-8），≠ 平台能力/产品对象。
 */
export interface SupplierModelContext {
  id: string;
  slug: string | null;
  /** 供应商自有型号标识，例：VISION-8。 */
  model: string;
  brand: string;
  /** 仅 PUBLISHED 进入公开上下文字段（后端强制）。 */
  status: string;
  specifications: SupplierModelSpecContext[];
  hasMedia: boolean;
}

/**
 * 统一 Supplier Context —— Supplier = Organization(type=SUPPLIER) 语义角色的可执行表达。
 * 满足 §7 契约字段：organizationId / name / publishedSupplyProductCount / relatedProductId / publishedStatus。
 */
export interface SupplierContext {
  organizationId: string;
  name: string;
  /** 该供应商针对此能力（relatedProductId）已发布的已上架型号数。 */
  publishedSupplyProductCount: number;
  /** 关联能力/平台产品 canonical identity = Product.id。 */
  relatedProductId: string;
  /** 仅 PUBLISHED 可进入公开 Supplier Context。 */
  publishedStatus: 'PUBLISHED';
  /** 该供应商的已发布型号（关系 SupplyProduct ──N:1──▶ Supplier）。 */
  models: SupplierModelContext[];
  /** 溯源声明：供应主体 = PUBLISHED SupplierProduct + Organization，不依赖 Offer/交易。 */
  source: 'PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION';
}

/** Product ──▶ Published SupplyProducts ──▶ Supplier Context 的聚合视图。 */
export interface SupplierRelationshipContext {
  relatedProductId: string;
  /** 总已发布能力型号数（Published SupplierProduct）。 */
  totalPublishedModels: number;
  /** 去重供应商（Organization）数。 */
  supplierCount: number;
  /** 按 Organization 归并的供应商上下文。 */
  suppliers: SupplierContext[];
}

/** 仅从已发布 SupplierProduct + Organization 汇总，零 Offer / 交易依赖。 */
export function buildSupplierRelationshipContext(
  relatedProductId: string,
  supplierModels: CapabilitySupplierProductWithOffers[],
): SupplierRelationshipContext {
  const suppliers = new Map<string, SupplierContext>();

  for (const { supplierProduct } of supplierModels) {
    const org = supplierProduct.organization;
    const orgId = supplierProduct.organizationId ?? org?.id;
    if (!orgId) continue;

    const specs = (supplierProduct.parameterValues ?? []).map((pv) => ({
      parameterDefinitionId: pv.parameterDefinitionId,
      name: pv.parameterDefinition?.name ?? pv.parameterDefinition?.code ?? '',
      value: pv.value ?? null,
      valueNumber: pv.valueNumber ?? null,
      unit: pv.parameterDefinition?.unit ?? null,
    }));

    const model: SupplierModelContext = {
      id: supplierProduct.id,
      slug: supplierProduct.slug ?? null,
      model: [supplierProduct.brand, supplierProduct.series, supplierProduct.modelNumber]
        .filter(Boolean)
        .join(' '),
      brand: supplierProduct.brand,
      status: supplierProduct.status ?? 'PUBLISHED',
      specifications: specs,
      hasMedia: (supplierProduct.media?.length ?? 0) > 0,
    };

    const existing = suppliers.get(orgId);
    if (existing) {
      existing.models.push(model);
      existing.publishedSupplyProductCount = existing.models.length;
    } else {
      suppliers.set(orgId, {
        organizationId: orgId,
        name: org?.name ?? orgId,
        publishedSupplyProductCount: 1,
        relatedProductId,
        publishedStatus: 'PUBLISHED',
        models: [model],
        source: 'PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION',
      });
    }
  }

  const list = Array.from(suppliers.values());
  return {
    relatedProductId,
    totalPublishedModels: supplierModels.length,
    supplierCount: list.length,
    suppliers: list,
  };
}