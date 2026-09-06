import { PrismaClient } from '../../node_modules/.prisma/client/index.js';
const prisma = new PrismaClient();
try {
  const mediaCount = await prisma.supplierProductMedia.count();
  const paramCount = await prisma.supplierProductParameterValue.count();
  const spCount = await prisma.supplierProduct.count();
  console.log('supplierProduct.count', spCount);
  console.log('supplierProductMedia.count', mediaCount);
  console.log('supplierProductParameterValue.count', paramCount);
  if (mediaCount > 0) {
    const m = await prisma.supplierProductMedia.findMany({ take: 3, include: { supplierProduct: { select: { id: true, organizationId: true } } } });
    console.log('mediaSample', JSON.stringify(m.map(x => ({ id: x.id, spId: x.supplierProductId, org: x.supplierProduct?.organizationId, t: x.mediaType, prim: x.isPrimary, ord: x.displayOrder }))));
  }
  if (paramCount > 0) {
    const p = await prisma.supplierProductParameterValue.findMany({ take: 3, include: { supplierProduct: { select: { id: true, organizationId: true } } } });
    console.log('paramSample', JSON.stringify(p.map(x => ({ id: x.id, spId: x.supplierProductId, org: x.supplierProduct?.organizationId, def: x.parameterDefinitionId }))));
  }
} finally {
  await prisma.$disconnect();
}