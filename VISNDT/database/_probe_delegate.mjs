import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const k = Object.keys(p).filter((x) => /rfq|RFQ|inquir|offer|demand|supplier|product|content/i.test(x));
console.log(JSON.stringify(k, null, 0));
await p.$disconnect();
