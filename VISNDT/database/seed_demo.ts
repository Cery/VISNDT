/**
 * ============================================
 * VISNDT M21.8.3 Demo Dataset Initialization
 * ============================================
 *
 * Purpose:
 *   Reproducible, production-safe demo dataset for platform
 *   demonstration, business flow validation, and analytics display.
 *
 * Safety:
 *   - NODE_ENV !== 'production' required
 *   - DEMO_DATA_MODE=true required
 *   - All demo entities use DEMO_ prefix or demo. email namespace
 *   - Upsert-based idempotency (deterministic lookup keys)
 *   - No TRUNCATE / DELETE FROM * / DROP TABLE
 *   - No mutation of non-demo data
 *
 * Run:
 *   npx tsx seed_demo.ts
 *
 * ============================================
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// ============================================
// Safety Gates
// ============================================

function safetyGate(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const demoMode = process.env.DEMO_DATA_MODE;

  console.log('=== VISNDT Demo Dataset Safety Check ===');
  console.log(`  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'unknown'}`);
  console.log(`  NODE_ENV: ${nodeEnv}`);
  console.log(`  DEMO_DATA_MODE: ${demoMode || 'NOT SET'}`);

  if (nodeEnv === 'production') {
    console.error('\n❌ FATAL: NODE_ENV=production. Demo seed is forbidden on production databases.');
    process.exit(1);
  }

  if (demoMode !== 'true') {
    console.error('\n❌ FATAL: DEMO_DATA_MODE is not "true". Demo seed requires explicit opt-in.');
    console.error('   Set DEMO_DATA_MODE=true in your .env file.');
    process.exit(1);
  }

  console.log('✅ Safety gates passed.\n');
}

// ============================================
// Deterministic helpers
// ============================================

function demoId(seed: string): string {
  // Generate deterministic UUIDs from seed (32 hex chars, no dashes — Prisma @db.Uuid simple format)
  return crypto.createHash('sha256').update(`VISNDT_DEMO_${seed}`).digest('hex').substring(0, 32);
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(crypto.randomInt(0, arr.length))];
}

// ============================================
// Demo Data Definitions
// ============================================

const DEMO_PASSWORD_HASH = bcrypt.hashSync('demo123456', 10);

// --- Users ---
const DEMO_USERS = [
  {
    id: demoId('user_admin'),
    email: 'demo.admin@visndt.local',
    name: 'Demo Admin',
    role: 'ADMIN',
  },
  {
    id: demoId('user_buyer_01'),
    email: 'demo.buyer.01@visndt.local',
    name: '张检测',
    role: 'BUYER',
  },
  {
    id: demoId('user_buyer_02'),
    email: 'demo.buyer.02@visndt.local',
    name: '李质检',
    role: 'BUYER',
  },
  {
    id: demoId('user_supplier_01'),
    email: 'demo.supplier.01@visndt.local',
    name: '王明视',
    role: 'SUPPLIER',
  },
  {
    id: demoId('user_supplier_02'),
    email: 'demo.supplier.02@visndt.local',
    name: '赵锐视',
    role: 'SUPPLIER',
  },
  {
    id: demoId('user_supplier_03'),
    email: 'demo.supplier.03@visndt.local',
    name: '陈中科',
    role: 'SUPPLIER',
  },
];

// --- Organizations ---
const DEMO_ORGANIZATIONS = [
  {
    id: demoId('org_admin'),
    name: 'VISNDT 平台运营中心',
    type: 'ADMIN',
  },
  {
    id: demoId('org_buyer_01'),
    name: '江南航空检测技术中心',
    type: 'BUYER',
  },
  {
    id: demoId('org_supplier_01'),
    name: '明视工业检测设备有限公司',
    type: 'SUPPLIER',
  },
  {
    id: demoId('org_supplier_02'),
    name: '锐视检测技术有限公司',
    type: 'SUPPLIER',
  },
  {
    id: demoId('org_supplier_03'),
    name: '中科检测设备有限公司',
    type: 'SUPPLIER',
  },
];

// --- Categories ---
const DEMO_CATEGORIES = [
  { id: demoId('cat_01'), name: '电子内窥镜', slug: 'electronic-borescope' },
  { id: demoId('cat_02'), name: '光学内窥镜', slug: 'optical-borescope' },
  { id: demoId('cat_03'), name: '光纤内窥镜', slug: 'fiber-borescope' },
  { id: demoId('cat_04'), name: '管道镜', slug: 'pipe-scope' },
  { id: demoId('cat_05'), name: '爬行机器人', slug: 'crawler-robot' },
];

// --- Parameter Groups ---
const DEMO_PARAM_GROUPS = [
  { id: demoId('pg_01'), name: '光学参数', code: 'OPTICAL_PARAMS' },
  { id: demoId('pg_02'), name: '物理参数', code: 'PHYSICAL_PARAMS' },
  { id: demoId('pg_03'), name: '性能参数', code: 'PERFORMANCE_PARAMS' },
  { id: demoId('pg_04'), name: '环境参数', code: 'ENVIRONMENT_PARAMS' },
];

// --- Parameter Definitions ---
const DEMO_PARAM_DEFS = [
  { id: demoId('pd_01'), groupId: demoId('pg_01'), name: '分辨率', code: 'resolution', dataType: 'STRING' as const, unit: null },
  { id: demoId('pd_02'), groupId: demoId('pg_01'), name: '像素', code: 'pixel', dataType: 'NUMBER' as const, unit: '万' },
  { id: demoId('pd_03'), groupId: demoId('pg_01'), name: '视场角', code: 'fov', dataType: 'NUMBER' as const, unit: '°' },
  { id: demoId('pd_04'), groupId: demoId('pg_01'), name: '景深', code: 'depth_of_field', dataType: 'STRING' as const, unit: 'mm' },
  { id: demoId('pd_05'), groupId: demoId('pg_01'), name: '光源类型', code: 'light_source', dataType: 'ENUM' as const, unit: null },
  { id: demoId('pd_06'), groupId: demoId('pg_02'), name: '探头直径', code: 'probe_diameter', dataType: 'NUMBER' as const, unit: 'mm' },
  { id: demoId('pd_07'), groupId: demoId('pg_02'), name: '工作长度', code: 'working_length', dataType: 'NUMBER' as const, unit: 'm' },
  { id: demoId('pd_08'), groupId: demoId('pg_02'), name: '弯曲半径', code: 'bend_radius', dataType: 'NUMBER' as const, unit: 'mm' },
  { id: demoId('pd_09'), groupId: demoId('pg_02'), name: '显示屏尺寸', code: 'screen_size', dataType: 'NUMBER' as const, unit: '英寸' },
  { id: demoId('pd_10'), groupId: demoId('pg_03'), name: '防水等级', code: 'waterproof', dataType: 'STRING' as const, unit: null },
  { id: demoId('pd_11'), groupId: demoId('pg_03'), name: '工作温度', code: 'operating_temp', dataType: 'STRING' as const, unit: '°C' },
  { id: demoId('pd_12'), groupId: demoId('pg_04'), name: '导向方式', code: 'steering_mode', dataType: 'ENUM' as const, unit: null },
];

// --- Products (12) ---
interface DemoProduct {
  id: string;
  categoryId: string;
  name: string;
  model: string;
  slug: string;
  description: string;
  status: string;
  seoTitle: string;
  params: { code: string; value: string; valueNumber?: number }[];
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: demoId('prod_01'),
    categoryId: demoId('cat_01'),
    name: '明视高清电子内窥镜 MV-4500',
    model: 'MV-4500',
    slug: 'demo-mv4500-hd-electronic-borescope',
    description: 'MV-4500 是一款高性能工业电子内窥镜，采用 1080P 高清成像系统，支持 360° 全向导向，适用于航空发动机、压力管道等高精度内部检测场景。',
    status: 'ACTIVE',
    seoTitle: '明视高清电子内窥镜 MV-4500 | 工业检测设备',
    params: [
      { code: 'resolution', value: '1920×1080' },
      { code: 'pixel', value: '200', valueNumber: 200 },
      { code: 'fov', value: '120', valueNumber: 120 },
      { code: 'depth_of_field', value: '10-80' },
      { code: 'light_source', value: 'LED' },
      { code: 'probe_diameter', value: '6.0', valueNumber: 6.0 },
      { code: 'working_length', value: '3.0', valueNumber: 3.0 },
      { code: 'bend_radius', value: '40', valueNumber: 40 },
      { code: 'screen_size', value: '5.0', valueNumber: 5.0 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-20~60' },
      { code: 'steering_mode', value: '360°电动' },
    ],
  },
  {
    id: demoId('prod_02'),
    categoryId: demoId('cat_01'),
    name: '明视便携电子内窥镜 MV-3200',
    model: 'MV-3200',
    slug: 'demo-mv3200-portable-electronic-borescope',
    description: 'MV-3200 是一款便携式工业电子内窥镜，机身轻巧，适用于现场快速检测与移动巡检场景。',
    status: 'ACTIVE',
    seoTitle: '明视便携电子内窥镜 MV-3200 | 移动检测',
    params: [
      { code: 'resolution', value: '1280×720' },
      { code: 'pixel', value: '100', valueNumber: 100 },
      { code: 'fov', value: '90', valueNumber: 90 },
      { code: 'depth_of_field', value: '5-60' },
      { code: 'light_source', value: 'LED' },
      { code: 'probe_diameter', value: '4.0', valueNumber: 4.0 },
      { code: 'working_length', value: '2.0', valueNumber: 2.0 },
      { code: 'bend_radius', value: '30', valueNumber: 30 },
      { code: 'screen_size', value: '3.5', valueNumber: 3.5 },
      { code: 'waterproof', value: 'IP65' },
      { code: 'operating_temp', value: '-10~50' },
      { code: 'steering_mode', value: '手动' },
    ],
  },
  {
    id: demoId('prod_03'),
    categoryId: demoId('cat_01'),
    name: '锐视超清电子内窥镜 RS-8000',
    model: 'RS-8000',
    slug: 'demo-rs8000-ultra-hd-borescope',
    description: 'RS-8000 采用 4K 超清成像系统，配备大尺寸显示屏，适用于精密制造、航空航天等高端检测场景。',
    status: 'ACTIVE',
    seoTitle: '锐视超清电子内窥镜 RS-8000 | 4K 工业检测',
    params: [
      { code: 'resolution', value: '3840×2160' },
      { code: 'pixel', value: '800', valueNumber: 800 },
      { code: 'fov', value: '140', valueNumber: 140 },
      { code: 'depth_of_field', value: '15-100' },
      { code: 'light_source', value: 'LED+激光' },
      { code: 'probe_diameter', value: '8.0', valueNumber: 8.0 },
      { code: 'working_length', value: '5.0', valueNumber: 5.0 },
      { code: 'bend_radius', value: '50', valueNumber: 50 },
      { code: 'screen_size', value: '7.0', valueNumber: 7.0 },
      { code: 'waterproof', value: 'IP68' },
      { code: 'operating_temp', value: '-30~70' },
      { code: 'steering_mode', value: '360°电动' },
    ],
  },
  {
    id: demoId('prod_04'),
    categoryId: demoId('cat_02'),
    name: '中科光学内窥镜 ZK-2000',
    model: 'ZK-2000',
    slug: 'demo-zk2000-optical-borescope',
    description: 'ZK-2000 是一款刚性光学内窥镜，采用优质光学镜片组，成像清晰锐利，适用于精密机械加工件内部检测。',
    status: 'ACTIVE',
    seoTitle: '中科光学内窥镜 ZK-2000 | 精密检测',
    params: [
      { code: 'resolution', value: '光学级' },
      { code: 'fov', value: '70', valueNumber: 70 },
      { code: 'depth_of_field', value: '3-30' },
      { code: 'light_source', value: '光纤导光' },
      { code: 'probe_diameter', value: '2.7', valueNumber: 2.7 },
      { code: 'working_length', value: '0.3', valueNumber: 0.3 },
      { code: 'waterproof', value: 'IP54' },
      { code: 'operating_temp', value: '0~45' },
      { code: 'steering_mode', value: '固定视角' },
    ],
  },
  {
    id: demoId('prod_05'),
    categoryId: demoId('cat_02'),
    name: '锐视光学内窥镜 RS-1000',
    model: 'RS-1000',
    slug: 'demo-rs1000-optical-borescope',
    description: 'RS-1000 刚性光学内窥镜，支持多种视角镜片更换，适用于汽车零部件内部缺陷检测。',
    status: 'ACTIVE',
    seoTitle: '锐视光学内窥镜 RS-1000 | 汽车零部件检测',
    params: [
      { code: 'resolution', value: '光学级' },
      { code: 'fov', value: '90', valueNumber: 90 },
      { code: 'depth_of_field', value: '5-50' },
      { code: 'light_source', value: '光纤导光' },
      { code: 'probe_diameter', value: '4.0', valueNumber: 4.0 },
      { code: 'working_length', value: '0.5', valueNumber: 0.5 },
      { code: 'waterproof', value: 'IP54' },
      { code: 'operating_temp', value: '0~45' },
      { code: 'steering_mode', value: '可换视角' },
    ],
  },
  {
    id: demoId('prod_06'),
    categoryId: demoId('cat_03'),
    name: '明视光纤内窥镜 MV-F200',
    model: 'MV-F200',
    slug: 'demo-mvf200-fiber-borescope',
    description: 'MV-F200 光纤内窥镜采用超细光纤束传输图像，探头直径仅 2.0mm，适用于极窄空间检测。',
    status: 'ACTIVE',
    seoTitle: '明视光纤内窥镜 MV-F200 | 超细检测',
    params: [
      { code: 'resolution', value: '30,000像素光纤' },
      { code: 'fov', value: '60', valueNumber: 60 },
      { code: 'depth_of_field', value: '2-20' },
      { code: 'light_source', value: '光纤导光' },
      { code: 'probe_diameter', value: '2.0', valueNumber: 2.0 },
      { code: 'working_length', value: '1.5', valueNumber: 1.5 },
      { code: 'bend_radius', value: '20', valueNumber: 20 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-10~60' },
      { code: 'steering_mode', value: '柔性' },
    ],
  },
  {
    id: demoId('prod_07'),
    categoryId: demoId('cat_03'),
    name: '锐视光纤内窥镜 RS-F500',
    model: 'RS-F500',
    slug: 'demo-rsf500-fiber-borescope',
    description: 'RS-F500 工业级光纤内窥镜，具备优异的光纤成像质量与耐用性，适合严苛工业环境。',
    status: 'ACTIVE',
    seoTitle: '锐视光纤内窥镜 RS-F500 | 工业级检测',
    params: [
      { code: 'resolution', value: '50,000像素光纤' },
      { code: 'fov', value: '80', valueNumber: 80 },
      { code: 'depth_of_field', value: '3-30' },
      { code: 'light_source', value: 'LED光纤' },
      { code: 'probe_diameter', value: '3.0', valueNumber: 3.0 },
      { code: 'working_length', value: '2.0', valueNumber: 2.0 },
      { code: 'bend_radius', value: '25', valueNumber: 25 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-20~60' },
      { code: 'steering_mode', value: '柔性' },
    ],
  },
  {
    id: demoId('prod_08'),
    categoryId: demoId('cat_04'),
    name: '中科管道镜 ZK-P300',
    model: 'ZK-P300',
    slug: 'demo-zkp300-pipe-scope',
    description: 'ZK-P300 工业管道镜，专为长距离管道内部检测设计，支持多段拼接，最大检测深度可达 30m。',
    status: 'ACTIVE',
    seoTitle: '中科管道镜 ZK-P300 | 管道内检',
    params: [
      { code: 'resolution', value: '1280×720' },
      { code: 'pixel', value: '100', valueNumber: 100 },
      { code: 'fov', value: '100', valueNumber: 100 },
      { code: 'depth_of_field', value: '10-100' },
      { code: 'light_source', value: 'LED高亮' },
      { code: 'probe_diameter', value: '25', valueNumber: 25 },
      { code: 'working_length', value: '30', valueNumber: 30 },
      { code: 'waterproof', value: 'IP68' },
      { code: 'operating_temp', value: '-10~50' },
      { code: 'steering_mode', value: '电动爬行' },
    ],
  },
  {
    id: demoId('prod_09'),
    categoryId: demoId('cat_04'),
    name: '明视管道镜 MV-P100',
    model: 'MV-P100',
    slug: 'demo-mvp100-pipe-scope',
    description: 'MV-P100 是一款紧凑型管道镜，适用于中小口径管道内部检测，配备高清摄像头与 LED 照明系统。',
    status: 'ACTIVE',
    seoTitle: '明视管道镜 MV-P100 | 中小管道检测',
    params: [
      { code: 'resolution', value: '1280×720' },
      { code: 'pixel', value: '100', valueNumber: 100 },
      { code: 'fov', value: '90', valueNumber: 90 },
      { code: 'depth_of_field', value: '5-50' },
      { code: 'light_source', value: 'LED' },
      { code: 'probe_diameter', value: '15', valueNumber: 15 },
      { code: 'working_length', value: '15', valueNumber: 15 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-5~45' },
      { code: 'steering_mode', value: '手动推拉' },
    ],
  },
  {
    id: demoId('prod_10'),
    categoryId: demoId('cat_05'),
    name: '中科爬行机器人 ZK-R100',
    model: 'ZK-R100',
    slug: 'demo-zkr100-crawler-robot',
    description: 'ZK-R100 履带式爬行检测机器人，搭载高清摄像头与多种传感器，适用于工业管道、储罐等狭窄空间远程检测。',
    status: 'ACTIVE',
    seoTitle: '中科爬行机器人 ZK-R100 | 远程检测',
    params: [
      { code: 'resolution', value: '1920×1080' },
      { code: 'pixel', value: '200', valueNumber: 200 },
      { code: 'fov', value: '120', valueNumber: 120 },
      { code: 'depth_of_field', value: '10-100' },
      { code: 'light_source', value: 'LED阵列' },
      { code: 'probe_diameter', value: '120', valueNumber: 120 },
      { code: 'working_length', value: '100', valueNumber: 100 },
      { code: 'waterproof', value: 'IP68' },
      { code: 'operating_temp', value: '-20~60' },
      { code: 'steering_mode', value: '遥控履带' },
    ],
  },
  {
    id: demoId('prod_11'),
    categoryId: demoId('cat_05'),
    name: '锐视微型爬行机器人 RS-M50',
    model: 'RS-M50',
    slug: 'demo-rsm50-micro-crawler',
    description: 'RS-M50 微型爬行机器人，体积小巧，适合狭窄管道与腔体内部检测，搭载高清微距摄像头。',
    status: 'ACTIVE',
    seoTitle: '锐视微型爬行机器人 RS-M50 | 微型检测',
    params: [
      { code: 'resolution', value: '1280×720' },
      { code: 'pixel', value: '100', valueNumber: 100 },
      { code: 'fov', value: '100', valueNumber: 100 },
      { code: 'depth_of_field', value: '5-50' },
      { code: 'light_source', value: 'LED' },
      { code: 'probe_diameter', value: '50', valueNumber: 50 },
      { code: 'working_length', value: '50', valueNumber: 50 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-10~50' },
      { code: 'steering_mode', value: '遥控履带' },
    ],
  },
  {
    id: demoId('prod_12'),
    categoryId: demoId('cat_01'),
    name: '中科工业电子内窥镜 ZK-5000',
    model: 'ZK-5000',
    slug: 'demo-zk5000-industrial-borescope',
    description: 'ZK-5000 工业级电子内窥镜，具备 3D 测量功能，支持缺陷尺寸自动计算，适用于焊缝检测与精密测量。',
    status: 'ACTIVE',
    seoTitle: '中科工业电子内窥镜 ZK-5000 | 3D 测量',
    params: [
      { code: 'resolution', value: '1920×1080' },
      { code: 'pixel', value: '200', valueNumber: 200 },
      { code: 'fov', value: '110', valueNumber: 110 },
      { code: 'depth_of_field', value: '8-80' },
      { code: 'light_source', value: 'LED' },
      { code: 'probe_diameter', value: '6.0', valueNumber: 6.0 },
      { code: 'working_length', value: '3.5', valueNumber: 3.5 },
      { code: 'bend_radius', value: '35', valueNumber: 35 },
      { code: 'screen_size', value: '5.5', valueNumber: 5.5 },
      { code: 'waterproof', value: 'IP67' },
      { code: 'operating_temp', value: '-20~60' },
      { code: 'steering_mode', value: '360°电动' },
    ],
  },
];

// --- Offers ---
interface DemoOffer {
  orgId: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUBMITTED';
}

const DEMO_OFFERS: DemoOffer[] = [
  // Supplier 01 (明视) — 5 products
  {
    orgId: demoId('org_supplier_01'),
    productId: demoId('prod_01'),
    title: '明视 MV-4500 标准供应方案',
    description: '包含主机、标准探头、充电器、便携箱，质保 2 年。',
    price: '85000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_01'),
    productId: demoId('prod_02'),
    title: '明视 MV-3200 便携检测方案',
    description: '轻量级便携套装，含备用电池与 SD 存储卡。',
    price: '28000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_01'),
    productId: demoId('prod_06'),
    title: '明视 MV-F200 超细光纤方案',
    description: '超细 2.0mm 光纤探头，附带光纤光源与转接器。',
    price: '42000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_01'),
    productId: demoId('prod_09'),
    title: '明视 MV-P100 管道检测方案',
    description: '15m 管道检测套装，含定位器与测距功能。',
    price: '65000.00',
    status: 'ACTIVE',
  },
  // Supplier 02 (锐视) — 4 products
  {
    orgId: demoId('org_supplier_02'),
    productId: demoId('prod_03'),
    title: '锐视 RS-8000 旗舰检测方案',
    description: '4K 超清旗舰套装，含大屏工作站与专业分析软件。',
    price: '158000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_02'),
    productId: demoId('prod_05'),
    title: '锐视 RS-1000 光学检测方案',
    description: '多视角光学套装，含 0°/30°/70° 镜片组。',
    price: '35000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_02'),
    productId: demoId('prod_07'),
    title: '锐视 RS-F500 工业光纤方案',
    description: '3.0mm 工业级光纤探头，含工业光源与防护套件。',
    price: '55000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_02'),
    productId: demoId('prod_11'),
    title: '锐视 RS-M50 微型机器人方案',
    description: '50mm 微型爬行机器人，含遥控器与充电站。',
    price: '95000.00',
    status: 'ACTIVE',
  },
  // Supplier 03 (中科) — 4 products
  {
    orgId: demoId('org_supplier_03'),
    productId: demoId('prod_04'),
    title: '中科 ZK-2000 刚性光学方案',
    description: '2.7mm 刚性光学镜，含光纤光源与连接适配器。',
    price: '22000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_03'),
    productId: demoId('prod_08'),
    title: '中科 ZK-P300 深管道检测方案',
    description: '30m 管道镜套装，含电动爬行器与定位系统。',
    price: '120000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_03'),
    productId: demoId('prod_10'),
    title: '中科 ZK-R100 爬行机器人方案',
    description: '120mm 履带机器人，含遥控站与 100m 线缆。',
    price: '185000.00',
    status: 'ACTIVE',
  },
  {
    orgId: demoId('org_supplier_03'),
    productId: demoId('prod_12'),
    title: '中科 ZK-5000 3D 测量方案',
    description: '3D 测量内窥镜套装，含测量软件授权与校准标定板。',
    price: '98000.00',
    status: 'ACTIVE',
  },
];

// --- Demands (5) ---
interface DemoDemand {
  id: string;
  title: string;
  description: string;
  orgId: string;
  createdBy: string;
  status: DemandStatus;
  categoryId: string;
  budgetRange: string;
  contactName: string;
  contactEmail: string;
  params: { paramCode: string; valueMin?: number; valueMax?: number; value?: string; required: boolean }[];
}

const DEMO_DEMANDS: DemoDemand[] = [
  {
    id: demoId('demand_01'),
    title: '航空发动机涡轮叶片内部检测需求',
    description: '需要高分辨率电子内窥镜，对航空发动机涡轮叶片进行内部裂纹、腐蚀检测。探头需要耐高温、可弯曲，分辨率不低于 1080P。',
    orgId: demoId('org_buyer_01'),
    createdBy: demoId('user_buyer_01'),
    status: 'PUBLISHED' as const,
    categoryId: demoId('cat_01'),
    budgetRange: '5-10万',
    contactName: '张检测',
    contactEmail: 'demo.buyer.01@visndt.local',
    params: [
      { paramCode: 'resolution', value: '1920×1080', required: true },
      { paramCode: 'probe_diameter', valueMin: 4, valueMax: 8, required: true },
      { paramCode: 'working_length', valueMin: 2, valueMax: 5, required: true },
      { paramCode: 'fov', valueMin: 90, valueMax: 140, required: false },
      { paramCode: 'operating_temp', value: '-20~60', required: true },
      { paramCode: 'steering_mode', value: '360°电动', required: true },
    ],
  },
  {
    id: demoId('demand_02'),
    title: '压力管道焊缝内部检测需求',
    description: '需要管道镜或爬行机器人，对化工厂压力管道内部焊缝进行检测。管道内径 80-150mm，检测深度 20m 以上。',
    orgId: demoId('org_buyer_01'),
    createdBy: demoId('user_buyer_01'),
    status: 'PUBLISHED' as const,
    categoryId: demoId('cat_04'),
    budgetRange: '10-20万',
    contactName: '张检测',
    contactEmail: 'demo.buyer.01@visndt.local',
    params: [
      { paramCode: 'working_length', valueMin: 20, valueMax: 50, required: true },
      { paramCode: 'probe_diameter', valueMin: 15, valueMax: 40, required: true },
      { paramCode: 'waterproof', value: 'IP67', required: true },
      { paramCode: 'resolution', value: '1280×720', required: false },
      { paramCode: 'steering_mode', value: '电动爬行', required: false },
    ],
  },
  {
    id: demoId('demand_03'),
    title: '汽车缸体铸件内部缺陷检测需求',
    description: '需要对汽车发动机缸体铸件进行内部气孔、缩松检测。检测孔径 4-8mm，需要光学或电子内窥镜。',
    orgId: demoId('org_buyer_01'),
    createdBy: demoId('user_buyer_02'),
    status: 'PUBLISHED' as const,
    categoryId: demoId('cat_01'),
    budgetRange: '3-8万',
    contactName: '李质检',
    contactEmail: 'demo.buyer.02@visndt.local',
    params: [
      { paramCode: 'probe_diameter', valueMin: 2, valueMax: 6, required: true },
      { paramCode: 'fov', valueMin: 70, valueMax: 120, required: false },
      { paramCode: 'depth_of_field', value: '3-50', required: false },
      { paramCode: 'resolution', value: '1280×720', required: false },
      { paramCode: 'steering_mode', value: '360°电动', required: false },
    ],
  },
  {
    id: demoId('demand_04'),
    title: '精密轴承滚道表面检测需求',
    description: '对精密轴承滚道表面进行微米级缺陷检测，需要极高分辨率的光学内窥镜或电子内窥镜。',
    orgId: demoId('org_buyer_01'),
    createdBy: demoId('user_buyer_02'),
    status: 'PUBLISHED' as const,
    categoryId: demoId('cat_02'),
    budgetRange: '3-5万',
    contactName: '李质检',
    contactEmail: 'demo.buyer.02@visndt.local',
    params: [
      { paramCode: 'resolution', value: '光学级', required: true },
      { paramCode: 'probe_diameter', valueMin: 2, valueMax: 5, required: true },
      { paramCode: 'depth_of_field', value: '3-30', required: false },
      { paramCode: 'fov', valueMin: 60, valueMax: 90, required: false },
    ],
  },
  {
    id: demoId('demand_05'),
    title: '化工储罐内部腐蚀检测需求',
    description: '需要对大型化工储罐内部进行腐蚀状况检测，储罐高度 10m，需要爬行机器人或长距离管道镜。',
    orgId: demoId('org_buyer_01'),
    createdBy: demoId('user_buyer_01'),
    status: 'PROCESSING' as const,
    categoryId: demoId('cat_05'),
    budgetRange: '15-25万',
    contactName: '张检测',
    contactEmail: 'demo.buyer.01@visndt.local',
    params: [
      { paramCode: 'working_length', valueMin: 10, valueMax: 100, required: true },
      { paramCode: 'probe_diameter', valueMin: 10, valueMax: 150, required: true },
      { paramCode: 'waterproof', value: 'IP68', required: true },
      { paramCode: 'resolution', value: '1920×1080', required: false },
      { paramCode: 'steering_mode', value: '遥控履带', required: false },
    ],
  },
];

// --- Content (7 additional demo content) ---
const DEMO_CONTENT = [
  {
    type: 'ARTICLE' as const,
    title: '如何选择工业内窥镜：关键参数与选型指南',
    slug: 'demo-how-to-choose-industrial-borescope',
    summary: '系统介绍工业内窥镜选型的关键技术参数，帮助采购工程师做出正确决策。',
    content: `# 如何选择工业内窥镜：关键参数与选型指南

工业内窥镜是现代无损检测的核心工具之一。面对市场上种类繁多的产品，如何选择最适合您需求的设备？

## 关键选型参数

### 1. 探头直径
探头直径决定了可进入的最小孔径。**选择原则**：探头直径 ≤ 被检孔径 - 1mm。

### 2. 工作长度
根据检测深度确定工作长度，建议预留 20% 余量。

### 3. 分辨率
- 一般检测：1280×720
- 高精度检测：1920×1080
- 精密检测：4K

### 4. 防水等级
- 普通环境：IP54
- 液体环境：IP67 以上
- 水下作业：IP68

## 选型流程

1. 明确检测对象与场景
2. 确定关键参数范围
3. 对比候选设备
4. 现场验证

> 选型不是看参数最高，而是看参数最匹配。`,
    seoTitle: '如何选择工业内窥镜：关键参数与选型指南',
    seoDescription: '系统介绍工业内窥镜选型的关键技术参数与决策流程。',
    seoKeywords: '工业内窥镜,选型指南,技术参数',
  },
  {
    type: 'KNOWLEDGE' as const,
    title: '内窥检测在航空航天领域的应用',
    slug: 'demo-borescope-inspection-aerospace',
    summary: '深入介绍内窥检测在航空发动机、飞机结构等关键部位的应用实践。',
    content: `# 内窥检测在航空航天领域的应用

航空航天是内窥检测技术应用最严格的领域之一。从发动机热端部件到机身结构，内窥镜在保障飞行安全中扮演着不可替代的角色。

## 主要应用场景

### 发动机检测
- 压气机叶片裂纹检测
- 燃烧室烧蚀评估
- 涡轮叶片涂层检查

### 机身结构检测
- 翼梁内部腐蚀检查
- 起落架结构检测
- 复合材料分层检测

## 特殊要求

航空航天检测对内窥镜提出更高要求：
- 更高的成像分辨率
- 更严格的耐温性能
- 更精确的测量能力
- 完整的检测数据追溯

## 检测标准

航空内窥检测需遵循 ASME、ASTM 等国际标准，确保检测结果的可比性与权威性。`,
    seoTitle: '内窥检测在航空航天领域的应用',
    seoDescription: '内窥检测在航空发动机、飞机结构等关键部位的应用实践。',
    seoKeywords: '航空航天,内窥检测,发动机检测',
  },
  {
    type: 'SOLUTION' as const,
    title: '石化管道完整性检测整体方案',
    slug: 'demo-petrochemical-pipeline-integrity-solution',
    summary: '针对石化行业管道完整性管理需求，提供从检测到评估的一站式内窥检测方案。',
    content: `# 石化管道完整性检测整体方案

## 方案背景

石化管道长期运行后，内部腐蚀、结垢、裂纹等问题直接影响安全生产。传统检测方式需要停产拆解，成本高昂。

## 检测方案

### 不拆解在线检测
利用管道镜 / 爬行机器人，从人孔或法兰口进入，实现不停产在线检测。

### 多维度数据采集
- 高清视频记录
- 3D 测量与缺陷量化
- 腐蚀图谱绘制

### 智能评估
基于检测数据，生成管道完整性评估报告，为维修决策提供依据。

## 方案价值

| 指标 | 传统方式 | 本方案 |
| --- | --- | --- |
| 停机时间 | 3-5 天 | 0.5 天 |
| 检测覆盖率 | 30% | 95% |
| 数据可追溯 | 低 | 高 |

> 在线检测大幅降低停产损失，同时提升检测覆盖率与数据质量。`,
    seoTitle: '石化管道完整性检测整体方案',
    seoDescription: '石化行业管道完整性管理的一站式内窥检测方案。',
    seoKeywords: '石化管道,完整性检测,内窥方案',
  },
  {
    type: 'ARTICLE' as const,
    title: '工业内窥镜日常维护与保养指南',
    slug: 'demo-borescope-maintenance-guide',
    summary: '正确维护保养可延长内窥镜使用寿命，降低故障率，确保检测精度。',
    content: `# 工业内窥镜日常维护与保养指南

内窥镜是精密光学电子设备，正确的维护保养能显著延长使用寿命。

## 日常维护要点

### 探头清洁
- 每次使用后用无尘布擦拭探头
- 避免使用有机溶剂
- 镜头可用专用清洁液

### 插入管保护
- 避免过度弯曲（不超过最小弯曲半径）
- 收纳入专用收纳箱
- 避免重压与撞击

### 电池保养
- 长期不用时保持 50% 电量
- 避免高温环境存放
- 定期充放电循环

## 常见故障预防

1. 图像模糊 → 检查镜头清洁度
2. 光源变暗 → 检查光纤连接
3. 导向失灵 → 检查导向线缆

## 定期校准

建议每年进行一次专业校准，确保测量精度与成像质量。`,
    seoTitle: '工业内窥镜日常维护与保养指南',
    seoDescription: '内窥镜日常维护保养要点，延长设备使用寿命。',
    seoKeywords: '内窥镜,维护保养,设备管理',
  },
  {
    type: 'KNOWLEDGE' as const,
    title: '3D 测量内窥镜技术原理与应用',
    slug: 'demo-3d-measurement-borescope',
    summary: '3D 测量内窥镜通过双目视觉或相位测量技术，实现缺陷尺寸的精确量化。',
    content: `# 3D 测量内窥镜技术原理与应用

3D 测量功能是现代高端内窥镜的重要特性，使检测人员不仅能"看到"缺陷，还能"测量"缺陷。

## 技术原理

### 双目立体视觉
通过两个摄像头模拟人眼，利用视差计算深度信息。

### 相位测量法
投射结构光图案，通过变形分析计算表面三维形貌。

## 关键指标

| 指标 | 说明 |
| --- | --- |
| 测量精度 | 通常 ±0.01mm ~ ±0.1mm |
| 测量范围 | 取决于物距与视场 |
| 适用场景 | 裂纹深度、腐蚀坑、凹痕 |

## 应用价值

- 缺陷严重程度量化评估
- 维修决策数据支撑
- 检测报告标准化

> 3D 测量将内窥检测从"定性观察"升级为"定量分析"。`,
    seoTitle: '3D 测量内窥镜技术原理与应用',
    seoDescription: '3D 测量内窥镜的双目视觉与相位测量技术原理。',
    seoKeywords: '3D测量,内窥镜,缺陷量化',
  },
  {
    type: 'SOLUTION' as const,
    title: '电力设备内部检测方案',
    slug: 'demo-power-equipment-inspection-solution',
    summary: '面向电力行业变压器、GIS、电缆等设备内部检测的完整方案。',
    content: `# 电力设备内部检测方案

## 方案概述

电力设备内部状态直接影响电网安全运行。本方案覆盖变压器、GIS、电缆等关键设备的内部可视化检测。

## 检测对象

- 变压器内部绕组与铁芯
- GIS 内部导体与绝缘件
- 电缆终端与接头
- 发电机定子与转子

## 方案特点

1. 无需排油/排气，减少停电时间
2. 高清成像，缺陷识别准确
3. 检测数据完整归档

## 实施流程

| 步骤 | 内容 |
| --- | --- |
| 准备 | 方案审批、安全交底 |
| 检测 | 多点位内窥检查 |
| 分析 | 图像判读、缺陷定性 |
| 报告 | 检测报告、维修建议 |

> 可视化检测为电力设备状态检修提供直观依据。`,
    seoTitle: '电力设备内部检测方案',
    seoDescription: '电力行业变压器、GIS、电缆等设备内部检测方案。',
    seoKeywords: '电力设备,内部检测,状态检修',
  },
  {
    type: 'INSIGHT' as const,
    title: '防水等级参数百科',
    slug: 'demo-waterproof-rating-encyclopedia',
    summary: 'IP 防护等级体系在内窥镜选型中的含义与应用指南。',
    content: `# 防水等级参数百科

## IP 防护等级体系

IP（Ingress Protection）防护等级是国际通用的设备防护标准，由两位数字组成。

## 常见等级

| 等级 | 防尘 | 防水 | 适用场景 |
| --- | --- | --- | --- |
| IP54 | 防尘 | 防溅水 | 普通车间 |
| IP65 | 完全防尘 | 防喷水 | 户外使用 |
| IP67 | 完全防尘 | 短时浸泡 | 液体环境 |
| IP68 | 完全防尘 | 持续浸泡 | 水下作业 |

## 内窥镜选型建议

- 干燥环境：IP54 以上
- 潮湿环境：IP65 以上
- 液体检测：IP67 以上
- 水下作业：IP68

> 防水等级直接影响内窥镜在复杂环境中的可用性。`,
    seoTitle: '防水等级参数百科',
    seoDescription: 'IP 防护等级体系在内窥镜选型中的含义与应用。',
    seoKeywords: '防水等级,IP防护,参数百科',
  },
];

// --- ConversionEvents (7-day analytics) ---
const EVENT_TYPES = [
  'PAGE_VIEW', 'PRODUCT_VIEW', 'CONTENT_VIEW', 'SEARCH',
  'PRODUCT_FILTER', 'CTA_CLICK', 'INQUIRY_START', 'INQUIRY_SUBMIT',
] as const;

// Demo session IDs for realistic analytics
const DEMO_SESSIONS = [
  demoId('session_01'),
  demoId('session_02'),
  demoId('session_03'),
  demoId('session_04'),
  demoId('session_05'),
];

// ============================================
// Seed Context (actual DB IDs)
// ============================================

interface SeedContext {
  paramDefIds: Map<string, string>;
  catIds: Map<string, string>;
  userIds: Map<string, string>;
  orgIds: Map<string, string>;
  productIds: Map<string, string>;
  offerIds: Map<string, string>;
  demandIds: Map<string, string>;
  rfqIds: Map<string, string>;
}

// ============================================
// Seed Functions
// ============================================

async function seedParameterGroups(): Promise<Map<string, string>> {
  console.log('--- Parameter Groups ---');
  const map = new Map<string, string>();
  for (const g of DEMO_PARAM_GROUPS) {
    const result = await prisma.parameterGroup.upsert({
      where: { code: g.code },
      update: { name: g.name },
      create: { id: g.id, name: g.name, code: g.code },
    });
    map.set(g.code, result.id);
    console.log(`  ✅ ${g.code}`);
  }
  return map;
}

async function seedParameterDefinitions(): Promise<Map<string, string>> {
  console.log('--- Parameter Definitions ---');
  const map = new Map<string, string>();
  for (const d of DEMO_PARAM_DEFS) {
    const result = await prisma.parameterDefinition.upsert({
      where: { code: d.code },
      update: { name: d.name, parameterGroupId: d.groupId, dataType: d.dataType, unit: d.unit },
      create: {
        id: d.id, name: d.name, code: d.code,
        parameterGroupId: d.groupId, dataType: d.dataType, unit: d.unit,
      },
    });
    map.set(d.code, result.id);
    console.log(`  ✅ ${d.code}`);
  }
  return map;
}

async function seedCategories(): Promise<Map<string, string>> {
  console.log('--- Categories ---');
  const map = new Map<string, string>();
  for (const c of DEMO_CATEGORIES) {
    const result = await prisma.productCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { id: c.id, name: c.name, slug: c.slug },
    });
    map.set(c.slug, result.id);
    console.log(`  ✅ ${c.slug}`);
  }
  return map;
}

async function seedUsersAndOrganizations(): Promise<{ users: Map<string, string>; orgs: Map<string, string> }> {
  console.log('--- Organizations ---');
  const orgMap = new Map<string, string>();
  for (const org of DEMO_ORGANIZATIONS) {
    const result = await prisma.organization.upsert({
      where: { id: org.id },
      update: { name: org.name, type: org.type },
      create: { id: org.id, name: org.name, type: org.type },
    });
    orgMap.set(org.id, result.id);
    console.log(`  ✅ ${org.name}`);
  }

  console.log('--- Users ---');
  const userMap = new Map<string, string>();
  const roleOrgMap: Record<string, string> = {
    ADMIN: demoId('org_admin'),
    BUYER: demoId('org_buyer_01'),
    SUPPLIER: demoId('org_supplier_01'),
  };

  const supplierOrgs = [demoId('org_supplier_01'), demoId('org_supplier_02'), demoId('org_supplier_03')];
  let supplierIdx = 0;

  for (const u of DEMO_USERS) {
    let demoOrgId: string;
    if (u.role === 'ADMIN') {
      demoOrgId = roleOrgMap.ADMIN;
    } else if (u.role === 'BUYER') {
      demoOrgId = roleOrgMap.BUYER;
    } else {
      demoOrgId = supplierOrgs[supplierIdx % supplierOrgs.length];
      supplierIdx++;
    }
    const actualOrgId = orgMap.get(demoOrgId) || demoOrgId;

    const result = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, organizationId: actualOrgId },
      create: {
        id: u.id, email: u.email, passwordHash: DEMO_PASSWORD_HASH,
        name: u.name, organizationId: actualOrgId, status: 'ACTIVE',
      },
    });
    userMap.set(u.id, result.id);

    // OrganizationMember
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: actualOrgId, userId: result.id } },
      update: { role: u.role },
      create: { organizationId: actualOrgId, userId: result.id, role: u.role },
    });

    console.log(`  ✅ ${u.email} (${u.role}) → ${actualOrgId.substring(0, 8)}...`);
  }
  return { users: userMap, orgs: orgMap };
}

async function seedProducts(ctx: SeedContext): Promise<void> {
  console.log('--- Products ---');
  const adminId = ctx.userIds.get(demoId('user_admin')) || demoId('user_admin');

  for (const p of DEMO_PRODUCTS) {
    const actualCatId = ctx.catIds.get(p.categoryId) || p.categoryId;

    const result = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name, model: p.model, description: p.description,
        status: p.status, categoryId: actualCatId,
        seoTitle: p.seoTitle,
      },
      create: {
        id: p.id, name: p.name, model: p.model, slug: p.slug,
        description: p.description, status: p.status,
        categoryId: actualCatId, createdById: adminId,
        seoTitle: p.seoTitle,
      },
    });
    ctx.productIds.set(p.id, result.id);
    console.log(`  ✅ ${p.name}`);

    // Product Parameter Associations + Values
    for (const param of p.params) {
      const actualParamDefId = ctx.paramDefIds.get(param.code);
      if (!actualParamDefId) continue;

      await prisma.productParameterDefinition.upsert({
        where: { productId_parameterDefinitionId: { productId: result.id, parameterDefinitionId: actualParamDefId } },
        update: {},
        create: { productId: result.id, parameterDefinitionId: actualParamDefId },
      });

      await prisma.productParameterValue.upsert({
        where: { productId_parameterDefinitionId: { productId: result.id, parameterDefinitionId: actualParamDefId } },
        update: { value: param.value, valueNumber: param.valueNumber },
        create: {
          productId: result.id, parameterDefinitionId: actualParamDefId,
          value: param.value, valueNumber: param.valueNumber,
        },
      });
    }
  }
}

async function seedOffers(ctx: SeedContext): Promise<void> {
  console.log('--- Offers ---');
  const supplierUserIds = [
    demoId('user_supplier_01'), demoId('user_supplier_02'), demoId('user_supplier_03'),
  ];
  const supplierOrgIds = [
    demoId('org_supplier_01'), demoId('org_supplier_02'), demoId('org_supplier_03'),
  ];

  for (const o of DEMO_OFFERS) {
    const actualOrgId = ctx.orgIds.get(o.orgId) || o.orgId;
    const actualProductId = ctx.productIds.get(o.productId) || o.productId;
    const orgIdx = supplierOrgIds.indexOf(o.orgId);
    const supplierUserId = orgIdx >= 0 ? (ctx.userIds.get(supplierUserIds[orgIdx]) || supplierUserIds[orgIdx]) : undefined;

    const result = await prisma.offer.upsert({
      where: { organizationId_productId: { organizationId: actualOrgId, productId: actualProductId } },
      update: {
        title: o.title, description: o.description,
        price: o.price, status: o.status,
      },
      create: {
        organizationId: actualOrgId, productId: actualProductId,
        title: o.title, description: o.description,
        price: o.price, currency: 'CNY', status: o.status,
        createdBy: supplierUserId,
      },
    });
    ctx.offerIds.set(`${o.orgId}_${o.productId}`, result.id);
    console.log(`  ✅ ${o.title}`);
  }
}

async function seedDemands(ctx: SeedContext): Promise<void> {
  console.log('--- Demands ---');
  for (const d of DEMO_DEMANDS) {
    const actualOrgId = ctx.orgIds.get(d.orgId) || d.orgId;
    const actualCreatedBy = ctx.userIds.get(d.createdBy) || d.createdBy;
    const actualCatId = d.categoryId ? (ctx.catIds.get(d.categoryId) || d.categoryId) : undefined;

    const result = await prisma.demand.upsert({
      where: { id: d.id },
      update: {
        title: d.title, description: d.description,
        status: d.status, categoryId: actualCatId || null,
        budgetRange: d.budgetRange,
        contactName: d.contactName, contactEmail: d.contactEmail,
        contactVisible: true,
        publishedAt: d.status === 'PUBLISHED' ? daysAgo(5) : null,
      },
      create: {
        id: d.id, title: d.title, description: d.description,
        organizationId: actualOrgId, createdBy: actualCreatedBy,
        status: d.status, categoryId: actualCatId || null,
        budgetRange: d.budgetRange,
        contactName: d.contactName, contactEmail: d.contactEmail,
        contactVisible: true,
        publishedAt: d.status === 'PUBLISHED' ? daysAgo(5) : null,
      },
    });
    ctx.demandIds.set(d.id, result.id);
    console.log(`  ✅ ${d.title}`);

    // Demand Parameters
    for (const param of d.params) {
      const actualParamDefId = ctx.paramDefIds.get(param.paramCode);
      if (!actualParamDefId) continue;

      await prisma.demandParameter.upsert({
        where: { demandId_parameterDefinitionId: { demandId: result.id, parameterDefinitionId: actualParamDefId } },
        update: {
          value: param.value || null,
          valueMin: param.valueMin || null,
          valueMax: param.valueMax || null,
          required: param.required,
        },
        create: {
          demandId: result.id, parameterDefinitionId: actualParamDefId,
          value: param.value || null,
          valueMin: param.valueMin || null,
          valueMax: param.valueMax || null,
          required: param.required,
        },
      });
    }
  }
}

async function seedDemandMatches(ctx: SeedContext): Promise<void> {
  console.log('--- Demand Matches ---');
  const matches: { demandId: string; productId: string; score: number }[] = [
    // Demand 01 (航空发动机) → high match with MV-4500, RS-8000, ZK-5000
    { demandId: demoId('demand_01'), productId: demoId('prod_01'), score: 0.92 },
    { demandId: demoId('demand_01'), productId: demoId('prod_03'), score: 0.88 },
    { demandId: demoId('demand_01'), productId: demoId('prod_12'), score: 0.85 },
    { demandId: demoId('demand_01'), productId: demoId('prod_02'), score: 0.45 },
    // Demand 02 (压力管道) → high match with pipe scopes
    { demandId: demoId('demand_02'), productId: demoId('prod_08'), score: 0.95 },
    { demandId: demoId('demand_02'), productId: demoId('prod_09'), score: 0.72 },
    { demandId: demoId('demand_02'), productId: demoId('prod_10'), score: 0.70 },
    // Demand 03 (汽车铸件) → good match with MV-3200, RS-1000, MV-F200
    { demandId: demoId('demand_03'), productId: demoId('prod_02'), score: 0.82 },
    { demandId: demoId('demand_03'), productId: demoId('prod_05'), score: 0.78 },
    { demandId: demoId('demand_03'), productId: demoId('prod_06'), score: 0.75 },
    // Demand 04 (精密轴承) → high match with optical
    { demandId: demoId('demand_04'), productId: demoId('prod_04'), score: 0.90 },
    { demandId: demoId('demand_04'), productId: demoId('prod_05'), score: 0.86 },
    // Demand 05 (化工储罐) → match with crawler robots
    { demandId: demoId('demand_05'), productId: demoId('prod_10'), score: 0.91 },
    { demandId: demoId('demand_05'), productId: demoId('prod_11'), score: 0.65 },
  ];

  let idx = 0;
  for (const m of matches) {
    const actualDemandId = ctx.demandIds.get(m.demandId) || m.demandId;
    const actualProductId = ctx.productIds.get(m.productId) || m.productId;
    const statuses: ('PENDING' | 'MATCHED' | 'REVIEWED')[] = ['MATCHED', 'MATCHED', 'MATCHED', 'REVIEWED', 'MATCHED'];
    const status = statuses[idx % statuses.length];

    await prisma.demandMatch.upsert({
      where: { demandId_productId: { demandId: actualDemandId, productId: actualProductId } },
      update: { matchScore: m.score, matchStatus: status },
      create: {
        demandId: actualDemandId, productId: actualProductId,
        matchScore: m.score, matchStatus: status,
        matchedAt: daysAgo(3),
        reviewedAt: status === 'REVIEWED' ? daysAgo(1) : null,
      },
    });
    console.log(`  ✅ Demand ${m.demandId.substring(0, 8)} → ${m.productId.substring(0, 8)} (${(m.score * 100).toFixed(0)}%)`);
    idx++;
  }
}

async function seedRFQs(ctx: SeedContext): Promise<void> {
  console.log('--- RFQs ---');
  const rfqs = [
    {
      id: demoId('rfq_01'),
      demandId: demoId('demand_01'),
      targetOrgId: demoId('org_supplier_01'),
      createdBy: demoId('user_buyer_01'),
      status: 'OPEN' as const,
      publishedAt: daysAgo(4),
    },
    {
      id: demoId('rfq_02'),
      demandId: demoId('demand_02'),
      targetOrgId: demoId('org_supplier_03'),
      createdBy: demoId('user_buyer_01'),
      status: 'RESPONDING' as const,
      publishedAt: daysAgo(3),
    },
    {
      id: demoId('rfq_03'),
      demandId: demoId('demand_03'),
      targetOrgId: demoId('org_supplier_01'),
      createdBy: demoId('user_buyer_02'),
      status: 'CLOSED' as const,
      publishedAt: daysAgo(7),
      closedAt: daysAgo(1),
    },
  ];

  for (const r of rfqs) {
    const actualDemandId = ctx.demandIds.get(r.demandId) || r.demandId;
    const actualTargetOrgId = ctx.orgIds.get(r.targetOrgId) || r.targetOrgId;
    const actualCreatedBy = ctx.userIds.get(r.createdBy) || r.createdBy;

    const result = await prisma.rFQ.upsert({
      where: { id: r.id },
      update: { status: r.status },
      create: {
        id: r.id, demandId: actualDemandId,
        targetOrganizationId: actualTargetOrgId,
        createdBy: actualCreatedBy, status: r.status,
        publishedAt: r.publishedAt,
        closedAt: r.closedAt || null,
      },
    });
    ctx.rfqIds.set(r.id, result.id);
    console.log(`  ✅ RFQ ${r.id.substring(0, 8)} (${r.status})`);
  }
}

async function seedRFQResponses(ctx: SeedContext): Promise<void> {
  console.log('--- RFQ Responses ---');
  const responses = [
    {
      rfqId: demoId('rfq_01'),
      orgId: demoId('org_supplier_01'),
      status: 'SUBMITTED' as const,
      message: '我司 MV-4500 完全满足贵方需求，可提供现场演示与试用。',
    },
    {
      rfqId: demoId('rfq_02'),
      orgId: demoId('org_supplier_03'),
      status: 'SUBMITTED' as const,
      message: 'ZK-P300 管道镜可覆盖 30m 检测深度，建议安排技术交流。',
    },
    {
      rfqId: demoId('rfq_03'),
      orgId: demoId('org_supplier_01'),
      status: 'VIEWED' as const,
      message: '我司 MV-3200 便携内窥镜适合缸体检测场景。',
    },
    {
      rfqId: demoId('rfq_03'),
      orgId: demoId('org_supplier_02'),
      status: 'ACCEPTED' as const,
      message: 'RS-1000 光学内窥镜配合多视角镜片组，可满足精密检测需求。',
    },
  ];

  for (const r of responses) {
    const actualRfqId = ctx.rfqIds.get(r.rfqId) || r.rfqId;
    const actualOrgId = ctx.orgIds.get(r.orgId) || r.orgId;

    // Find an offer for this org
    const offer = await prisma.offer.findFirst({
      where: { organizationId: actualOrgId },
    });

    await prisma.rFQResponse.upsert({
      where: { rfqId_organizationId: { rfqId: actualRfqId, organizationId: actualOrgId } },
      update: { status: r.status, message: r.message },
      create: {
        rfqId: actualRfqId, organizationId: actualOrgId,
        offerId: offer?.id || null,
        status: r.status, message: r.message,
      },
    });
    console.log(`  ✅ Response: ${r.orgId.substring(0, 8)} → ${r.rfqId.substring(0, 8)} (${r.status})`);
  }
}

async function seedContent(ctx: SeedContext): Promise<Map<string, string>> {
  console.log('--- Demo Content ---');
  const authorId = ctx.userIds.get(demoId('user_admin')) || demoId('user_admin');
  const contentIdMap = new Map<string, string>();

  for (const c of DEMO_CONTENT) {
    const result = await prisma.content.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title, summary: c.summary, content: c.content,
        seoTitle: c.seoTitle, seoDescription: c.seoDescription, seoKeywords: c.seoKeywords,
        status: 'PUBLISHED', publishedAt: daysAgo(2),
      },
      create: {
        type: c.type, title: c.title, slug: c.slug,
        summary: c.summary, content: c.content,
        status: 'PUBLISHED', publishedAt: daysAgo(2),
        authorId,
        seoTitle: c.seoTitle, seoDescription: c.seoDescription, seoKeywords: c.seoKeywords,
      },
    });
    contentIdMap.set(c.slug, result.id);
    console.log(`  ✅ [${c.type}] ${c.title}`);
  }
  return contentIdMap;
}

async function seedNotifications(ctx: SeedContext): Promise<void> {
  console.log('--- Notifications (cleaning demo scope first) ---');

  // Clean up previous demo notifications for idempotency
  const demoUserIds = DEMO_USERS.map(u => ctx.userIds.get(u.id) || u.id);
  await prisma.notification.deleteMany({
    where: { userId: { in: demoUserIds } },
  });
  const notifs = [
    // Buyer notifications
    {
      userId: demoId('user_buyer_01'),
      type: 'RFQ_UPDATE' as const,
      title: 'RFQ 收到新响应',
      message: '您的 RFQ "航空发动机涡轮叶片内部检测需求" 收到来自 明视工业检测设备有限公司 的响应。',
      referenceType: 'RFQ', referenceId: demoId('rfq_01'),
    },
    {
      userId: demoId('user_buyer_01'),
      type: 'DEMAND_UPDATE' as const,
      title: '需求匹配完成',
      message: '您的需求 "压力管道焊缝内部检测需求" 已匹配到 3 个候选产品。',
      referenceType: 'DEMAND', referenceId: demoId('demand_02'),
    },
    {
      userId: demoId('user_buyer_02'),
      type: 'RESPONSE_UPDATE' as const,
      title: 'RFQ 响应状态更新',
      message: '您的 RFQ "汽车缸体铸件内部缺陷检测需求" 已收到响应并被接受。',
      referenceType: 'RFQ', referenceId: demoId('rfq_03'),
    },
    // Supplier notifications
    {
      userId: demoId('user_supplier_01'),
      type: 'RFQ_UPDATE' as const,
      title: '收到新的 RFQ',
      message: '您收到了来自 江南航空检测技术中心 的询价请求。',
      referenceType: 'RFQ', referenceId: demoId('rfq_01'),
    },
    {
      userId: demoId('user_supplier_03'),
      type: 'RFQ_UPDATE' as const,
      title: '收到新的 RFQ',
      message: '您收到了来自 江南航空检测技术中心 的询价请求。',
      referenceType: 'RFQ', referenceId: demoId('rfq_02'),
    },
    // Admin notifications
    {
      userId: demoId('user_admin'),
      type: 'SYSTEM' as const,
      title: '平台运营周报',
      message: '本周平台新增 3 个需求、5 个 Offer、2 个 RFQ，匹配成功率 85%。',
      referenceType: null, referenceId: null,
    },
    {
      userId: demoId('user_admin'),
      type: 'SYSTEM' as const,
      title: 'Demo 数据集初始化完成',
      message: 'M21.8.3 Demo Dataset 已成功初始化，可进行平台演示与业务流验证。',
      referenceType: null, referenceId: null,
    },
  ];

  for (const n of notifs) {
    const actualUserId = ctx.userIds.get(n.userId) || n.userId;
    await prisma.notification.create({
      data: {
        userId: actualUserId,
        type: n.type,
        title: n.title,
        message: n.message,
        status: 'UNREAD',
        referenceType: n.referenceType,
        referenceId: n.referenceId,
      },
    });
    console.log(`  ✅ [${n.type}] ${n.title}`);
  }
}

async function seedConversionEvents(ctx: SeedContext, contentIdMap: Map<string, string>): Promise<void> {
  console.log('--- Conversion Events (cleaning demo scope first) ---');

  // Clean up previous demo conversion events for idempotency
  const demoUserIds = DEMO_USERS.map(u => ctx.userIds.get(u.id) || u.id);
  const demoProductIds = DEMO_PRODUCTS.map(p => ctx.productIds.get(p.id) || p.id);
  const demoContentIds = DEMO_CONTENT.map(c => contentIdMap.get(c.slug) || '').filter(Boolean);
  const demoCatIds = DEMO_CATEGORIES.map(c => ctx.catIds.get(c.slug) || c.id);
  const allDemoEntityIds = [...demoProductIds, ...demoContentIds, ...demoCatIds];
  await prisma.conversionEvent.deleteMany({
    where: {
      OR: [
        { userId: { in: demoUserIds } },
        { entityId: { in: allDemoEntityIds } },
      ],
    },
  });
  const adminId = ctx.userIds.get(demoId('user_admin')) || demoId('user_admin');
  const buyer01Id = ctx.userIds.get(demoId('user_buyer_01')) || demoId('user_buyer_01');
  const buyer02Id = ctx.userIds.get(demoId('user_buyer_02')) || demoId('user_buyer_02');
  const productIds = DEMO_PRODUCTS.map(p => ctx.productIds.get(p.id) || p.id);
  const catIds = DEMO_CATEGORIES.map(c => ctx.catIds.get(c.slug) || c.id);
  const contentIds = DEMO_CONTENT.map(c => contentIdMap.get(c.slug) || '').filter(Boolean);

  let count = 0;

  // Generate 7 days of analytics
  for (let day = 6; day >= 0; day--) {
    const eventsPerDay = 15 + Math.floor(Math.random() * 10); // 15-25 events per day

    for (let i = 0; i < eventsPerDay; i++) {
      const eventType = randomFrom(EVENT_TYPES);
      const userId = randomFrom([adminId, buyer01Id, buyer02Id]);
      const sessionId = randomFrom(DEMO_SESSIONS);
      const timestamp = daysAgo(day);
      timestamp.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

      let entityType: string | null = null;
      let entityId: string | null = null;
      let source: string | null = null;

      switch (eventType) {
        case 'PRODUCT_VIEW':
          entityType = 'PRODUCT';
          entityId = randomFrom(productIds);
          break;
        case 'CONTENT_VIEW':
          entityType = 'CONTENT';
          entityId = contentIds.length > 0 ? randomFrom(contentIds) : null;
          break;
        case 'SEARCH':
          entityType = null;
          entityId = null;
          source = 'search_bar';
          break;
        case 'PRODUCT_FILTER':
          entityType = 'CATEGORY';
          entityId = randomFrom(catIds);
          break;
        case 'INQUIRY_START':
        case 'INQUIRY_SUBMIT':
          entityType = 'PRODUCT';
          entityId = randomFrom(productIds);
          source = 'product_detail';
          break;
      }

      await prisma.conversionEvent.create({
        data: {
          event: eventType,
          userId,
          sessionId,
          entityType,
          entityId,
          source,
          createdAt: timestamp,
        },
      });
      count++;
    }
  }
  console.log(`  ✅ ${count} conversion events across 7 days`);
}

async function seedWorkflowEvents(ctx: SeedContext): Promise<void> {
  console.log('--- Workflow Events (cleaning demo scope first) ---');

  // Clean up previous demo workflow events for idempotency
  const demoUserIds = DEMO_USERS.map(u => ctx.userIds.get(u.id) || u.id);
  const demoDemandIds = DEMO_DEMANDS.map(d => ctx.demandIds.get(d.id) || d.id);
  const demoRfqIds = [demoId('rfq_01'), demoId('rfq_02'), demoId('rfq_03')].map(id => ctx.rfqIds.get(id) || id);
  await prisma.workflowEvent.deleteMany({
    where: {
      OR: [
        { operatorId: { in: demoUserIds } },
        { entityId: { in: [...demoDemandIds, ...demoRfqIds] } },
      ],
    },
  });
  const adminId = ctx.userIds.get(demoId('user_admin')) || demoId('user_admin');
  const buyer01Id = ctx.userIds.get(demoId('user_buyer_01')) || demoId('user_buyer_01');
  const buyer02Id = ctx.userIds.get(demoId('user_buyer_02')) || demoId('user_buyer_02');
  const supplier01Id = ctx.userIds.get(demoId('user_supplier_01')) || demoId('user_supplier_01');
  const demand01Id = ctx.demandIds.get(demoId('demand_01')) || demoId('demand_01');
  const demand02Id = ctx.demandIds.get(demoId('demand_02')) || demoId('demand_02');
  const demand03Id = ctx.demandIds.get(demoId('demand_03')) || demoId('demand_03');
  const rfq01Id = ctx.rfqIds.get(demoId('rfq_01')) || demoId('rfq_01');
  const rfq02Id = ctx.rfqIds.get(demoId('rfq_02')) || demoId('rfq_02');
  const rfq03Id = ctx.rfqIds.get(demoId('rfq_03')) || demoId('rfq_03');

  const events = [
    { entityType: 'DEMAND' as const, entityId: demand01Id, action: 'CREATED' as const, operatorId: buyer01Id, createdAt: daysAgo(6) },
    { entityType: 'DEMAND' as const, entityId: demand01Id, action: 'SUBMITTED' as const, operatorId: buyer01Id, createdAt: daysAgo(5) },
    { entityType: 'DEMAND' as const, entityId: demand02Id, action: 'CREATED' as const, operatorId: buyer01Id, createdAt: daysAgo(5) },
    { entityType: 'DEMAND' as const, entityId: demand02Id, action: 'SUBMITTED' as const, operatorId: buyer01Id, createdAt: daysAgo(4) },
    { entityType: 'DEMAND' as const, entityId: demand03Id, action: 'CREATED' as const, operatorId: buyer02Id, createdAt: daysAgo(4) },
    { entityType: 'DEMAND' as const, entityId: demand03Id, action: 'SUBMITTED' as const, operatorId: buyer02Id, createdAt: daysAgo(3) },
    { entityType: 'RFQ' as const, entityId: rfq01Id, action: 'CREATED' as const, operatorId: buyer01Id, createdAt: daysAgo(4) },
    { entityType: 'RFQ' as const, entityId: rfq01Id, action: 'OPENED' as const, operatorId: buyer01Id, createdAt: daysAgo(4) },
    { entityType: 'RFQ' as const, entityId: rfq02Id, action: 'CREATED' as const, operatorId: buyer01Id, createdAt: daysAgo(3) },
    { entityType: 'RFQ' as const, entityId: rfq02Id, action: 'OPENED' as const, operatorId: buyer01Id, createdAt: daysAgo(3) },
    { entityType: 'RFQ' as const, entityId: rfq03Id, action: 'CREATED' as const, operatorId: buyer02Id, createdAt: daysAgo(7) },
    { entityType: 'RFQ' as const, entityId: rfq03Id, action: 'CLOSED' as const, operatorId: buyer02Id, createdAt: daysAgo(1) },
    { entityType: 'RFQ_RESPONSE' as const, entityId: rfq01Id, action: 'RESPONDED' as const, operatorId: supplier01Id, createdAt: daysAgo(3) },
    { entityType: 'RFQ_RESPONSE' as const, entityId: rfq03Id, action: 'ACCEPTED' as const, operatorId: buyer02Id, createdAt: daysAgo(1) },
    { entityType: 'OFFER' as const, entityId: demoId('org_supplier_01'), action: 'CREATED' as const, operatorId: supplier01Id, createdAt: daysAgo(5) },
    { entityType: 'OFFER' as const, entityId: demoId('org_supplier_01'), action: 'SUBMITTED' as const, operatorId: supplier01Id, createdAt: daysAgo(5) },
  ];

  for (const e of events) {
    await prisma.workflowEvent.create({
      data: {
        entityType: e.entityType,
        entityId: e.entityId,
        action: e.action,
        operatorId: e.operatorId,
        createdAt: e.createdAt,
      },
    });
    console.log(`  ✅ [${e.entityType}] ${e.action}`);
  }
}

// ============================================
// Validation
// ============================================

interface ValidationResult {
  entity: string;
  minExpected: number;
  actual: number;
  status: 'PASS' | 'WARN' | 'FAIL';
}

async function validate(): Promise<ValidationResult[]> {
  console.log('\n=== Demo Dataset Validation ===\n');

  const results: ValidationResult[] = [];

  const checks: [string, number, () => Promise<number>][] = [
    ['Users', 6, async () => (await prisma.user.findMany({ where: { email: { startsWith: 'demo.' } } })).length],
    ['Organizations', 5, async () => (await prisma.organization.findMany({ where: { id: { in: DEMO_ORGANIZATIONS.map(o => o.id) } } })).length],
    ['Categories', 5, async () => (await prisma.productCategory.findMany({ where: { id: { in: DEMO_CATEGORIES.map(c => c.id) } } })).length],
    ['Products', 12, async () => (await prisma.product.findMany({ where: { id: { in: DEMO_PRODUCTS.map(p => p.id) } } })).length],
    ['Product Parameters', 12, async () => (await prisma.productParameterValue.count({ where: { productId: { in: DEMO_PRODUCTS.map(p => p.id) } } }))],
    ['Offers', 12, async () => {
      const orgIds = [demoId('org_supplier_01'), demoId('org_supplier_02'), demoId('org_supplier_03')];
      return (await prisma.offer.findMany({ where: { organizationId: { in: orgIds } } })).length;
    }],
    ['Demands', 5, async () => (await prisma.demand.findMany({ where: { id: { in: DEMO_DEMANDS.map(d => d.id) } } })).length],
    ['Demand Matches', 14, async () => (await prisma.demandMatch.findMany({ where: { demandId: { in: DEMO_DEMANDS.map(d => d.id) } } })).length],
    ['RFQs', 3, async () => (await prisma.rFQ.findMany({ where: { id: { in: [demoId('rfq_01'), demoId('rfq_02'), demoId('rfq_03')] } } })).length],
    ['RFQ Responses', 4, async () => (await prisma.rFQResponse.findMany({ where: { rfqId: { in: [demoId('rfq_01'), demoId('rfq_02'), demoId('rfq_03')] } } })).length],
    ['Content', 7, async () => (await prisma.content.findMany({ where: { slug: { startsWith: 'demo-' } } })).length],
    ['Notifications', 7, async () => (await prisma.notification.findMany({ where: { userId: { in: DEMO_USERS.map(u => u.id) } } })).length],
    ['Conversion Events', 100, async () => (await prisma.conversionEvent.count({ where: { createdAt: { gte: daysAgo(7) } } }))],
    ['Workflow Events', 16, async () => (await prisma.workflowEvent.count({ where: { createdAt: { gte: daysAgo(7) } } }))],
  ];

  for (const [entity, minExpected, fn] of checks) {
    const actual = await fn();
    const status: 'PASS' | 'WARN' | 'FAIL' = actual >= minExpected ? 'PASS' : actual > 0 ? 'WARN' : 'FAIL';
    results.push({ entity, minExpected, actual, status });
    const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
    console.log(`  ${icon} ${entity}: ${actual} (min expected: ${minExpected})`);
  }

  return results;
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  VISNDT M21.8.3 Demo Dataset Seed       ║');
  console.log('╚══════════════════════════════════════════╝\n');

  safetyGate();

  const start = Date.now();

  const ctx: SeedContext = {
    paramDefIds: new Map(),
    catIds: new Map(),
    userIds: new Map(),
    orgIds: new Map(),
    productIds: new Map(),
    offerIds: new Map(),
    demandIds: new Map(),
    rfqIds: new Map(),
  };

  try {
    // Phase 1: Reference data
    await seedParameterGroups(); // group IDs not needed downstream
    ctx.paramDefIds = await seedParameterDefinitions();
    ctx.catIds = await seedCategories();

    // Phase 2: Identity
    const identity = await seedUsersAndOrganizations();
    ctx.userIds = identity.users;
    ctx.orgIds = identity.orgs;

    // Phase 3: Business entities
    await seedProducts(ctx);
    await seedOffers(ctx);
    await seedDemands(ctx);

    // Phase 4: Matching & RFQ
    await seedDemandMatches(ctx);
    await seedRFQs(ctx);
    await seedRFQResponses(ctx);

    // Phase 5: Content & operations
    const contentIdMap = await seedContent(ctx);
    await seedNotifications(ctx);
    await seedWorkflowEvents(ctx);

    // Phase 6: Analytics
    await seedConversionEvents(ctx, contentIdMap);

    // Validation
    const results = await validate();

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const allPass = results.every(r => r.status === 'PASS');

    console.log(`\n=== Demo Dataset Seed Complete (${elapsed}s) ===`);
    console.log(`Status: ${allPass ? '✅ ALL PASS' : '⚠️ SOME CHECKS NEED ATTENTION'}`);

    if (!allPass) {
      process.exit(1);
    }
  } catch (e) {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();