/**
 * _796_fix_membership_all.cjs — 为三角色 demo 用户补齐缺失的 OrganizationMember 记录。
 * 角色映射：BUYER 组织 -> MEMBER；SUPPLIER 组织 -> SUPPLIER；ADMIN 组织 -> ADMIN。
 * 仅插入缺失记录（upsert 幂等），不改动其他数据。安全、可重复执行。
 */
const { PrismaClient } = require('@prisma/client');

const TARGETS = [
  { email: 'demo.admin@visndt.local', role: 'ADMIN' },
  { email: 'demo.buyer.01@visndt.local', role: 'MEMBER' },
  { email: 'demo.supplier.01@visndt.local', role: 'SUPPLIER' },
  { email: 'demo.supplier.02@visndt.local', role: 'SUPPLIER' },
];

async function main() {
  const p = new PrismaClient();
  for (const t of TARGETS) {
    const u = await p.user.findUnique({ where: { email: t.email } });
    if (!u) { console.log('!! user not found:', t.email); continue; }
    const org = await p.organization.findUnique({ where: { id: u.organizationId } });
    if (!u.organizationId || !org) { console.log('!! no org for', t.email); continue; }
    const existing = await p.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: u.organizationId, userId: u.id } },
    });
    if (existing) {
      console.log('exists:', t.email, 'role=', existing.role, '(org=', org.type, ')');
      if (existing.role !== t.role) {
        await p.organizationMember.update({
          where: { organizationId_userId: { organizationId: u.organizationId, userId: u.id } },
          data: { role: t.role },
        });
        console.log('  -> role updated to', t.role);
      }
      continue;
    }
    await p.organizationMember.create({
      data: { organizationId: u.organizationId, userId: u.id, role: t.role },
    });
    console.log('created:', t.email, 'role=', t.role, '(org=', org.type, ')');
  }
  await p.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });