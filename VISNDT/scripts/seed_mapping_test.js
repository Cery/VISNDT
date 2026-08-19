const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // 1. Query existing ProductCategories
  const pcs = await prisma.productCategory.findMany({ select: { id: true, name: true, slug: true } });
  console.log('=== ProductCategories ===');
  pcs.forEach(pc => console.log(`  ${pc.id} | ${pc.name} | ${pc.slug}`));

  // 2. Query existing KnowledgeCategories
  const kcs = await prisma.knowledgeCategory.findMany({
    include: { domain: { select: { id: true, name: true } } }
  });
  console.log('\n=== KnowledgeCategories ===');
  kcs.forEach(kc => console.log(`  ${kc.id} | ${kc.name} | ${kc.slug} | Domain: ${kc.domain.name}`));

  // 3. Create test mappings
  // Find the product categories and knowledge categories
  const pcIndustrialEndoscope = pcs.find(pc => pc.slug.includes('neikuijing') || pc.name.includes('内窥镜'));
  const pcUltrasonic = pcs.find(pc => pc.slug.includes('tanshang') || pc.name.includes('探伤'));
  const pc3DScanner = pcs.find(pc => pc.slug.includes('saomiao') || pc.name.includes('扫描'));
  const pcMicroscope = pcs.find(pc => pc.slug.includes('xianweijing') || pc.name.includes('显微镜'));
  const pcRobot = pcs.find(pc => pc.slug.includes('jiqiren') || pc.name.includes('机器人'));

  const kcEndoscopeParams = kcs.find(kc => kc.name.includes('内窥镜'));
  const kcVisual = kcs.find(kc => kc.name.includes('视觉'));
  const kcPipeline = kcs.find(kc => kc.name.includes('管道'));
  const kcUltrasonicTest = kcs.find(kc => kc.name.includes('超声'));
  const kcFlawParams = kcs.find(kc => kc.name.includes('探伤'));
  const kc3DScan = kcs.find(kc => kc.name.includes('三维') || kc.name.includes('扫描'));

  console.log('\n=== Matched Categories ===');
  console.log('PC Industrial Endoscope:', pcIndustrialEndoscope?.name);
  console.log('PC Ultrasonic:', pcUltrasonic?.name);
  console.log('PC 3D Scanner:', pc3DScanner?.name);
  console.log('PC Microscope:', pcMicroscope?.name);
  console.log('PC Robot:', pcRobot?.name);
  console.log('KC Endoscope Params:', kcEndoscopeParams?.name);
  console.log('KC Visual:', kcVisual?.name);
  console.log('KC Pipeline:', kcPipeline?.name);
  console.log('KC Ultrasonic:', kcUltrasonicTest?.name);
  console.log('KC Flaw Params:', kcFlawParams?.name);
  console.log('KC 3D Scan:', kc3DScan?.name);

  // 4. Create mappings
  const mappings = [];
  if (pcIndustrialEndoscope && kcEndoscopeParams) {
    mappings.push({ productCategoryId: pcIndustrialEndoscope.id, knowledgeCategoryId: kcEndoscopeParams.id, sortOrder: 1 });
  }
  if (pcIndustrialEndoscope && kcVisual) {
    mappings.push({ productCategoryId: pcIndustrialEndoscope.id, knowledgeCategoryId: kcVisual.id, sortOrder: 2 });
  }
  if (pcIndustrialEndoscope && kcPipeline) {
    mappings.push({ productCategoryId: pcIndustrialEndoscope.id, knowledgeCategoryId: kcPipeline.id, sortOrder: 3 });
  }
  if (pcUltrasonic && kcUltrasonicTest) {
    mappings.push({ productCategoryId: pcUltrasonic.id, knowledgeCategoryId: kcUltrasonicTest.id, sortOrder: 1 });
  }
  if (pcUltrasonic && kcFlawParams) {
    mappings.push({ productCategoryId: pcUltrasonic.id, knowledgeCategoryId: kcFlawParams.id, sortOrder: 2 });
  }
  if (pc3DScanner && kc3DScan) {
    mappings.push({ productCategoryId: pc3DScanner.id, knowledgeCategoryId: kc3DScan.id, sortOrder: 1 });
  }
  // M:N reverse: Visual also maps to Microscope and Robot
  if (pcMicroscope && kcVisual) {
    mappings.push({ productCategoryId: pcMicroscope.id, knowledgeCategoryId: kcVisual.id, sortOrder: 1 });
  }
  if (pcRobot && kcVisual) {
    mappings.push({ productCategoryId: pcRobot.id, knowledgeCategoryId: kcVisual.id, sortOrder: 1 });
  }

  console.log('\n=== Creating Mappings ===');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const m of mappings) {
    try {
      const existing = await prisma.productCategoryKnowledgeMapping.findUnique({
        where: {
          productCategoryId_knowledgeCategoryId: {
            productCategoryId: m.productCategoryId,
            knowledgeCategoryId: m.knowledgeCategoryId,
          }
        }
      });
      if (existing) {
        console.log(`  SKIP (duplicate): PC=${m.productCategoryId} KC=${m.knowledgeCategoryId}`);
        skipped++;
        continue;
      }
      const result = await prisma.productCategoryKnowledgeMapping.create({
        data: m,
        include: {
          productCategory: { select: { name: true } },
          knowledgeCategory: { select: { name: true } },
        }
      });
      console.log(`  CREATED: ${result.productCategory.name} <-> ${result.knowledgeCategory.name}`);
      created++;
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
      errors++;
    }
  }

  // 5. Summary
  const total = await prisma.productCategoryKnowledgeMapping.count();
  console.log(`\n=== Summary ===`);
  console.log(`Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`Total mappings: ${total}`);

  // 6. Verify M:N
  const visualMappings = await prisma.productCategoryKnowledgeMapping.count({
    where: { knowledgeCategoryId: kcVisual?.id }
  });
  console.log(`\nKC Visual mappings count: ${visualMappings}`);

  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });