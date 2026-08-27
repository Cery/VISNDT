import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const re = /AI|knowledge.?based|LLM|语义相似|embedding/i;
async function main() {
  const matches = await p.demandMatch.findMany({
    take: 30,
    select: { id: true, matchScore: true, matchStatus: true, matchDetails: true },
    orderBy: { createdAt: 'desc' },
  });
  for (const m of matches) {
    const raw = JSON.stringify(m.matchDetails ?? {});
    const hit = raw.match(re);
    console.log(`match=${m.id.slice(0, 8)} score=${m.matchScore} status=${m.matchStatus} len=${raw.length} hit=${hit?.[0] ?? 'none'}`);
    if (hit) {
      const lower = raw.toLowerCase();
      let pos = 0;
      let found: { at: number; kw: string } | null = null;
      const m2 = re.exec(lower);
      if (m2) found = { at: m2.index, kw: m2[0] };
      console.log('   FOUND at', found?.at, 'kw=', found?.kw);
      if (found) console.log('   RAW=' + raw.slice(Math.max(0, found.at - 60), found.at + 60));
    }
  }
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
