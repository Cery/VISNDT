/**
 * Capability Semantic Contract — M34.1 Capability & Product Foundation
 *
 * 统一的代码级「Capability Context」语义入口。
 *
 * 契约（751 GATE B / M34 Contract）：
 *   Product          = Canonical Platform Object
 *   Capability       = Product 的发现语义角色（DISCOVERY SEMANTIC ROLE，非独立 Entity）
 *   Specification    = Product-derived 原始参数（Capability Typical = NOT IMPLEMENTED）
 *   SupplyProduct    = Supplier-owned Commercial Product
 *   Supplier         = Organization(type=SUPPLIER) 语义角色（供应主体 = Published SupplyProduct + Organization）
 *
 * 本模块为 **纯展示层视图模型（view model）**：
 *   - 不创建 Persistence Entity / Prisma Model / Migration
 *   - 不虚构 Capability Database Record
 *   - 所有字段均派生自 Product / ProductCategory / ProductParameterValue / SupplierProduct / Organization
 *   - identity 唯一 = product.id（不引入第二套身份）
 */

import type { ProductDetail } from '@/types/product';
import type { CapabilitySupplierProduct } from '@/types/capability';
import { translateCategoryName } from '@/lib/translate';
import { getCategoryScenario, getDetectionObject } from '@/lib/capability-glossary';

/** 能力规格：始终为 Product-derived 原始参数值，绝不携带伪造的典型值。 */
export interface CapabilitySpecification {
  parameterDefinitionId: string;
  name: string;
  code: string;
  dataType: string;
  unit: string | null;
  value: string;
  valueNumber: number | null;
  /** 溯源：对 Product 的能力档案固定为 PRODUCT（原始 ProductParameterValue）。 */
  source: 'PRODUCT';
  /** M34.1：Capability Typical Spec = NOT IMPLEMENTED，恒为 false（显式防伪造典型值）。 */
  isTypical: false;
}

/** 能力提供商上下文：基于已发布 SupplierProduct / Organization，而非 Offer / RFQ / 交易。 */
export interface CapabilitySupplierContext {
  /** 去重后的提供商（Organization）数量。 */
  providerCount: number;
  /** 已发布能力型号（Published SupplierProduct）数量。 */
  publishedModelCount: number;
  providers: Array<{ id: string; name: string }>;
  /** 溯源声明：供应主体 = PUBLISHED SupplierProduct + Organization，禁止解读为 Offer 维度。 */
  source: 'PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION';
}

/** 能力发现上下文：为下游 Capability-led Discovery 提供稳定锚。 */
export interface CapabilityDiscoveryContext {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  /** 该能力分类的检索页路径（Category→Product 能力入口锚）。 */
  categoryPath: string;
  /** 该能力（Product）的 canonical URL，identity = product.id。 */
  capabilityUrl: string;
}

/** 工程上下文 —— M35：Application / Detection Object 均为 SEMANTIC / DERIVED（无独立 Entity）。 */
export interface CapabilityEngineeringContext {
  /** 检测应用场景（基于分类确定性推导）。 */
  application: string | null;
  /** 检测对象（基于分类确定性推导的语义角色）。 */
  detectionObject: string | null;
  /** 溯源声明：两者均由现有 Product/Category 派生，不创建任何持久化 Entity。 */
  source: 'SEMANTIC_DERIVED';
}

/** Capability Context —— Capability = Product 语义角色的可执行表达。 */
export interface CapabilityContext {
  /** 唯一 identity = product.id（无第二套身份）。 */
  id: string;
  /** Capability Name = Product.name。 */
  name: string;
  /** Capability Description = Product.description。 */
  description: string | null;
  category: CapabilityDiscoveryContext;
  /** 基于 Category 的确定性检测场景解读（展示层词表，非 AI）。 */
  scenario: string | null;
  /** M35 — 工程上下文：Application / Detection Object 语义派生。 */
  engineeringContext: CapabilityEngineeringContext;
  /** 能力规格（Product-derived 原始参数）。 */
  specifications: CapabilitySpecification[];
  /** 能力提供商上下文（Published SupplyProduct + Organization）。 */
  supplier: CapabilitySupplierContext;
}

/**
 * 从现有 Product / Category / ParameterValue / SupplierProduct / Organization
 * 确定性构建 CapabilityContext。纯只读投影，无副作用，不访问新持久化载体。
 */
export function buildCapabilityContext(
  product: ProductDetail,
  supplierModels: CapabilitySupplierProduct[],
): CapabilityContext {
  const category = product.category ?? null;

  const specs: CapabilitySpecification[] = product.parameterValues.map((pv) => ({
    parameterDefinitionId: pv.parameterDefinitionId,
    name: pv.parameterDefinition.name,
    code: pv.parameterDefinition.code,
    dataType: pv.parameterDefinition.dataType,
    unit: pv.parameterDefinition.unit,
    value: pv.value,
    valueNumber: pv.valueNumber,
    source: 'PRODUCT',
    isTypical: false,
  }));

  const providerMap = new Map<string, string>();
  for (const model of supplierModels) {
    const org = model.organization;
    if (org?.id && org.name && !providerMap.has(org.id)) providerMap.set(org.id, org.name);
  }
  const providers = Array.from(providerMap.entries()).map(([id, name]) => ({ id, name }));

  const categoryName =
    category && category.name ? translateCategoryName(category.name) : '未分类能力';

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: {
      categoryId: category?.id ?? '',
      categoryName,
      categorySlug: category?.slug ?? '',
      categoryPath:
        category && category.id
          ? `/products?categoryId=${category.id}`
          : `/products`,
      capabilityUrl: `/products/${product.id}`,
    },
    scenario: category && category.name ? getCategoryScenario(category.name) : null,
    // M35 — Application / Detection Object = SEMANTIC / DERIVED（展示层确定性派生，无独立 Entity）。
    engineeringContext: {
      application: category && category.name ? getCategoryScenario(category.name) : null,
      detectionObject: category && category.name ? getDetectionObject(category.name) : null,
      source: 'SEMANTIC_DERIVED',
    },
    specifications: specs,
    supplier: {
      providerCount: providers.length,
      publishedModelCount: supplierModels.length,
      providers,
      source: 'PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION',
    },
  };
}