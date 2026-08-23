/**
 * ============================================================
 * VISNDT 662.1 Scale Simulation — 受控测试记录 (seed_scale_6621.ts)
 * ============================================================
 *
 * 用途：为 662.1 ThreeRole Scale Validation 提供「受控测试记录」：
 *   - Level 2: 明视 Supplier 10+ 型号（5 → 11，+6 条 DRAFT）
 *   - Level 3: VX-6000 能力上多供应商竞争（明视 4 / 锐视 2 / 中科 1，共 7）
 *
 * 约束：
 *   - 全部 DRAFT 状态 → 不进入 Unified Search / Product Detail / Inquiry（无搜索污染）
 *   - 型号带 SCALE 标识（description 前缀【662.1 Scale】）→ 明确可识别
 *   - 运行 --clean 时删除全部 SCALE 记录 → 可逆 / 无生产数据污染
 *   - NO Schema Change / NO Migration / NO API / NO Feature
 *
 * 运行（database 目录）：
 *   npx tsx seed_scale_6621.ts          # 写入 SCALE 记录
 *   npx tsx seed_scale_6621.ts --clean  # 删除 SCALE 记录
 * ============================================================
 */
import { PrismaClient, SupplierProductStatus } from '@prisma/client';

const prisma = new PrismaClient();
const CLEAN = process.argv.includes('--clean');
const SCALE_TAG = '【662.1 Scale】';

interface ScaleSpec {
  supplierUserEmail: string;
  productSlug: string;
  brand: string;
  series: string;
  modelNumber: string;
  slug: string;
}

const scaleRecords: ScaleSpec[] = [
  // ── Level 2: 明视 10+ 型号（+6 → 共 11）──
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: 'vx-6000-hd-video-borescope', brand: '明视', series: '基础系列', modelNumber: 'VX-6000-BASE', slug: 'scale-mingshi-vx-6000-base' },
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: 'vx-6000-hd-video-borescope', brand: '明视', series: '轻量系列', modelNumber: 'VX-6000-LITE', slug: 'scale-mingshi-vx-6000-lite' },
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: 'us-200-portable-ultrasonic-flaw-detector', brand: '明视', series: '标准系列', modelNumber: 'US-200M', slug: 'scale-mingshi-us-200m' },
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: 'fb-3000-fiber-borescope', brand: '明视', series: '防护系列', modelNumber: 'FB-3000-IP', slug: 'scale-mingshi-fb-3000-ip' },
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: 'mic-5000-metallurgical-microscope', brand: '明视', series: '高级系列', modelNumber: 'MIC-5000-ADV', slug: 'scale-mingshi-mic-5000-adv' },
  { supplierUserEmail: 'demo.supplier.01@visndt.local', productSlug: '3dscan-pro-structured-light-scanner', brand: '明视', series: '精密扫描系列', modelNumber: '3DSCAN-Pro-M', slug: 'scale-mingshi-3dscan-pro-m' },

  // ── Level 3: VX-6000 多供应商竞争 ──
  { supplierUserEmail: 'demo.supplier.02@visndt.local', productSlug: 'vx-6000-hd-video-borescope', brand: '锐视', series: '高端系列', modelNumber: 'VX-6000-MAX', slug: 'scale-ruishi-vx-6000-max' },
  { supplierUserEmail: 'demo.supplier.03@visndt.local', productSlug: 'vx-6000-hd-video-borescope', brand: '中科', series: '标准系列', modelNumber: 'VX-6000C', slug: 'scale-zhongke-vx-6000c' },
];

async function loadLookups() {
  const [users, products, members] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true } }),
    prisma.product.findMany({ select: { id: true, slug: true } }),
    prisma.organizationMember.findMany({
      select: { organizationId: true, user: { select: { email: true } } },
    }),
  ]);
  const userByEmail = new Map(users.map((u) => [u.email, u.id]));
  const productBySlug = new Map(products.filter((p) => p.slug).map((p) => [p.slug, p.id]));
  const orgByMemberEmail = new Map<string, string>();
  for (const m of members) {
    const email = m.user?.email;
    if (email && email.startsWith('demo.supplier') && !orgByMemberEmail.has(email)) {
      orgByMemberEmail.set(email, m.organizationId);
    }
  }
  return { userByEmail, productBySlug, orgByMemberEmail };
}

async function run() {
  const { userByEmail, productBySlug, orgByMemberEmail } = await loadLookups();
  if (CLEAN) {
    const deleted = await prisma.supplierProduct.deleteMany({
      where: { description: { startsWith: SCALE_TAG } },
    });
    console.log(`[CLEAN] 删除 SCALE SupplierProduct: ${deleted.count}`);
    // 清理关联媒体/参数（级联由 FK 处理，此处仅确认）
    return;
  }

  let count = 0;
  for (const spec of scaleRecords) {
    const orgId = orgByMemberEmail.get(spec.supplierUserEmail);
    const productId = productBySlug.get(spec.productSlug);
    const createdById = userByEmail.get(spec.supplierUserEmail);
    if (!orgId || !productId || !createdById) {
      console.error(`跳过（缺映射）: ${spec.supplierUserEmail} / ${spec.productSlug}`);
      continue;
    }
    await prisma.supplierProduct.upsert({
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
        description: `${SCALE_TAG} 662.1 规模模拟受控测试记录（可删除）: ${spec.brand} ${spec.series} ${spec.modelNumber}`,
        status: SupplierProductStatus.DRAFT,
      },
      create: {
        organizationId: orgId,
        platformProductId: productId,
        brand: spec.brand,
        series: spec.series,
        modelNumber: spec.modelNumber,
        slug: spec.slug,
        description: `${SCALE_TAG} 662.1 规模模拟受控测试记录（可删除）: ${spec.brand} ${spec.series} ${spec.modelNumber}`,
        status: SupplierProductStatus.DRAFT,
      },
    });
    count++;
    console.log(`  ✅ ${spec.brand} ${spec.series} ${spec.modelNumber} (${spec.supplierUserEmail})`);
  }
  console.log(`SCALE SupplierProduct 写入: ${count}`);
}

run()
  .catch((e) => {
    console.error('失败:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
