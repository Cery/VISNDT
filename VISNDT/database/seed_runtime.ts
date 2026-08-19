/**
 * ============================================================
 * VISNDT Runtime E2E Seed — seed_runtime.ts
 * ============================================================
 *
 * 用途：为 M24.2 收口后的【真运行时 E2E 验证】补齐缺失业务数据：
 *   - Product（产品，status=ACTIVE，对齐现库 12 分类）
 *   - ProductParameterValue + ProductParameterDefinition（对齐现库 45 参数）
 *   - Offer（报价，status=ACTIVE，SUPPLIER 组织 → 产品）
 *   - KnowledgeEntry（知识，status=PUBLISHED，对齐现库 6 知识分类）
 *
 * 约束：
 *   - 只补数据，不新增模型 / 表 / 领域
 *   - 幂等：全部按自然键 upsert，重复运行不产生重复数据
 *   - 不触碰需求 / RFQ / 匹配等已存在数据
 *   - 严格遵循 Product Global Catalog（Product 不属于 Organization）
 *
 * 运行（在 database 目录，已含 .env: DATABASE_URL / DEMO_DATA_MODE）：
 *   npx tsx seed_runtime.ts
 * ============================================================
 */

import { PrismaClient, OfferStatus, KnowledgeEntryStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 自然键 → id 的内存映射（运行时从现库读取，避免硬编码 id）
const catBySlug = new Map<string, string>();
const paramByCode = new Map<string, { id: string; dataType: string }>();
const orgByName = new Map<string, string>();
const userByEmail = new Map<string, string>();
const domainBySlug = new Map<string, string>();
const kcBySlug = new Map<string, { id: string; domainId: string }>();

async function loadLookups() {
  const [cats, params, orgs, users, domains, kcs] = await Promise.all([
    prisma.productCategory.findMany({ select: { id: true, slug: true } }),
    prisma.parameterDefinition.findMany({ select: { id: true, code: true, dataType: true } }),
    prisma.organization.findMany({ select: { id: true, name: true } }),
    prisma.user.findMany({ select: { id: true, email: true } }),
    prisma.knowledgeDomain.findMany({ select: { id: true, slug: true } }),
    prisma.knowledgeCategory.findMany({ select: { id: true, slug: true, domainId: true } }),
  ]);

  for (const c of cats) catBySlug.set(c.slug, c.id);
  for (const p of params) paramByCode.set(p.code, { id: p.id, dataType: p.dataType });
  for (const o of orgs) orgByName.set(o.name, o.id);
  for (const u of users) userByEmail.set(u.email, u.id);
  for (const d of domains) domainBySlug.set(d.slug, d.id);
  for (const k of kcs) kcBySlug.set(k.slug, { id: k.id, domainId: k.domainId });

  console.log(`  lookups: ${catBySlug.size} 分类 / ${paramByCode.size} 参数 / ${orgByName.size} 组织 / ${userByEmail.size} 用户 / ${domainBySlug.size} 知识领域 / ${kcBySlug.size} 知识分类`);
}

function mustGet(map: Map<string, string>, key: string, label: string): string {
  const v = map.get(key);
  if (!v) throw new Error(`缺少 ${label}: ${key}`);
  return v;
}

// 单个产品的参数值（code → value），NUMBER 类型会额外写 valueNumber
type ParamSpec = { code: string; value: string; valueNumber?: number };

interface ProductSpec {
  slug: string;
  categorySlug: string;
  name: string;
  model: string;
  description: string;
  createdByEmail: string;
  params: ParamSpec[];
}

interface OfferSpec {
  orgName: string;
  productSlug: string;
  title: string;
  description: string;
  price: string | null;
  createdByEmail: string;
}

interface KnowledgeSpec {
  slug: string;
  domainSlug: string;
  categorySlug: string;
  title: string;
  summary: string;
  authorEmail: string;
}

// ============================================================
// 产品定义（Product Global Catalog：产品不归属组织）
// ============================================================

const products: ProductSpec[] = [
  {
    slug: 'vx-6000-hd-video-borescope',
    categorySlug: 'industrial-endoscope',
    name: 'VX-6000 高清视频内窥镜',
    model: 'VX-6000',
    description: '6.0mm 探头直径的高清视频内窥镜，支持 1920x1080 成像与 5.5 英寸显示屏，适用于航空发动机、压力容器等内部检测。',
    createdByEmail: 'demo.supplier.01@visndt.local',
    params: [
      { code: 'probe_diameter', value: '6.0mm' },
      { code: 'working_length', value: '3m' },
      { code: 'field_of_view', value: '120', valueNumber: 120 },
      { code: 'image_resolution', value: '1920x1080' },
      { code: 'illumination_type', value: 'LED白光' },
      { code: 'ie_ip_rating', value: 'IP67' },
      { code: 'ie_battery_life', value: '4', valueNumber: 4 },
      { code: 'ie_display_size', value: '5.5英寸' },
      { code: 'ie_storage', value: '64', valueNumber: 64 },
      { code: 'ie_weight', value: '0.9', valueNumber: 0.9 },
      { code: 'articulation_angle', value: '上/下/左/右 120°/120°/120°/120°' },
    ],
  },
  {
    slug: 'fb-3000-fiber-borescope',
    categorySlug: 'industrial-endoscope',
    name: 'FB-3000 光纤内窥镜',
    model: 'FB-3000',
    description: '4.0mm 超细探头光纤内窥镜，钨丝编织插入管，适合狭窄弯曲管路内部检测。',
    createdByEmail: 'demo.supplier.02@visndt.local',
    params: [
      { code: 'probe_diameter', value: '4.0mm' },
      { code: 'working_length', value: '2m' },
      { code: 'image_resolution', value: '1280x720' },
      { code: 'illumination_type', value: '光纤导光' },
      { code: 'ie_ip_rating', value: 'IP65' },
      { code: 'battery_life', value: '3', valueNumber: 3 },
      { code: 'insertion_tube_material', value: '钨丝编织' },
      { code: 'articulation_angle', value: '上/下/左/右 140°/140°/140°/140°' },
    ],
  },
  {
    slug: 'us-800-ultrasonic-flaw-detector',
    categorySlug: 'ultrasonic-flaw-detector',
    name: 'US-800 超声波探伤仪',
    model: 'US-800',
    description: '高灵敏度数字超声波探伤仪，0-6000mm 检测范围，适用于焊缝、铸件、锻件内部缺陷检测。',
    createdByEmail: 'demo.supplier.03@visndt.local',
    params: [
      { code: 'detection_range', value: '0-6000mm' },
      { code: 'operating_frequency', value: '0.5-15MHz' },
      { code: 'resolution', value: '0.1mm' },
      { code: 'gain_range', value: '110dB' },
      { code: 'sensitivity_margin', value: '60', valueNumber: 60 },
      { code: 'channel_count', value: '2', valueNumber: 2 },
      { code: 'battery_life', value: '8', valueNumber: 8 },
      { code: 'ip_rating', value: 'IP65' },
      { code: 'operating_temperature', value: '-20~60℃' },
      { code: 'power_supply', value: '锂电池' },
      { code: 'weight', value: '1.2', valueNumber: 1.2 },
    ],
  },
  {
    slug: 'us-200-portable-ultrasonic-flaw-detector',
    categorySlug: 'ultrasonic-flaw-detector',
    name: 'US-200 便携式超声波探伤仪',
    model: 'US-200',
    description: '轻量便携超声波探伤仪，0-3000mm 检测范围，适合现场快速巡检。',
    createdByEmail: 'demo.supplier.03@visndt.local',
    params: [
      { code: 'detection_range', value: '0-3000mm' },
      { code: 'operating_frequency', value: '1-10MHz' },
      { code: 'resolution', value: '0.1mm' },
      { code: 'gain_range', value: '100dB' },
      { code: 'battery_life', value: '6', valueNumber: 6 },
      { code: 'ip_rating', value: 'IP54' },
      { code: 'weight', value: '0.6', valueNumber: 0.6 },
      { code: 'power_supply', value: '锂电池' },
    ],
  },
  {
    slug: '3dscan-pro-structured-light-scanner',
    categorySlug: '3d-scanner',
    name: '3DSCAN-Pro 结构光三维扫描仪',
    model: '3DSCAN-Pro',
    description: '结构光三维扫描仪，0.02mm 高精度，用于逆向工程与尺寸检测。',
    createdByEmail: 'demo.supplier.01@visndt.local',
    params: [
      { code: 'resolution', value: '0.02mm' },
      { code: 'field_of_view', value: '300', valueNumber: 300 },
      { code: 'data_interface', value: 'USB3.0' },
      { code: 'power_supply', value: '交流电源' },
      { code: 'weight', value: '2.5', valueNumber: 2.5 },
      { code: 'operating_temperature', value: '0~40℃' },
    ],
  },
  {
    slug: 'mic-5000-metallurgical-microscope',
    categorySlug: 'industrial-microscope',
    name: 'MIC-5000 工业金相显微镜',
    model: 'MIC-5000',
    description: '工业金相显微镜，4K 成像与 50x 变焦，用于材料金相组织观察。',
    createdByEmail: 'demo.supplier.02@visndt.local',
    params: [
      { code: 'zoom_factor', value: '50', valueNumber: 50 },
      { code: 'image_resolution', value: '4K' },
      { code: 'image_sensor', value: 'CMOS' },
      { code: 'data_interface', value: 'HDMI/USB' },
      { code: 'illumination_type', value: 'LED环形光' },
      { code: 'focus_type', value: '手动/电动' },
    ],
  },
];

// ============================================================
// 报价定义（SUPPLIER 组织 → 产品，@@unique[organizationId, productId]）
// ============================================================

const offers: OfferSpec[] = [
  {
    orgName: '明视工业检测设备有限公司',
    productSlug: 'vx-6000-hd-video-borescope',
    title: '明视 VX-6000 高清视频内窥镜报价',
    description: '明视工业检测设备有限公司提供的 VX-6000 高清视频内窥镜报价。',
    price: '68000.00',
    createdByEmail: 'demo.supplier.01@visndt.local',
  },
  {
    orgName: '锐视检测技术有限公司',
    productSlug: 'fb-3000-fiber-borescope',
    title: '锐视 FB-3000 光纤内窥镜报价',
    description: '锐视检测技术有限公司提供的 FB-3000 光纤内窥镜报价。',
    price: '32000.00',
    createdByEmail: 'demo.supplier.02@visndt.local',
  },
  {
    orgName: '中科检测设备有限公司',
    productSlug: 'us-800-ultrasonic-flaw-detector',
    title: '中科 US-800 超声波探伤仪报价',
    description: '中科检测设备有限公司提供的 US-800 超声波探伤仪报价。',
    price: '86000.00',
    createdByEmail: 'demo.supplier.03@visndt.local',
  },
  {
    orgName: '中科检测设备有限公司',
    productSlug: 'us-200-portable-ultrasonic-flaw-detector',
    title: '中科 US-200 便携式超声波探伤仪报价',
    description: '中科检测设备有限公司提供的 US-200 便携式超声波探伤仪报价。',
    price: '36000.00',
    createdByEmail: 'demo.supplier.03@visndt.local',
  },
  {
    orgName: '明视工业检测设备有限公司',
    productSlug: '3dscan-pro-structured-light-scanner',
    title: '明视 3DSCAN-Pro 三维扫描仪报价',
    description: '明视工业检测设备有限公司提供的 3DSCAN-Pro 三维扫描仪报价。',
    price: '125000.00',
    createdByEmail: 'demo.supplier.01@visndt.local',
  },
  {
    orgName: '锐视检测技术有限公司',
    productSlug: 'mic-5000-metallurgical-microscope',
    title: '锐视 MIC-5000 金相显微镜报价',
    description: '锐视检测技术有限公司提供的 MIC-5000 金相显微镜报价。',
    price: '54000.00',
    createdByEmail: 'demo.supplier.02@visndt.local',
  },
];

// ============================================================
// 知识定义（对齐现库 6 知识分类）
// ============================================================

const knowledge: KnowledgeSpec[] = [
  {
    slug: 'industrial-endoscope-parameter-guide',
    domainSlug: 'inspection-parameters',
    categorySlug: 'endoscope-parameters',
    title: '工业内窥镜关键参数选型指南',
    summary: '探头直径、工作长度、分辨率等关键参数如何影响内窥镜的检测能力。',
    authorEmail: 'admin@visndt.com',
  },
  {
    slug: 'pipeline-internal-inspection-method',
    domainSlug: 'inspection-applications',
    categorySlug: 'pipeline-inspection',
    title: '管道内部检测方法与内窥镜应用',
    summary: '介绍管道内部检测的常见方法，以及内窥镜在管道检测中的典型应用。',
    authorEmail: 'admin@visndt.com',
  },
  {
    slug: 'ultrasonic-flaw-detection-basics',
    domainSlug: 'inspection-technology',
    categorySlug: 'ultrasonic-testing',
    title: '超声波探伤基本原理',
    summary: '超声波探伤的工作原理、探头类型与典型缺陷识别方法。',
    authorEmail: 'admin@visndt.com',
  },
  {
    slug: 'flaw-detector-parameter-explanation',
    domainSlug: 'inspection-parameters',
    categorySlug: 'flaw-detection-parameters',
    title: '探伤仪参数解析：增益、灵敏度与分辨率',
    summary: '深入解析探伤仪增益范围、灵敏度余量、分辨率等核心参数的含义。',
    authorEmail: 'admin@visndt.com',
  },
  {
    slug: 'structured-light-3d-scanning',
    domainSlug: 'inspection-technology',
    categorySlug: '3d-scanning',
    title: '结构光三维扫描技术原理',
    summary: '结构光三维扫描的原理、精度影响因素与典型应用场景。',
    authorEmail: 'admin@visndt.com',
  },
  {
    slug: 'visual-inspection-industrial-microscope',
    domainSlug: 'inspection-technology',
    categorySlug: 'visual-inspection',
    title: '工业显微镜在视觉检测中的应用',
    summary: '工业金相显微镜在材料组织观察与视觉检测中的应用。',
    authorEmail: 'admin@visndt.com',
  },
];

// ============================================================
// 执行
// ============================================================

async function seed() {
  console.log('=== VISNDT Runtime E2E Seed ===');
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 禁止在生产环境运行种子脚本');
    process.exit(1);
  }

  await loadLookups();

  // --- Products ---
  let productCount = 0;
  for (const spec of products) {
    const categoryId = mustGet(catBySlug, spec.categorySlug, '产品分类');
    const createdById = mustGet(userByEmail, spec.createdByEmail, '创建人用户');
    const product = await prisma.product.upsert({
      where: { slug: spec.slug },
      update: {
        categoryId,
        name: spec.name,
        model: spec.model,
        description: spec.description,
        status: 'ACTIVE',
        createdById,
      },
      create: {
        slug: spec.slug,
        categoryId,
        name: spec.name,
        model: spec.model,
        description: spec.description,
        status: 'ACTIVE',
        createdById,
      },
    });
    productCount++;

    // Parameter values + curated display order
    let order = 0;
    for (const p of spec.params) {
      const pd = paramByCode.get(p.code);
      if (!pd) {
        console.warn(`  ⚠ 忽略未知参数 code: ${p.code}`);
        continue;
      }
      order++;

      await prisma.productParameterDefinition.upsert({
        where: {
          productId_parameterDefinitionId: {
            productId: product.id,
            parameterDefinitionId: pd.id,
          },
        },
        update: { displayOrder: order },
        create: {
          productId: product.id,
          parameterDefinitionId: pd.id,
          displayOrder: order,
        },
      });

      await prisma.productParameterValue.upsert({
        where: {
          productId_parameterDefinitionId: {
            productId: product.id,
            parameterDefinitionId: pd.id,
          },
        },
        update: { value: p.value, valueNumber: p.valueNumber ?? null },
        create: {
          productId: product.id,
          parameterDefinitionId: pd.id,
          value: p.value,
          valueNumber: p.valueNumber ?? null,
        },
      });
    }
    console.log(`  ✅ 产品 ${spec.name}（含 ${spec.params.length} 参数值）`);
  }

  // --- Offers ---
  let offerCount = 0;
  for (const spec of offers) {
    const orgId = mustGet(orgByName, spec.orgName, '报价组织');
    const createdBy = mustGet(userByEmail, spec.createdByEmail, '报价创建人');

    // product table lookup（slug → product id）
    const product = await prisma.product.findUnique({ where: { slug: spec.productSlug } });
    if (!product) throw new Error(`产品不存在: ${spec.productSlug}`);

    await prisma.offer.upsert({
      where: { organizationId_productId: { organizationId: orgId, productId: product.id } },
      update: {
        title: spec.title,
        description: spec.description,
        price: spec.price,
        status: OfferStatus.ACTIVE,
        createdBy,
      },
      create: {
        organizationId: orgId,
        productId: product.id,
        title: spec.title,
        description: spec.description,
        price: spec.price,
        status: OfferStatus.ACTIVE,
        createdBy,
      },
    });
    offerCount++;
    console.log(`  ✅ 报价 ${spec.title}`);
  }

  // --- Knowledge ---
  let knowledgeCount = 0;
  for (const spec of knowledge) {
    const kc = kcBySlug.get(spec.categorySlug);
    if (!kc) throw new Error(`知识分类不存在: ${spec.categorySlug}`);
    const domainId = mustGet(domainBySlug, spec.domainSlug, '知识领域');
    const authorId = mustGet(userByEmail, spec.authorEmail, '知识作者');

    await prisma.knowledgeEntry.upsert({
      where: { slug: spec.slug },
      update: {
        domainId,
        categoryId: kc.id,
        title: spec.title,
        summary: spec.summary,
        structuredBody: { sections: [{ heading: spec.title, paragraphs: [spec.summary] }] },
        status: KnowledgeEntryStatus.PUBLISHED,
        authorId,
        publishedAt: new Date(),
      },
      create: {
        slug: spec.slug,
        domainId,
        categoryId: kc.id,
        title: spec.title,
        summary: spec.summary,
        structuredBody: { sections: [{ heading: spec.title, paragraphs: [spec.summary] }] },
        status: KnowledgeEntryStatus.PUBLISHED,
        authorId,
        publishedAt: new Date(),
      },
    });
    knowledgeCount++;
    console.log(`  ✅ 知识 ${spec.title}`);
  }

  console.log('');
  console.log(`  产品: ${productCount}  /  报价: ${offerCount}  /  知识: ${knowledgeCount}`);
}

seed()
  .then(async () => {
    // 校验写入结果
    const [p, pv, pd, o, k] = await Promise.all([
      prisma.product.count(),
      prisma.productParameterValue.count(),
      prisma.productParameterDefinition.count(),
      prisma.offer.count(),
      prisma.knowledgeEntry.count(),
    ]);
    console.log(`\n=== 校验（总行数）===`);
    console.log(`  product=${p}  product_parameter_value=${pv}  product_parameter_definition=${pd}  offer=${o}  knowledge_entry=${k}`);
    if (p === 0 || o === 0 || k === 0) {
      console.error('❌ 校验失败：核心数据仍为空');
      process.exitCode = 1;
    } else {
      console.log('✅ 数据补齐成功（产品/报价/知识均非空）');
    }
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 种子脚本失败:', e);
    await prisma.$disconnect();
    process.exit(1);
  });