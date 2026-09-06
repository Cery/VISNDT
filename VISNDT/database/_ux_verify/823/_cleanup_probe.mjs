// 823 cleanup & DB restore verification (read-only).
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const prod = await p.supplierProduct.findMany({ select: { id:true, modelNumber:true, status:true } });
console.log('supplierProduct total =', prod.length);
for(const x of prod) console.log('  ', x.modelNumber, x.status, x.id.slice(0,8));

const leftover = await p.supplierProduct.count({ where: { modelNumber: 'UX-REJ-TEST-001' } });
console.log('leftover reject-path UX-REJ-TEST-001 =', leftover);

// controlled accounts
for(const email of ['demo.buyer.01@visndt.local','demo.supplier.01@visndt.local','demo.admin@visndt.local']){
  const u = await p.user.findFirst({ where: { email }, select: { email:true, status:true } });
  console.log('account', email, u?('OK '+u.status):'MISSING');
}

// key demand / match residue from buyer flow (the ACCEPTED match used earlier)
const dm = await p.demandMatch.findMany({ where: { id: '3623963a-a7de-4110-8e58-1b046c101543' }, select: { id:true, matchStatus:true } });
console.log('controlling demandMatch present:', dm.length, dm[0]?.matchStatus);
await p.$disconnect();
process.exit(0);