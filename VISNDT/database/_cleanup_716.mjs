// One-off cleanup of temp rows left by the failed verify_716 run (A–D6 section only).
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ids = {
  category: 'fe446f46-3ce8-4056-b273-c1585328d37a',
  product: '31e0a4bb-863b-4ef6-8e56-eb10fa4d0d8b',
  demand: 'cf37f61a-e00b-4cdb-af95-9ea5fac34b89',
};
const safe = async (fn, label) => { try { await fn(); } catch (e) { console.log(`  [err:${label}]`, e.message?.slice(0, 120)); } };

// 1. inquiries referencing the product (no offerId column — remove offerId from where)
await safe(() => prisma.inquiry.deleteMany({ where: { productId: ids.product } }), 'inquiry');
// 2. supplier-products referencing the product (sp, sp-reject, sp-chain)
await safe(() => prisma.supplierProduct.deleteMany({ where: { platformProductId: ids.product } }), 'supplierProduct');
// 3. demand params/matches + rFQ chain
await safe(() => prisma.demandParameter.deleteMany({ where: { demandId: ids.demand } }), 'demandParameter');
await safe(() => prisma.demandMatch.deleteMany({ where: { demandId: ids.demand } }), 'demandMatch');
await safe(() => prisma.rFQResponse.deleteMany({ where: { rFQ: { demandId: ids.demand } } }), 'rFQResponse');
await safe(() => prisma.rFQ.deleteMany({ where: { demandId: ids.demand } }), 'rFQ');
await safe(() => prisma.demand.deleteMany({ where: { id: ids.demand } }), 'demand');
// 4. product params/media + product
await safe(() => prisma.productParameterValue.deleteMany({ where: { productId: ids.product } }), 'productParameterValue');
await safe(() => prisma.productMedia.deleteMany({ where: { productId: ids.product } }), 'productMedia');
await safe(() => prisma.product.deleteMany({ where: { id: ids.product } }), 'product');
// 5. category
await safe(() => prisma.productCategory.deleteMany({ where: { id: ids.category } }), 'category');

// 6. any remaining TC716/M716 stragglers
await safe(() => prisma.content.deleteMany({ where: { slug: { startsWith: 'tc716-' } } }), 'content');
await safe(() => prisma.supplierProduct.deleteMany({ where: { brand: { startsWith: 'M716' } } }), 'spM716');
await safe(() => prisma.demandParameter.deleteMany({ where: { demand: { title: { startsWith: 'TC716-' } } } }), 'dpTC716');
await safe(() => prisma.demandMatch.deleteMany({ where: { demand: { title: { startsWith: 'TC716-' } } } }), 'dmTC716');
await safe(() => prisma.rFQResponse.deleteMany({ where: { rFQ: { demand: { title: { startsWith: 'TC716-' } } } } }), 'rqTC716');
await safe(() => prisma.rFQ.deleteMany({ where: { demand: { title: { startsWith: 'TC716-' } } } }), 'rfqTC716');
await safe(() => prisma.demand.deleteMany({ where: { title: { startsWith: 'TC716-' } } }), 'demandTC716');
await safe(() => prisma.productParameterValue.deleteMany({ where: { product: { name: { startsWith: 'TC716-' } } } }), 'ppvTC716');
await safe(() => prisma.productMedia.deleteMany({ where: { product: { name: { startsWith: 'TC716-' } } } }), 'pmTC716');
await safe(() => prisma.supplierProduct.deleteMany({ where: { platformProduct: { name: { startsWith: 'TC716-' } } } }), 'spTC716');
await safe(() => prisma.product.deleteMany({ where: { name: { startsWith: 'TC716-' } } }), 'productTC716');
await safe(() => prisma.productCategory.deleteMany({ where: { name: { startsWith: 'TC716-' } } }), 'categoryTC716');

// verify zero leftovers
const leftover = {
  product: await prisma.product.count({ where: { name: { startsWith: 'TC716-' } } }),
  supplierProduct: await prisma.supplierProduct.count({ where: { OR: [{ brand: { startsWith: 'M716' } }, { platformProduct: { name: { startsWith: 'TC716-' } } }] } }),
  demand: await prisma.demand.count({ where: { title: { startsWith: 'TC716-' } } }),
  inquiry: await prisma.inquiry.count({ where: { contactEmail: 'm716@visndt.local' } }),
  content: await prisma.content.count({ where: { slug: { startsWith: 'tc716-' } } }),
  category: await prisma.productCategory.count({ where: { name: { startsWith: 'TC716-' } } }),
};
console.log('leftover check:', JSON.stringify(leftover));
await prisma.$disconnect();
