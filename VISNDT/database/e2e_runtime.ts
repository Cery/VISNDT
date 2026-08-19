/**
 * ============================================================
 * VISNDT Runtime E2E Verification — e2e_runtime.ts
 * ============================================================
 *
 * 用途：对【真运行时】执行端到端链路验证，覆盖：
 *   链路 1 认证      ：CSRF → 登录(BUYER/SUPPLIER) → /auth/me
 *   链路 2 产品发现  ：列表 → 分类筛选 → 关键词 → 详情 → 关联知识 → 关联产品
 *   链路 3 询价      ：匿名创建 inquiry → 供应商查看 mine
 *   链路 4 RFQ 闭环  ：BUYER 创建 → 发布 → SUPPLIER 查看/响应 → BUYER view/accept
 *
 * 运行前提：API 已启动于 http://localhost:4000；seed_runtime.ts 已执行。
 * 运行方式（database 目录）：
 *   npx tsx e2e_runtime.ts
 * ============================================================
 */

const BASE = 'http://localhost:4000/api/v1';

// ---- 当前 seed 环境的稳定自然键 → UUID（来自 seed_runtime / seed_demo）----
const ID = {
  // 产品（slug → id）
  productVx6000: '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1',
  // 分类
  catEndoscope: '6bd01fc3-0586-4c64-a4aa-47abe5c4b1f5',
  // 组织
  orgMingShi: '926d5a96-e1be-455c-8d58-8f4a79b6735d', // 明视(SUPPLIER)
  // offer：明视 vx-6000
  offerVx6000: '93b84b49-d918-4698-8648-690fa8688cb7',
  // demand：精密轴承滚道表面检测需求（BUYER 江南航空，无 rfq）
  demandBearing: '90867c4c-61a3-6cca-66cb-60d73ff3d0e1',
};

const results: { step: string; ok: boolean; detail: string }[] = [];

function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}

// ---- 运行时状态 ----
let csrfToken = '';
let buyerToken = '';
let supplierToken = '';
let createdRfqId = '';
let createdResponseId = '';

// ---- HTTP 客户端（原生 fetch，手动管理 token / CSRF）----
type Opts = { json?: unknown; token?: string; csrf?: boolean };

async function request(method: string, path: string, opts: Opts = {}) {
  const headers: Record<string, string> = {};
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  if (opts.csrf) {
    headers['X-CSRF-Token'] = csrfToken;
    headers['Cookie'] = `csrf_token=${csrfToken}`;
  }

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : undefined,
  });

  const setCookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, setCookies };
}

function extractCookie(setCookies: string[], name: string): string | undefined {
  for (const c of setCookies) {
    const m = c.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    if (m) return m[1];
  }
  return undefined;
}

async function login(email: string, password: string) {
  const r = await request('POST', '/auth/login', { json: { email, password } });
  const token = extractCookie(r.setCookies, 'access_token');
  return { ok: r.status >= 200 && r.status < 300 && !!token, token, json: r.json };
}

const is2xx = (s: number) => s >= 200 && s < 300;

async function main() {
  console.log('=== VISNDT Runtime E2E Verification ===\n');

  // ================= 链路 1：认证 =================
  console.log('── 链路 1：认证 ──');
  const csrfRes = await request('GET', '/auth/csrf');
  csrfToken = csrfRes.json?.data?.csrfToken ?? '';
  record('GET /auth/csrf', csrfRes.status === 200 && !!csrfToken, csrfToken ? '获取 csrf_token 成功' : 'csrf_token 缺失');

  const buyerLogin = await login('demo.buyer.01@visndt.local', 'demo123456');
  buyerToken = buyerLogin.token ?? '';
  record(
    'POST /auth/login (BUYER)',
    buyerLogin.ok,
    buyerLogin.json?.data?.user?.email ?? buyerLogin.json?.message ?? '登录失败',
  );

  const buyerMe = await request('GET', '/auth/me', { token: buyerToken });
  const meRole = buyerMe.json?.data?.workspaceRole;
  record('GET /auth/me (BUYER)', buyerMe.status === 200 && meRole === 'BUYER', `workspaceRole=${meRole}`);

  const supplierLogin = await login('demo.supplier.01@visndt.local', 'demo123456');
  supplierToken = supplierLogin.token ?? '';
  record(
    'POST /auth/login (SUPPLIER)',
    supplierLogin.ok,
    supplierLogin.json?.data?.user?.email ?? supplierLogin.json?.message ?? '登录失败',
  );

  // ================= 链路 2：产品发现 =================
  console.log('\n── 链路 2：产品发现（Product Center 目录闭环）──');
  const listRes = await request('GET', '/products?page=1&pageSize=20');
  const listData = listRes.json?.data?.data ?? [];
  record('GET /products 列表', listRes.status === 200 && listData.length >= 6, `命中 ${listData.length} 个产品`);

  const catRes = await request('GET', `/products?categoryId=${ID.catEndoscope}&page=1&pageSize=20`);
  const catData = catRes.json?.data?.data ?? [];
  record(
    'GET /products 分类筛选(工业内窥镜)',
    catRes.status === 200 && catData.length >= 1 && catData.every((p: any) => p.categoryId === ID.catEndoscope),
    `命中 ${catData.length} 个产品`,
  );

  const kwRes = await request('GET', '/products?keyword=超声波&page=1&pageSize=20');
  const kwData = kwRes.json?.data?.data ?? [];
  record('GET /products 关键词(超声波)', kwRes.status === 200 && kwData.length >= 1, `命中 ${kwData.length} 个产品`);

  const detailRes = await request('GET', '/products/vx-6000-hd-video-borescope');
  const detail = detailRes.json?.data ?? {};
  record(
    'GET /products/:slug 详情',
    detailRes.status === 200 && detail.slug === 'vx-6000-hd-video-borescope',
    `name=${detail.name ?? '?'} status=${detail.status ?? '?'}`,
  );

  const rkRes = await request('GET', '/products/vx-6000-hd-video-borescope/related-knowledge');
  const rkData = rkRes.json?.data ?? (Array.isArray(rkRes.json?.data) ? rkRes.json.data : []);
  const rkCount = Array.isArray(rkData) ? rkData.length : (rkData?.data?.length ?? rkData?.total ?? '?');
  record('GET /products/:slug/related-knowledge', rkRes.status === 200, `返回 ${rkCount}`);

  const rpRes = await request('GET', '/products/vx-6000-hd-video-borescope/related-products');
  const rpData = rpRes.json?.data ?? [];
  const rpCount = Array.isArray(rpData) ? rpData.length : (rpData?.data?.length ?? rpData?.total ?? '?');
  record('GET /products/:slug/related-products', rpRes.status === 200, `返回 ${rpCount}`);

  // ================= 链路 3：询价 =================
  console.log('\n── 链路 3：询价（Product → Offer → Inquiry）──');
  const inqRes = await request('POST', '/inquiries', {
    csrf: true,
    json: {
      productId: ID.productVx6000,
      offerId: ID.offerVx6000,
      organizationId: ID.orgMingShi,
      name: 'E2E 访客 王采购',
      email: 'e2e.buyer@example.com',
      phone: '+86-13800000000',
      message: 'E2E 运行时验证：对内窥镜产品询价。',
    },
  });
  const createdInquiryId = inqRes.json?.data?.inquiry?.id ?? '';
  record('POST /inquiries 创建询价', is2xx(inqRes.status) && !!createdInquiryId, `inquiryId=${createdInquiryId || inqRes.json?.message}`);

  const mineInqRes = await request('GET', '/inquiries/mine?page=1&pageSize=20', { token: supplierToken });
  record('GET /inquiries/mine (SUPPLIER)', mineInqRes.status === 200, `total=${mineInqRes.json?.data?.total ?? '?'}`);

  // ================= 链路 4：RFQ 闭环 =================
  console.log('\n── 链路 4：RFQ 闭环（Demand → RFQ → Response → Decision）──');
  const rfqRes = await request('POST', '/rfqs', {
    token: buyerToken,
    csrf: true,
    json: { demandId: ID.demandBearing },
  });
  createdRfqId = rfqRes.json?.data?.id ?? '';
  record('POST /rfqs 创建', is2xx(rfqRes.status) && !!createdRfqId, `rfqId=${createdRfqId || rfqRes.json?.message}`);

  if (createdRfqId) {
    const pubRes = await request('POST', `/rfqs/${createdRfqId}/publish`, { token: buyerToken, csrf: true });
    record('POST /rfqs/:id/publish', is2xx(pubRes.status) && pubRes.json?.data?.status === 'OPEN', `status=${pubRes.json?.data?.status ?? pubRes.json?.message}`);

    const availRes = await request('GET', '/rfqs/available?page=1&pageSize=50', { token: supplierToken });
    const availIds = (availRes.json?.data?.data ?? []).map((r: any) => r.id);
    record('GET /rfqs/available (SUPPLIER)', availRes.status === 200 && availIds.includes(createdRfqId), `命中 rfqId=${availIds.includes(createdRfqId)} total=${availRes.json?.data?.total}`);

    const respRes = await request('POST', `/rfqs/${createdRfqId}/responses`, {
      token: supplierToken,
      csrf: true,
      json: { offerId: ID.offerVx6000, message: 'E2E 运行时验证：明视响应报价。' },
    });
    createdResponseId = respRes.json?.data?.id ?? '';
    record('POST /rfqs/:id/responses (SUPPLIER)', is2xx(respRes.status) && !!createdResponseId, `respId=${createdResponseId || respRes.json?.message}`);

    if (createdResponseId) {
      const viewRes = await request('POST', `/rfq-responses/${createdResponseId}/view`, { token: buyerToken, csrf: true });
      record('POST /rfq-responses/:id/view (BUYER)', is2xx(viewRes.status) && viewRes.json?.data?.status === 'VIEWED', `status=${viewRes.json?.data?.status ?? viewRes.json?.message}`);

      const acceptRes = await request('POST', `/rfq-responses/${createdResponseId}/accept`, {
        token: buyerToken,
        csrf: true,
        json: { decisionNote: 'E2E 运行时验证：接受报价。' },
      });
      record('POST /rfq-responses/:id/accept (BUYER)', is2xx(acceptRes.status) && acceptRes.json?.data?.status === 'ACCEPTED', `status=${acceptRes.json?.data?.status ?? acceptRes.json?.message}`);
    } else {
      record('POST /rfq-responses/:id/view (BUYER)', false, '前置步骤失败，跳过');
      record('POST /rfq-responses/:id/accept (BUYER)', false, '前置步骤失败，跳过');
    }
  } else {
    record('POST /rfqs/:id/publish', false, '前置步骤失败，跳过');
    record('GET /rfqs/available (SUPPLIER)', false, '前置步骤失败，跳过');
    record('POST /rfqs/:id/responses (SUPPLIER)', false, '前置步骤失败，跳过');
    record('POST /rfq-responses/:id/view (BUYER)', false, '前置步骤失败，跳过');
    record('POST /rfq-responses/:id/accept (BUYER)', false, '前置步骤失败，跳过');
  }

  // ================= 汇总 =================
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log('\n=== E2E 汇总 ===');
  console.log(`总步骤 ${results.length} / 通过 ${passed} / 失败 ${failed}`);
  if (failed > 0) {
    console.log('\n失败项：');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ❌ ${r.step} — ${r.detail}`));
  }
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error('E2E 脚本异常:', e);
  process.exit(1);
});