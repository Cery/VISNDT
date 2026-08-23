/**
 * ============================================================
 * VISNDT M28 Controlled Demo Fixture — master runner (Option C)
 * ============================================================
 *
 * 用途：为后续 Buyer / Supplier / Admin E2E、Search Regression、
 *       SupplierProduct Comparison、Product Experience Audit、M28.1
 *       Final Validation 提供「稳定、可重复、可识别、可回滚」的
 *       M28 SupplierProduct Demo Fixture。
 *
 * Architecture (Option C)：
 *   database/fixture/
 *       index.ts            <- 本文件：master runner（seed / clean / reset）
 *   驱动已验证的两个既有 seed（不做业务逻辑改写）：
 *       ../seed_supplier_product.ts  (Base Demo：13 models)
 *       ../seed_scale_6621.ts        (Scale：+8 DRAFT)
 *
 * Fixture Identification Strategy（唯一策略）：
 *   supplier_product.slug 前缀 = {scale-, mingshi-, ruishi-, zhongke-}
 *   该前缀族是 M28 Demo Fixture 的「唯一可识别标记」。
 *   已验证：当前 DB 全部 21 条 SupplierProduct 均命中该前缀族，
 *           且 seed_demo.ts 不写入 SupplierProduct（表中无非 Fixture 数据）。
 *
 * Idempotency：
 *   两个 seed 均按自然键 upsert → 重复执行 count 不变（A == B）。
 *   SupplierProductMedia 按 supplierProductId 先删后建 → 幂等。
 *
 * Rollback / Cleanup（仅影响 Fixture，保留 Core Demo）：
 *   1) offer.supplier_product_id -> NULL（解除 SP 绑定，保留 Offer 本身 = Core Demo）
 *   2) 按 slug 前缀删除 SupplierProduct（级联删除其 Media / ParameterValue）
 *   Core Demo（Users/Organizations/Platform Products/Offers/Content/Knowledge/
 *   Demand/RFQ/Inquiry/Notifications）完全不受影响。
 *
 * 约束：
 *   - NO Schema Change / NO Migration / NO API / NO Business Logic / NO Feature
 *   - 禁止在生产环境（NODE_ENV=production）运行
 *
 * 运行（database/fixture 目录，已含 .env: DATABASE_URL）：
 *   npx tsx fixture/index.ts            # seed（默认）：Base + Scale
 *   npx tsx fixture/index.ts --clean    # 仅删除 Fixture SupplierProducts
 *   npx tsx fixture/index.ts --reset    # clean + seed
 * ============================================================
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const here = path.dirname(fileURLToPath(import.meta.url)); // database/fixture
const dbDir = path.resolve(here, '..'); // database
const FLAG = "(scale|mingshi|ruishi|zhongke)-";

const mode = process.argv.includes('--clean')
  ? 'clean'
  : process.argv.includes('--reset')
    ? 'reset'
    : 'seed';

function runSeed(file: string) {
  const prior = process.env.NODE_OPTIONS;
  // 遮蔽 npx.cmd + shell:true 触发的 DEP0190 外观警告（file 为可信内部常量，无注入面）
  const extra = prior ? `${prior} --no-warnings` : '--no-warnings';
  process.env.NODE_OPTIONS = extra;
  try {
    const r = spawnSync('npx', ['tsx', file], { cwd: dbDir, stdio: 'inherit', shell: true });
    if (r.status !== 0) {
      console.error(`❌ ${file} 执行失败，退出码 ${r.status}`);
      process.exit(r.status ?? 1);
    }
  } finally {
    process.env.NODE_OPTIONS = prior ?? '';
  }
}

async function counts(label: string) {
  const q = (sql: string) => prisma.$queryRawUnsafe(sql);
  const [sp, pub, offersSp] = await Promise.all([
    q('select count(*)::int n from supplier_product'),
    q("select count(*)::int n from supplier_product where status='PUBLISHED'"),
    q('select count(*)::int n from offer where supplier_product_id is not null'),
  ]);
  console.log(`  [${label}] supplier_product=${sp[0].n}  PUBLISHED=${pub[0].n}  offer_with_sp=${offersSp[0].n}`);
  return { sp: sp[0].n, pub: pub[0].n, offersSp: offersSp[0].n };
}

async function clean() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 禁止在生产环境运行清理');
    process.exit(1);
  }
  console.log('=== M28 Fixture CLEAN ===');
  // 1) 解除 Offer 绑定（保留 Offer = Core Demo）
  const unlink = await prisma.$executeRawUnsafe(
    `update offer set supplier_product_id = NULL
      where supplier_product_id in (select id from supplier_product where slug ~ '${FLAG}')`,
  );
  // 2) 删除 Fixture SupplierProduct（级联 Media / ParameterValue）
  const del = await prisma.$executeRawUnsafe(
    `delete from supplier_product where slug ~ '${FLAG}'`,
  );
  console.log(`  解除 Offer 绑定: ${unlink}  /  删除 SupplierProduct: ${del}`);
  await counts('after clean');
}

async function run() {
  console.log('=== VISNDT M28 Controlled Demo Fixture ===');
  console.log(`mode = ${mode}`);

  if (mode === 'clean' || mode === 'reset') {
    await clean();
  }
  if (mode === 'seed' || mode === 'reset') {
    await counts('before seed');
    runSeed('seed_supplier_product.ts'); // Base Demo 13 models
    runSeed('seed_scale_6621.ts');       // Scale +8 DRAFT
    await counts('after seed');
  }
  await prisma.$disconnect();
  console.log('✅ Fixture 完成');
}

run().catch(async (e) => {
  console.error('❌ Fixture 失败:', e);
  await prisma.$disconnect();
  process.exit(1);
});