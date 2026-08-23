/**
 * ============================================================
 * VISNDT M28.1 M667 SupplierProduct Comparison — 可控比较叠加 Fixture
 * ============================================================
 *
 * 用途：为 667 SupplierProduct Comparison Experience 提供「可重复、可识别、
 *       可回滚」的比较场景数据（基于 666 M28 Demo Scale Fixture 的叠加层）：
 *
 *   VX-6000 高清视频内窥镜（Platform Capability）
 *       ├─ 明视 VX-6000-PRO  PUBLISHED  68000 CNY  ACTIVE（既有，不改动）
 *       ├─ 明视 VX-6000-HD   PUBLISHED  无 Offer（参数边界验证）   ← 本脚本发布
 *       ├─ 明视 VX-6000-BASE PUBLISHED  无 Offer（规模/无Offer边界） ← 本脚本发布
 *       ├─ 明视 VX-6000-LITE PUBLISHED  无 Offer（规模/无Offer边界） ← 本脚本发布
 *       ├─ 锐视 VX-6000-MAX  PUBLISHED  88000 CNY  ACTIVE          ← 本脚本发布
 *       ├─ 锐视 VX-6000E     PUBLISHED  无 Offer（规模/无Offer边界） ← 本脚本发布
 *       └─ 中科 VX-6000C     PUBLISHED  42000 CNY  ACTIVE          ← 本脚本发布
 *
 * 结果：7 个 PUBLISHED 型号 / 3 个组织（3 Supplier × 7 SupplierProduct 规模验证）
 *       参数差异（分辨率/长度/探头/续航/存储/IP） + 商业差异（价格区间 + 无 Offer 边界）。
 *       每组织每能力仅一个 Offer（商业层约束）→ 无 Offer 型号验证 Safe Display。
 *
 * 识别：按 supplier_product.slug 精确定位（fixture 前缀族内）。
 * 幂等：全部按自然键 upsert → 重复执行状态不变。
 * 回滚：--clean 恢复基线状态、删除本脚本创建的 Offer 与参数覆盖。
 * 约束：NO Schema Change / NO Migration / NO API / NO Business Logic / NO Feature。
 *       禁止在生产环境（NODE_ENV=production）运行。
 *
 * 运行（database 目录，已含 .env: DATABASE_URL）：
 *   npx tsx fixture/comparison_667.ts          # seed：发布比较场景
 *   npx tsx fixture/comparison_667.ts --clean  # 恢复基线
 * ============================================================
 */
