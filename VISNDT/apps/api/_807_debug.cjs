const m = require('@prisma/client');
console.log('PC type:', typeof m.PrismaClient);
const p = new m.PrismaClient();
console.log('p type:', typeof p);
console.log('p.product type:', typeof (p && p.product));
console.log('modelMap:', m.Prisma && m.Prisma.dmmf ? Object.keys(m.Prisma.dmmf.modelMap).join(',') : 'no dmmf');
p.$disconnect().then(()=>process.exit(0)).catch(()=>process.exit(0));