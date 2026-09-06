import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  // content pieces statuses
  const content = await p.content.findMany({ take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, publishedAt: true } });
  console.log('CONTENT statuses:', content.map(c=>`${c.status}/${c.publishedAt?'pub':'-'}:${(c.title||'').slice(0,16)}`).join(' | '));

  const cats = await p.content.count ? await (async()=>{ try{ return await p.content.count(); }catch{return -1;} })() : -1;

  // products with non-ACTIVE status (publish control candidates)
  const prods = await p.product.findMany({ take: 10, orderBy: { updatedAt: 'desc' }, select: { id: true, name: true, status: true } });
  console.log('PRODUCT statuses:', prods.map(x=>`${x.status}:${(x.name||'').slice(0,16)}`).join(' | '));

  // admin user
  const admin = await p.user.findUnique({ where: { email: 'admin@visndt.com' }, select: { id: true, email: true, status: true } }).catch(()=>null);
  console.log('ADMIN USER:', JSON.stringify(admin));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });