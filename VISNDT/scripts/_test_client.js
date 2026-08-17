const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
console.log('RFQ:', typeof p.rfq);
console.log('RFQResponse:', typeof p.rfQResponse);
console.log('Demand:', typeof p.demand);
console.log('Offer:', typeof p.offer);
console.log('Product:', typeof p.product);
p.$disconnect();