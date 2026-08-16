const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.count({ where: { email: { startsWith: 'demo.' } } });
  const orgs = await p.organization.count({ where: { name: { contains: 'DEMO' } } });
  const orgs2 = await p.organization.count({ where: { name: { in: ['VISNDT 平台运营中心','江南航空检测技术中心','明视工业检测设备有限公司','锐视检测技术有限公司','中科检测设备有限公司'] } } });
  const products = await p.product.count({ where: { slug: { startsWith: 'demo-' } } });
  const offers = await p.offer.count({ where: { title: { contains: '方案' } } });
  const demands = await p.demand.count({ where: { contactEmail: { startsWith: 'demo.buyer' } } });
  const matches = await p.demandMatch.count();
  const rfqs = await p.rFQ.count();
  const rfqResps = await p.rFQResponse.count();
  const content = await p.content.count({ where: { slug: { startsWith: 'demo-' } } });
  const convs = await p.conversionEvent.count();
  const wf = await p.workflowEvent.count();
  const notifs = await p.notification.count({ where: { title: { contains: 'Demo' } } });
  const notifs2 = await p.notification.count({ where: { userId: { in: (await p.user.findMany({ where: { email: { startsWith: 'demo.' } }, select: { id: true } })).map(u => u.id) } } });

  console.log('=== Demo Dataset Status ===');
  console.log('Users:', users);
  console.log('Organizations (by name):', orgs2);
  console.log('Products:', products);
  console.log('Offers:', offers);
  console.log('Demands:', demands);
  console.log('DemandMatches:', matches);
  console.log('RFQs:', rfqs);
  console.log('RFQResponses:', rfqResps);
  console.log('Content:', content);
  console.log('ConversionEvents:', convs);
  console.log('WorkflowEvents:', wf);
  console.log('Notifications:', notifs2);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });