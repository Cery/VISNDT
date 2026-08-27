import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const found = await p.inquiry.findMany({ where: { contactEmail: 'm716@visndt.local' }, select: { id: true, productId: true, organizationId: true, contactEmail: true } });
console.log('found', JSON.stringify(found));
const del = await p.inquiry.deleteMany({ where: { contactEmail: 'm716@visndt.local' } });
console.log('deleted', del.count);
const remaining = await p.inquiry.count({ where: { contactEmail: 'm716@visndt.local' } });
console.log('remaining', remaining);
await p.$disconnect();
