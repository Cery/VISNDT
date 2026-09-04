const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const cats = await p.$queryRawUnsafe(`
    SELECT c.id, c.name, c.slug,
      ((SELECT count(*)::int FROM "product" p WHERE p."category_id"=c.id)) AS products,
      ((SELECT count(*)::int FROM "product_category" ch WHERE ch."parent_id"=c.id)) AS children
    FROM "product_category" c
    ORDER BY products DESC, children DESC, c.name;`);
  console.log(JSON.stringify(cats, null, 2));
  await p.$disconnect();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });