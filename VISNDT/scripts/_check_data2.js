const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, status: true },
    take: 10,
  });
  console.log('=== USERS (first 10) ===');
  users.forEach(u => console.log(`  ${u.email} | ${u.name || '-'} | ${u.status}`));

  const products = await prisma.product.findMany({
    select: { id: true, name: true, model: true, status: true, category: { select: { name: true } } },
  });
  console.log('\n=== PRODUCTS ===');
  products.forEach(p => console.log(`  ${p.name} | ${p.model || '-'} | ${p.status} | ${p.category.name}`));

  const demands = await prisma.demand.findMany({
    select: { id: true, title: true, status: true },
    take: 10,
  });
  console.log('\n=== DEMANDS ===');
  demands.forEach(d => console.log(`  ${d.title} | ${d.status}`));

  const orgs = await prisma.organization.findMany({
    select: { id: true, name: true },
    take: 10,
  });
  console.log('\n=== ORGANIZATIONS ===');
  orgs.forEach(o => console.log(`  ${o.name}`));
}

main().then(() => prisma.$disconnect());