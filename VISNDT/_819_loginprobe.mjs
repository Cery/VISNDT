const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
const emails = ['demo.supplier.02@visndt.local', 'demo.supplier.01@visndt.local', 'demo.buyer.01@visndt.local', 'zhangsan.763@visndt.local', 'demo.admin@visndt.local'];
for (const e of emails) {
  const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password: PW }) });
  const j = await r.json().catch(() => ({}));
  console.log(e, '=>', r.status, JSON.stringify(j?.message ?? j?.data?.accessToken?.slice?.(0, 10) ?? Object.keys(j ?? {})));
}