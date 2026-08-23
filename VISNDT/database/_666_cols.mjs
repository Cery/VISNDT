// inspect supplier_product columns
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const rows = await p.$queryRawUnsafe(
    "select column_name from information_schema.columns where table_name='supplier_product' order by ordinal_position",
  );
  console.log(rows.map((r) => r.column_name).join(', '));
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
