/**
 * ============================================================
 * VISNDT SupplierProduct Demo Seed — seed_supplier_product.ts
 * ============================================================
 *
 * 用途：为 M28.0 Product Experience Refinement (662) 补齐 D1 缺口：
 *   - SupplierProduct（供应商型号，status 覆盖 PUBLISHED / DRAFT / SUBMITTED / REVIEWING / APPROVED / REJECTED）
 *   - SupplierProductMedia（部分型号的媒体）
 *   - SupplierProductParameterValue（部分型号的参数覆盖）
 *   - Offer.supplierProductId 绑定（仅 PUBLISHED 型号绑定 ACTIVE Offer）
 *
 * 数据链（真实关系，禁止伪造跨组织 / 跨能力）：
 *   Platform Product (Product) → SupplierProduct → Offer → Supplier Organization
 *     Offer.productId       = SupplierProduct.platformProductId
 *     Offer.organizationId  = SupplierProduct.organizationId
 *
 * 发布边界（Published Boundary）：
 *   PUBLISHED  → Search / Product Detail / Inquiry 可见
 *   DRAFT / SUBMITTED / REVIEWING / APPROVED / REJECTED
 *              → Public 不可见（运行时以 status=PUBLISHED 过滤，见 search.service.ts / discovery.service.ts）
 *
 * 约束：
 *   - 只补数据，不新增模型 / 表 / 迁移（NO Schema Change, NO Migration）
 *   - 幂等：全部按自然键 upsert，重复运行不产生重复数据
 *   - 不触碰需求 / RFQ / 匹配等已存在数据
 *   - 严格遵循 Product Global Catalog + Supplier = Capability Provider
 *
 * 运行（在 database 目录，已含 .env: DATABASE_URL）：
 *   npx tsx seed_supplier_product.ts
 * ============================================================
 */

import {
  PrismaClient,
  SupplierProductStatus,
  FileType,
  OfferStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

// 自然键 → id 的内存映射（运行时从现库读取，避免硬编码 id）
// 组织以「供应商用户 → 组织成员关系」解析，避免组织名后缀差异（如 -D5reg）导致失配
const orgByMemberEmail = new Map<string, string>();
const orgById = new Map<string, string>();
const userByEmail = new Map<string, string>();
const productBySlug = new Map<string, string>();
const paramByCode = new Map<string, { id: string; dataType: string }>();

async function loadLookups() {
  const [orgs, users, products, params, members] = await Promise.all([
    prisma.organization.findMany({ select: { id: true, name: true } }),
    prisma.user.findMany({ select: { id: true, email: true } }),
    prisma.product.findMany({ select: { id: true, slug: true } }),
    prisma.parameterDefinition.findMany({ select: { id: true, code: true, dataType: true } }),
    prisma.organizationMember.findMany({
      select: { organizationId: true, user: { select: { email: true } } },
    }),
  ]);

  for (const o of orgs) {
    orgById.set(o.id, o.name);
  }
  for (const u of users) userByEmail.set(u.email, u.id);
  for (const p of products) {
    if (p.slug) productBySlug.set(p.slug, p.id);
  }
  for (const p of params) paramByCode.set(p.code, { id: p.id, dataType: p.dataType });
  // 供应商用户 → 所属组织（组织成员关系）
  for (const m of members) {
    const email = m.user?.email;
    if (email && email.startsWith('demo.supplier') && !orgByMemberEmail.has(email)) {
      orgByMemberEmail.set(email, m.organizationId);
    }
  }

  console.log(
    `  lookups: ${orgById.size} 组织 / ${userByEmail.size} 用户 / ${productBySlug.size} 产品 / ${paramByCode.size} 参数 / ${orgByMemberEmail.size} 供应商成员关系`,
  );
}

function mustGet(map: Map<string, string>, key: string, label: string): string {
  const v = map.get(key);
  if (!v) throw new Error(`缺少 ${label}: ${key}`);
  return v;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d;
}

// 单个型号的参数覆盖（code → value / valueNumber），必须来自现库 parameter_definition
type ParamSpec = { code: string; value: string; valueNumber?: number };

interface SupplierProductSpec {
  /** 供应商成员用户 email（解析其所属组织，避免组织名后缀差异） */
  supplierUserEmail: string;
  productSlug: string;
  brand: string;
  series: string;
  modelNumber: string;
  slug: string;
  status: SupplierProductStatus;
  description: string;
  technicalDescription: string;
  applicationInfo: string;
  /** 参数覆盖（可空） */
  paramOverrides?: ParamSpec[];
  /** 媒体（可空，title → altText） */
  media?: { mediaType: FileType; documentType?: string; title: string; altText: string }[];
  /** 绑定已有 ACTIVE Offer（仅 PUBLISHED 型号） */
  linkOffer?: boolean;
}

// ============================================================
// SupplierProduct 定义
// 平台产品 → 供应商型号：同一平台能力可由多个 Supplier 提供不同品牌 / 系列 / 型号
// ============================================================

const supplierProducts: SupplierProductSpec[] = [
  // ── 明视工业检测设备有限公司（org_supplier_01）──
  {
    supplierUserEmail: 'demo.supplier.01@visndt.local',
    productSlug: 'vx-6000-hd-video-borescope',
    brand: '明视',
    series: '高清智能系列',
    modelNumber: 'VX-6000-PRO',
    slug: 'mingshi-vx-6000-pro',
    status: SupplierProductStatus.PUBLISHED,
    description: '明视基于 VX-6000 高清视频内窥镜平台能力推出的 PRO 增强型号。',
    technicalDescription:
      '5.5 英寸高清显示屏，2560x1440 成像，5m 工作长度，智能拍照与缺陷标记。',
    applicationInfo: '适用于航空发动机、压力容器、复杂管路内部检测。',
    paramOverrides: [
      { code: 'image_resolution', value: '2560x1440' },
      { code: 'working_length', value: '5m' },
      { code: 'ie_battery_life', value: '5', valueNumber: 5 },
    ],
    media: [
      {
        mediaType: FileType.IMAGE,
        title: 'VX-6000-PRO 产品图',
        altText: '明视 VX-6000-PRO 高清内窥镜产品图',
      },
    ],
    linkOffer: true,
  },
  {
    supplierUserEmail: 'demo.supplier.01@visndt.local',
    productSlug: 'vx-6000-hd-video-borescope',
    brand: '明视',
    series: '标准高清系列',
    modelNumber: 'VX-6000-HD',
    slug: 'mingshi-vx-6000-hd',
    status: SupplierProductStatus.APPROVED,
    description: '明视 VX-6000 平台的标准高清型号，已审核通过，待发布。',
    technicalDescription: '1920x1080 成像，3m 工作长度。',
    applicationInfo: '常规工业内窥检测场景。',
  },
  {
    supplierUserEmail: 'demo.supplier.01@visndt.local',
    productSlug: 'us-800-ultrasonic-flaw-detector',
    brand: '明视',
    series: '便携系列',
    modelNumber: 'US-800E',
    slug: 'mingshi-us-800e',
    status: SupplierProductStatus.REVIEWING,
    description: '明视基于 US-800 平台能力的便携式探伤仪型号，审核中。',
    technicalDescription: '轻量化便携设计，0-6000mm 检测范围。',
    applicationInfo: '现场快速巡检与焊缝检测。',
  },
  {
    supplierUserEmail: 'demo.supplier.01@visndt.local',
    productSlug: '3dscan-pro-structured-light-scanner',
    brand: '明视',
    series: '精密扫描系列',
    modelNumber: '3DSCAN-Pro-S',
    slug: 'mingshi-3dscan-pro-s',
    status: SupplierProductStatus.PUBLISHED,
    description: '明视基于 3DSCAN-Pro 平台能力的精密型三维扫描型号。',
    technicalDescription: '0.015mm 扫描精度，350mm 视场，适配逆向工程与尺寸检测。',
    applicationInfo: '精密零件逆向工程、尺寸质量检测。',
    paramOverrides: [
      { code: 'resolution', value: '0.015mm' },
      { code: 'field_of_view', value: '350', valueNumber: 350 },
    ],
    media: [
      {
        mediaType: FileType.IMAGE,
        title: '3DSCAN-Pro-S 产品图',
        altText: '明视 3DSCAN-Pro-S 三维扫描仪产品图',
      },
    ],
    linkOffer: true,
  },
  {
    supplierUserEmail: 'demo.supplier.01@visndt.local',
    productSlug: 'mic-5000-metallurgical-microscope',
    brand: '明视',
    series: '基础系列',
    modelNumber: 'MIC-5000-BASE',
    slug: 'mingshi-mic-5000-base',
    status: SupplierProductStatus.SUBMITTED,
    description: '明视基于 MIC-5000 平台能力的基础型金相显微镜，已提交待审。',
    technicalDescription: '4K 成像，50x 变焦。',
    applicationInfo: '材料金相组织基础观察。',
  },

  // ── 锐视检测技术有限公司（org_supplier_02）──
  {
    supplierUserEmail: 'demo.supplier.02@visndt.local',
    productSlug: 'fb-3000-fiber-borescope',
    brand: '锐视',
    series: '光纤增强系列',
    modelNumber: 'FB-3000-PLUS',
    slug: 'ruishi-fb-3000-plus',
    status: SupplierProductStatus.PUBLISHED,
    description: '锐视基于 FB-3000 光纤内窥镜平台能力推出的增强型号。',
    technicalDescription:
      '4.0mm 超细探头，3m 工作长度，150° 四向弯曲，钨丝编织插入管。',
    applicationInfo: '狭窄弯曲管路、发动机叶片内部检测。',
    paramOverrides: [
      { code: 'working_length', value: '3m' },
      { code: 'articulation_angle', value: '上/下/左/右 150°/150°/150°/150°' },
    ],
    media: [
      {
        mediaType: FileType.IMAGE,
        title: 'FB-3000-PLUS 产品图',
        altText: '锐视 FB-3000-PLUS 光纤内窥镜产品图',
      },
    ],
    linkOffer: true,
  },
  {
    supplierUserEmail: 'demo.supplier.02@visndt.local',
    productSlug: 'vx-6000-hd-video-borescope',
    brand: '锐视',
    series: '经济系列',
    modelNumber: 'VX-6000E',
    slug: 'ruishi-vx-6000e',
    status: SupplierProductStatus.DRAFT,
    description: '锐视基于 VX-6000 平台能力的经济型高清内窥镜，草稿中。',
    technicalDescription: '1920x1080 成像，3m 工作长度。',
    applicationInfo: '常规内窥检测场景。',
  },
  {
    supplierUserEmail: 'demo.supplier.02@visndt.local',
    productSlug: 'us-200-portable-ultrasonic-flaw-detector',
    brand: '锐视',
    series: '便携系列',
    modelNumber: 'US-200P',
    slug: 'ruishi-us-200p',
    status: SupplierProductStatus.REJECTED,
    description: '锐视基于 US-200 平台能力的便携探伤型号，审核未通过。',
    technicalDescription: '0-3000mm 检测范围，便携设计。',
    applicationInfo: '现场快速巡检。',
  },
  {
    supplierUserEmail: 'demo.supplier.02@visndt.local',
    productSlug: '3dscan-pro-structured-light-scanner',
    brand: '锐视',
    series: '大尺寸扫描系列',
    modelNumber: '3DSCAN-Pro-L',
    slug: 'ruishi-3dscan-pro-l',
    status: SupplierProductStatus.DRAFT,
    description: '锐视基于 3DSCAN-Pro 平台能力的大尺寸扫描型号，草稿中。',
    technicalDescription: '大视场结构光扫描。',
    applicationInfo: '大尺寸工件三维检测。',
  },
  {
    supplierUserEmail: 'demo.supplier.02@visndt.local',
    productSlug: 'mic-5000-metallurgical-microscope',
    brand: '锐视',
    series: '高端金相系列',
    modelNumber: 'MIC-5000-ULTRA',
    slug: 'ruishi-mic-5000-ultra',
    status: SupplierProductStatus.PUBLISHED,
    description: '锐视基于 MIC-5000 平台能力的高端金相显微镜型号。',
    technicalDescription: '4K 成像，80x 变焦，电动对焦，适配材料研究与失效分析。',
    applicationInfo: '材料金相研究、失效分析。',
    paramOverrides: [
      { code: 'zoom_factor', value: '80', valueNumber: 80 },
    ],
    linkOffer: true,
  },

  // ── 中科检测设备有限公司（org_supplier_03）──
  {
    supplierUserEmail: 'demo.supplier.03@visndt.local',
    productSlug: 'us-800-ultrasonic-flaw-detector',
    brand: '中科',
    series: '专业探伤系列',
    modelNumber: 'US-800-PLUS',
    slug: 'zhongke-us-800-plus',
    status: SupplierProductStatus.PUBLISHED,
    description: '中科基于 US-800 平台能力的专业探伤仪增强型号。',
    technicalDescription: '0-6000mm 检测范围，0.5-20MHz 宽频，120dB 增益，锂电池 10h 续航。',
    applicationInfo: '焊缝、铸件、锻件内部缺陷检测。',
    paramOverrides: [
      { code: 'operating_frequency', value: '0.5-20MHz' },
      { code: 'gain_range', value: '120dB' },
      { code: 'battery_life', value: '10', valueNumber: 10 },
    ],
    media: [
      {
        mediaType: FileType.IMAGE,
        title: 'US-800-PLUS 产品图',
        altText: '中科 US-800-PLUS 超声波探伤仪产品图',
      },
      {
        mediaType: FileType.SPEC_SHEET,
        documentType: 'SPEC_SHEET',
        title: 'US-800-PLUS 产品规格书',
        altText: '中科 US-800-PLUS 产品规格书',
      },
    ],
    linkOffer: true,
  },
  {
    supplierUserEmail: 'demo.supplier.03@visndt.local',
    productSlug: 'fb-3000-fiber-borescope',
    brand: '中科',
    series: '标准系列',
    modelNumber: 'FB-3000M',
    slug: 'zhongke-fb-3000m',
    status: SupplierProductStatus.SUBMITTED,
    description: '中科基于 FB-3000 平台能力的标准光纤内窥镜，已提交待审。',
    technicalDescription: '4.0mm 探头，2m 工作长度。',
    applicationInfo: '狭窄管路检测。',
  },
  {
    supplierUserEmail: 'demo.supplier.03@visndt.local',
    productSlug: 'us-200-portable-ultrasonic-flaw-detector',
    brand: '中科',
    series: '标准便携系列',
    modelNumber: 'US-200-STD',
    slug: 'zhongke-us-200-std',
    status: SupplierProductStatus.PUBLISHED,
    description: '中科基于 US-200 平台能力的标准便携式探伤仪型号。',
    technicalDescription: '0-3500mm 检测范围，1-10MHz 频段，锂电池 7h 续航。',
    applicationInfo: '现场快速巡检与常规焊缝检测。',
    paramOverrides: [
      { code: 'detection_range', value: '0-3500mm' },
      { code: 'battery_life', value: '7', valueNumber: 7 },
    ],
    linkOffer: true,
  },
];

// ============================================================
// 执行
// ============================================================

async function seed() {
  console.log('=== VISNDT SupplierProduct Demo Seed ===');
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 禁止在生产环境运行种子脚本');
    process.exit(1);
  }

  await loadLookups();

  const reviewerId = userByEmail.get('demo.admin@visndt.local');
  if (!reviewerId) throw new Error('缺少审核人: demo.admin@visndt.local');

  let spCount = 0;
  let paramOverrideCount = 0;
  let mediaCount = 0;
  let offerLinkCount = 0;

  for (const spec of supplierProducts) {
    const orgId = mustGet(orgByMemberEmail, spec.supplierUserEmail, '供应商组织');
    const productId = mustGet(productBySlug, spec.productSlug, '平台产品');
    const createdById = mustGet(userByEmail, spec.supplierUserEmail, '供应商用户');
    const orgName = orgById.get(orgId) ?? spec.supplierUserEmail;

    // Governance timestamps by status
    const isPublished = spec.status === SupplierProductStatus.PUBLISHED;
    const submittedAt =
      isPublished || ['SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED'].includes(spec.status)
        ? daysAgo(isPublished ? 12 : 6)
        : null;
    const reviewedAt =
      isPublished || spec.status === SupplierProductStatus.APPROVED || spec.status === SupplierProductStatus.REJECTED
        ? daysAgo(isPublished ? 9 : 3)
        : null;
    const publishedAt = isPublished ? daysAgo(7) : null;

    const sp = await prisma.supplierProduct.upsert({
      where: {
        organizationId_platformProductId_modelNumber: {
          organizationId: orgId,
          platformProductId: productId,
          modelNumber: spec.modelNumber,
        },
      },
      update: {
        brand: spec.brand,
        series: spec.series,
        slug: spec.slug,
        description: spec.description,
        technicalDescription: spec.technicalDescription,
        applicationInfo: spec.applicationInfo,
        status: spec.status,
        submittedAt,
        reviewedAt,
        reviewedBy: reviewedAt ? reviewerId : null,
        reviewedNote: spec.status === SupplierProductStatus.REJECTED ? '参数与平台能力描述不符，请补充检测报告后重新提交' : null,
        publishedAt,
      },
      create: {
        organizationId: orgId,
        platformProductId: productId,
        brand: spec.brand,
        series: spec.series,
        modelNumber: spec.modelNumber,
        slug: spec.slug,
        description: spec.description,
        technicalDescription: spec.technicalDescription,
        applicationInfo: spec.applicationInfo,
        status: spec.status,
        submittedAt,
        reviewedAt,
        reviewedBy: reviewedAt ? reviewerId : null,
        reviewedNote: spec.status === SupplierProductStatus.REJECTED ? '参数与平台能力描述不符，请补充检测报告后重新提交' : null,
        publishedAt,
      },
    });
    spCount++;

    // ── Parameter overrides ──
    if (spec.paramOverrides) {
      for (const p of spec.paramOverrides) {
        const pd = paramByCode.get(p.code);
        if (!pd) {
          console.warn(`  ⚠ 忽略未知参数 code: ${p.code}（${spec.modelNumber}）`);
          continue;
        }
        await prisma.supplierProductParameterValue.upsert({
          where: {
            supplierProductId_parameterDefinitionId: {
              supplierProductId: sp.id,
              parameterDefinitionId: pd.id,
            },
          },
          update: { value: p.value, valueNumber: p.valueNumber ?? null },
          create: {
            supplierProductId: sp.id,
            parameterDefinitionId: pd.id,
            value: p.value,
            valueNumber: p.valueNumber ?? null,
          },
        });
        paramOverrideCount++;
      }
    }

    // ── Media（幂等：先清后建）──
    if (spec.media) {
      await prisma.supplierProductMedia.deleteMany({ where: { supplierProductId: sp.id } });
      let order = 0;
      for (const m of spec.media) {
        order++;
        await prisma.supplierProductMedia.create({
          data: {
            supplierProductId: sp.id,
            mediaType: m.mediaType,
            documentType: m.documentType ?? null,
            title: m.title,
            altText: m.altText,
            isPrimary: order === 1,
            displayOrder: order,
          },
        });
        mediaCount++;
      }
    }

    // ── Offer 绑定（仅 PUBLISHED 且 linkOffer）──
    // Offer.productId = SupplierProduct.platformProductId; Offer.organizationId = SupplierProduct.organizationId
    if (spec.linkOffer && isPublished) {
      const offer = await prisma.offer.findUnique({
        where: { organizationId_productId: { organizationId: orgId, productId } },
      });
      if (offer) {
        await prisma.offer.update({
          where: { id: offer.id },
          data: {
            supplierProductId: sp.id,
            status: OfferStatus.ACTIVE,
          },
        });
        offerLinkCount++;
      } else {
        console.warn(`  ⚠ 未找到可绑定的 Offer: ${orgName} / ${spec.productSlug}`);
      }
    }

    console.log(
      `  ✅ 供应商型号 ${spec.brand} ${spec.series} ${spec.modelNumber} [${spec.status}]`,
    );
  }

  console.log('');
  console.log(
    `  供应商型号: ${spCount}  /  参数覆盖: ${paramOverrideCount}  /  媒体: ${mediaCount}  /  Offer 绑定: ${offerLinkCount}`,
  );
}

seed()
  .then(async () => {
    // 校验写入结果
    const [sp, spm, spv, pub, offersWithSp] = await Promise.all([
      prisma.supplierProduct.count(),
      prisma.supplierProductMedia.count(),
      prisma.supplierProductParameterValue.count(),
      prisma.supplierProduct.count({ where: { status: SupplierProductStatus.PUBLISHED } }),
      prisma.offer.count({ where: { supplierProductId: { not: null } } }),
    ]);
    console.log(`\n=== 校验（总行数）===`);
    console.log(
      `  supplier_product=${sp}  supplier_product_media=${spm}  supplier_product_parameter_value=${spv}  PUBLISHED=${pub}  offer_with_supplier_product=${offersWithSp}`,
    );
    if (sp === 0 || pub === 0 || offersWithSp === 0) {
      console.error('❌ 校验失败：核心 SupplierProduct 数据仍为空');
      process.exitCode = 1;
    } else {
      console.log('✅ SupplierProduct Demo 数据补齐成功');
    }
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 种子脚本失败:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
