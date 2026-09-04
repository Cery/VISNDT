import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const entries = await p.knowledgeEntry.findMany({ select: { slug: true, title: true, status: true }, take: 5 });
console.log(JSON.stringify(entries, null, 2));
await p.$disconnect();