import { PrismaClient, SupplierProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

type ParamSpec = { code: string; value: string; valueNumber?: number };

interface TargetSpec {
  slug: string;
  /** 恢复基线时的状态 */
  baselineStatus: 'PUBLISHED' | 'APPROVED' | 'DRAFT';
  paramOverrides: ParamSpec[];
  /** 发布时创建的 ACTIVE Offer（title / price） */
  offer?: { title: string; price: number; currency: string };
}

// slug → 667 比较目标（仅 VX-6000 家族，fixture 前缀族内）
const targets: TargetSpec[] = [
  {
    slug: 'mingshi-vx-6000-hd',
    baselineStatus: 'APPROVED',
    paramOverrides: [
      { code: 'image_resolution', value: '1920x1080' },
      { code: 'working_length', value: '3m' },
      { code: 'probe_diameter', value: '6mm' },
      { code: 'ie_battery_life', value: '4', valueNumber: 4 },
      { code: 'ie_storage', value: '64', valueNumber: 64 },
      { code: 'ie_ip_rating', value: 'IP67' },
    ],
    // 无 Offer → 验证「SupplierProduct has no Offer → Safe Display」边界
  },
  {
    slug: 'scale-ruishi-vx-6000-max',
    baselineStatus: 'DRAFT',
    paramOverrides: [
      { code: 'image_resolution', value: '3840x2160' },
      { code: 'working_length', value: '10m' },
      { code: 'probe_diameter', value: '8mm' },
      { code: 'ie_battery_life', value: '6', valueNumber: 6 },
      { code: 'ie_storage', value: '256', valueNumber: 256 },
      { code: 'ie_ip_rating', value: 'IP68' },
      { code: 'ie_display_size', value: '8英寸' },
    ],
    offer: { title: '锐视 VX-6000-MAX 高清内窥镜报价', price: 88000, currency: 'CNY' },
  },
  {
    slug: 'scale-zhongke-vx-6000c',
    baselineStatus: 'DRAFT',
    paramOverrides: [
      { code: 'image_resolution', value: '1280x720' },
      { code: 'working_length', value: '3m' },
      { code: 'probe_diameter', value: '4mm' },
      { code: 'ie_battery_life', value: '3', valueNumber: 3 },
      { code: 'ie_storage', value: '32', valueNumber: 32 },
      { code: 'ie_ip_rating', value: 'IP54' },
    ],
    offer: { title: '中科 VX-6000C 高清内窥镜报价', price: 42000, currency: 'CNY' },
  },
  // ── 3 Supplier × 7 SupplierProduct 规模验证（无 Offer 边界，商业层每组织每能力仅一个 Offer）──
  {
    slug: 'ruishi-vx-6000e',
    baselineStatus: 'DRAFT',
    paramOverrides: [
      { code: 'image_resolution', value: '1280x720' },
      { code: 'working_length', value: '2m' },
      { code: 'probe_diameter', value: '4mm' },
      { code: 'ie_battery_life', value: '2', valueNumber: 2 },
      { code: 'ie_storage', value: '16', valueNumber: 16 },
      { code: 'ie_ip_rating', value: 'IP54' },
    ],
    // 无 Offer → 锐视 Offer 已绑定 VX-6000-MAX
  },
  {
    slug: 'scale-mingshi-vx-6000-base',
    baselineStatus: 'DRAFT',
    paramOverrides: [
      { code: 'image_resolution', value: '1280x720' },
      { code: 'working_length', value: '2m' },
      { code: 'probe_diameter', value: '5mm' },
      { code: 'ie_battery_life', value: '3', valueNumber: 3 },
      { code: 'ie_storage', value: '32', valueNumber: 32 },
      { code: 'ie_ip_rating', value: 'IP54' },
    ],
    // 无 Offer → 明视 Offer 已绑定 VX-6000-PRO
  },
  {
    slug: 'scale-mingshi-vx-6000-lite',
    baselineStatus: 'DRAFT',
    paramOverrides: [
      { code: 'image_resolution', value: '1920x1080' },
      { code: 'working_length', value: '3m' },
      { code: 'probe_diameter', value: '4mm' },
      { code: 'ie_battery_life', value: '4', valueNumber: 4 },
      { code: 'ie_storage', value: '64', valueNumber: 64 },
      { code: 'ie_ip_rating', value: 'IP65' },
    ],
    // 无 Offer → 明视 Offer 已绑定 VX-6000-PRO
  },
];

const TARGET_OFFER_MARK = '667-比较';

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 禁止在生产环境运行');
    process.exit(1);
  }
  console.log('=== M28.1 M667 Comparison Fixture SEED ===');

  for (const t of targets) {
    const sp = await prisma.supplierProduct.findUnique({ where: { slug: t.slug } });
    if (!sp) {
      console.error(`  ❌ 未找到 SupplierProduct: ${t.slug}`);
      continue;
    }
    if (!sp.platformProductId || !sp.organizationId) {
      console.error(`  ❌ ${t.slug} 缺少 platformProductId/organizationId`);
      continue;
    }

    // 1) 发布
    await prisma.supplierProduct.update({
      where: { id: sp.id },
      data: {
        status: SupplierProductStatus.PUBLISHED,
        submittedAt: sp.submittedAt ?? new Date(Date.now() - 6 * 86400000),
        reviewedAt: sp.reviewedAt ?? new Date(Date.now() - 3 * 86400000),
        publishedAt: new Date(Date.now() - 1 * 86400000),
      },
    });

    // 2) 参数覆盖（按 code 解析）
    const defs = await prisma.parameterDefinition.findMany({
      where: { code: { in: t.paramOverrides.map((p) => p.code) } },
    });
    const defByCode = new Map(defs.map((d) => [d.code, d]));
    let pvCount = 0;
    for (const p of t.paramOverrides) {
      const pd = defByCode.get(p.code);
      if (!pd) {
        console.warn(`  ⚠ 忽略未知参数 code: ${p.code}（${t.slug}）`);
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
      pvCount++;
    }

    // 3) Offer（唯一约束 organizationId+productId；仅当该组织在该能力下尚无 Offer）
    if (t.offer) {
      const existing = await prisma.offer.findUnique({
        where: {
          organizationId_productId: {
            organizationId: sp.organizationId,
            productId: sp.platformProductId,
          },
        },
      });
      if (existing) {
        // 该组织在该能力下已有 Offer → 绑定到该 SupplierProduct（idempotent）
        if (existing.supplierProductId !== sp.id) {
          await prisma.offer.update({
            where: { id: existing.id },
            data: { supplierProductId: sp.id },
          });
        }
        console.log(`  ℹ ${t.slug} 复用既有 Offer: ${existing.title}`);
      } else {
        await prisma.offer.create({
          data: {
            organizationId: sp.organizationId,
            productId: sp.platformProductId,
            supplierProductId: sp.id,
            title: `${t.offer.title}（${TARGET_OFFER_MARK}）`,
            description: `${TARGET_OFFER_MARK} 受控比较叠加：${sp.brand} ${sp.modelNumber} 高清视频内窥镜`,
            price: t.offer.price,
            currency: t.offer.currency,
            status: 'ACTIVE' as const,
          },
        });
        console.log(`  ✅ ${t.slug} 创建 ACTIVE Offer ${t.offer.price} ${t.offer.currency}`);
      }
    }

    console.log(
      `  ✅ ${sp.brand} ${sp.series} ${sp.modelNumber} [PUBLISHED] 参数覆盖=${pvCount}`,
    );
  }
  console.log('✅ M667 Comparison Fixture 完成');
}

async function clean() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 禁止在生产环境运行清理');
    process.exit(1);
  }
  console.log('=== M28.1 M667 Comparison Fixture CLEAN ===');
  for (const t of targets) {
    const sp = await prisma.supplierProduct.findUnique({ where: { slug: t.slug } });
    if (!sp) {
      console.error(`  ❌ 未找到 SupplierProduct: ${t.slug}`);
      continue;
    }
    // 1) 删除本脚本创建的 Offer（title 含 667-比较 标记）
    const del = await prisma.offer.deleteMany({
      where: { supplierProductId: sp.id, title: { contains: TARGET_OFFER_MARK } },
    });
    // 2) 删除本脚本添加的参数覆盖（该型号基线无覆盖）
    const delPv = await prisma.supplierProductParameterValue.deleteMany({
      where: {
        supplierProductId: sp.id,
        parameterDefinition: {
          code: { in: t.paramOverrides.map((p) => p.code) },
        },
      },
    });
    // 3) 恢复基线状态
    await prisma.supplierProduct.update({
      where: { id: sp.id },
      data: {
        status: t.baselineStatus as SupplierProductStatus,
        publishedAt: null,
        reviewedAt: null,
        submittedAt: null,
      },
    });
    console.log(
      `  ✅ ${sp.slug} → ${t.baselineStatus}  Offer 删除=${del.count}  参数删除=${delPv.count}`,
    );
  }
  console.log('✅ M667 Comparison Fixture Cleanup 完成');
}

const mode = process.argv.includes('--clean') ? 'clean' : 'seed';
(mode === 'clean' ? clean() : seed())
  .catch((e) => {
    console.error('❌ 失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
