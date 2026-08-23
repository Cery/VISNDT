/* Find parameter definitions & a product's parameterValues to construct a valid matchable demand */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async()=>{
  // candidate ACTIVE products with ACTIVE offers
  const cands = await prisma.product.findMany({
    where: { status:'ACTIVE', offers:{ some:{ status:'ACTIVE' } } },
    select: { id:true, name:true, status:true },
  });
  console.log('CANDIDATES', cands.length, cands.map(c=>c.name).join(' | '));

  const pv = await prisma.productParameterValue.findMany({
    where: { product: { status:'ACTIVE', offers:{ some:{ status:'ACTIVE' } } } },
    include: { parameterDefinition: true },
    take: 20,
  });
  console.log('PV rows', pv.length);
  for (const p of pv) console.log(`${p.productId.slice(0,8)} ${p.parameterDefinition.code} [${p.parameterDefinition.name}] ${p.value}${p.valueMin?' min='+p.valueMin:''}${p.valueMax?' max='+p.valueMax:''} dt=${p.parameterDefinition.dataType} unit=${p.parameterDefinition.unit}`);
  await prisma.$disconnect();
})().catch(e=>{console.error(e);process.exit(1);});