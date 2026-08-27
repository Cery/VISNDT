import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE = 'http://localhost:4000/api/v1';

async function main() {
  const log = [];

  // 1. Query the two category IDs from the user's error
  const ids = [
    'f86ffbb7-5085-4277-b877-46ee65d08d0f',
    'a71ce826-f72e-4376-a98a-0fb684295c39',
  ];
  for (const id of ids) {
    const c = await prisma.productCategory.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    log.push(`category ${id}: ${c ? `name=${c.name} products=${c._count.products} children=${c._count.children}` : 'NOT FOUND'}`);
  }

  // 2. Reproduce the full HTTP flow
  // Step A: GET csrf token (capture cookie + body token)
  const csrfRes = await fetch(`${BASE}/auth/csrf`);
  const csrfBody = await csrfRes.json();
  const csrfToken = csrfBody?.data?.csrfToken;
  const setCookie = csrfRes.headers.get('set-cookie') || '';
  const csrfCookieMatch = setCookie.match(/csrf_token=([^;]*)/);
  const csrfCookie = csrfCookieMatch ? csrfCookieMatch[1] : null;
  log.push(`[csrf] body token=${csrfToken}`);
  log.push(`[csrf] cookie  =${csrfCookie}`);
  log.push(`[csrf] match=${csrfToken === csrfCookie}`);

  // Step B: login
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@visndt.com', password: 'admin123456' }),
  });
  const loginBody = await loginRes.json();
  const accessToken = loginBody?.data?.accessToken;
  log.push(`[login] status=${loginRes.status} accessToken=${accessToken ? 'YES' : 'NO'}`);

  // Step C: DELETE the (first) category with matching CSRF + auth
  const target = ids[0];
  const deleteRes = await fetch(`${BASE}/product-categories/${target}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-CSRF-Token': csrfToken,
      'Cookie': `csrf_token=${csrfCookie}`,
    },
  });
  const deleteBody = await deleteRes.json().catch(() => null);
  log.push(`[delete] status=${deleteRes.status} body=${JSON.stringify(deleteBody)}`);

  // Step D: DELETE WITHOUT CSRF header (to confirm behavior)
  const deleteNoCsrf = await fetch(`${BASE}/product-categories/${target}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const noCsrfBody = await deleteNoCsrf.json().catch(() => null);
  log.push(`[delete-no-csrf] status=${deleteNoCsrf.status} body=${JSON.stringify(noCsrfBody)}`);

  console.log(log.join('\n'));
}

main()
  .catch((e) => { console.error('ERROR: ' + e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });