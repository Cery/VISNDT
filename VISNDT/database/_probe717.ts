import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const d = await p.parameterDefinition.findMany({ where: { name: { in: ['检测范围', '灵敏度余量'] } }, select: { name: true, code: true, dataType: true, unit: true } });
  console.log('DEFS:', JSON.stringify(d));
  const rfq = await p.rFQ.findFirst({ select: { id: true, sourceMatchId: true, demandId: true, status: true }, orderBy: { createdAt: 'desc' } });
  console.log('RFQ:', JSON.stringify(rfq));
  const inq = await p.inquiry.findFirst({ select: { id: true, offerId: true, supplierProductId: true }, orderBy: { createdAt: 'desc' } });
  console.log('INQ:', JSON.stringify(inq));
  await p.$disconnect();
})();
