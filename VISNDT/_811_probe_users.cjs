const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const users = await p.$queryRawUnsafe(`
    SELECT u.id, u.email, u.name, u.status,
      (SELECT string_agg(m.role, ',') FROM "organization_member" m WHERE m."user_id"=u.id) AS orgroles,
      (SELECT string_agg(o."name", ',') FROM "organization_member" m JOIN "organization" o ON o."id"=m."organization_id" WHERE m."user_id"=u.id) AS orgs
    FROM "user" u
    ORDER BY u."created_at" DESC;`);
  console.log(JSON.stringify(users, null, 2));
  await p.$disconnect();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });