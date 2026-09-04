const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const r = await p.$queryRawUnsafe('SELECT slug, name FROM "product_category" WHERE slug LIKE \'811%\' OR name LIKE \'811%\' ORDER BY slug');
  console.log(JSON.stringify({ leftover811: r }, null, 2));
  await p.$disconnect();
})().catch((e) => { console.error('ERR ' + e.message); process.exit(1); });