const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('=== 590 M24.1.1 ProductCategoryKnowledgeMapping Seed ===\n');

  // ==========================================
  // Step 1: Create KnowledgeDomains (if not exist)
  // ==========================================
  const domains = [];
  for (const d of [
    { name: '检测技术', slug: 'inspection-technology', sortOrder: 1 },
    { name: '检测参数', slug: 'inspection-parameters', sortOrder: 2 },
    { name: '检测应用', slug: 'inspection-applications', sortOrder: 3 },
  ]) {
    let domain = await prisma.knowledgeDomain.findUnique({ where: { slug: d.slug } });
    if (!domain) {
      domain = await prisma.knowledgeDomain.create({ data: d });
      console.log(`[DOMAIN] Created: ${domain.name}`);
    } else {
      console.log(`[DOMAIN] Exists: ${domain.name}`);
    }
    domains.push(domain);
  }

  // ==========================================
  // Step 2: Create KnowledgeCategories (if not exist)
  // ==========================================
  const [techDomain, paramDomain, appDomain] = domains;
  const categories = [];

  const catDefs = [
    { name: '内窥镜参数', slug: 'endoscope-parameters', domainId: paramDomain.id, sortOrder: 1 },
    { name: '视觉检测', slug: 'visual-inspection', domainId: techDomain.id, sortOrder: 1 },
    { name: '管道检测', slug: 'pipeline-inspection', domainId: appDomain.id, sortOrder: 1 },
    { name: '超声检测', slug: 'ultrasonic-testing', domainId: techDomain.id, sortOrder: 2 },
    { name: '探伤参数', slug: 'flaw-detection-parameters', domainId: paramDomain.id, sortOrder: 2 },
    { name: '三维扫描', slug: '3d-scanning', domainId: techDomain.id, sortOrder: 3 },
  ];

  for (const cd of catDefs) {
    let cat = await prisma.knowledgeCategory.findFirst({
      where: { domainId: cd.domainId, slug: cd.slug }
    });
    if (!cat) {
      cat = await prisma.knowledgeCategory.create({ data: cd });
      console.log(`[CATEGORY] Created: ${cat.name} (Domain: ${domains.find(d=>d.id===cd.domainId).name})`);
    } else {
      console.log(`[CATEGORY] Exists: ${cat.name}`);
    }
    categories.push(cat);
  }

  // ==========================================
  // Step 3: Create ProductCategories for test data (if not exist)
  // ==========================================
  const pcDefs = [
    { name: '三维扫描仪', slug: '3d-scanner' },
    { name: '工业显微镜', slug: 'industrial-microscope' },
    { name: '检测机器人', slug: 'inspection-robot' },
  ];

  for (const pd of pcDefs) {
    let pc = await prisma.productCategory.findUnique({ where: { slug: pd.slug } });
    if (!pc) {
      pc = await prisma.productCategory.create({ data: pd });
      console.log(`[PC] Created: ${pc.name}`);
    } else {
      console.log(`[PC] Exists: ${pc.name}`);
    }
  }

  // ==========================================
  // Step 4: Query all ProductCategories
  // ==========================================
  const pcs = await prisma.productCategory.findMany({ select: { id: true, name: true, slug: true } });
  console.log(`\n=== ${pcs.length} ProductCategories ===`);

  // Match by exact name
  const pcEndoscope = pcs.find(pc => pc.name === '工业内窥镜');
  const pcUSFlaw = pcs.find(pc => pc.name === '超声波探伤仪');
  const pc3D = pcs.find(pc => pc.name === '三维扫描仪');
  const pcMicroscope = pcs.find(pc => pc.name === '工业显微镜');
  const pcRobot = pcs.find(pc => pc.name === '检测机器人');

  const kcEndoscope = categories.find(c => c.name === '内窥镜参数');
  const kcVisual = categories.find(c => c.name === '视觉检测');
  const kcPipeline = categories.find(c => c.name === '管道检测');
  const kcUltrasonic = categories.find(c => c.name === '超声检测');
  const kcFlawParams = categories.find(c => c.name === '探伤参数');
  const kc3DScan = categories.find(c => c.name === '三维扫描');

  console.log('\n=== Matched ===');
  console.log('PC 工业内窥镜:', pcEndoscope ? pcEndoscope.name : 'NONE');
  console.log('PC 超声波探伤仪:', pcUSFlaw ? pcUSFlaw.name : 'NONE');
  console.log('PC 三维扫描仪:', pc3D ? pc3D.name : 'NONE');
  console.log('PC 工业显微镜:', pcMicroscope ? pcMicroscope.name : 'NONE');
  console.log('PC 检测机器人:', pcRobot ? pcRobot.name : 'NONE');

  // ==========================================
  // Step 5: Create mappings (6 test cases)
  // ==========================================
  const mappingDefs = [];

  // Case 1: 工业内窥镜 → 内窥镜参数
  if (pcEndoscope && kcEndoscope) mappingDefs.push({ pc: pcEndoscope.id, kc: kcEndoscope.id, sort: 1, label: 'Case1: 工业内窥镜→内窥镜参数' });

  // Case 2: 工业内窥镜 → 内窥镜参数, 视觉检测, 管道检测
  if (pcEndoscope && kcVisual) mappingDefs.push({ pc: pcEndoscope.id, kc: kcVisual.id, sort: 2, label: 'Case2: 工业内窥镜→视觉检测' });
  if (pcEndoscope && kcPipeline) mappingDefs.push({ pc: pcEndoscope.id, kc: kcPipeline.id, sort: 3, label: 'Case2: 工业内窥镜→管道检测' });

  // Case 3: 视觉检测 ← 工业内窥镜, 工业显微镜, 检测机器人 (M:N reverse)
  if (pcMicroscope && kcVisual) mappingDefs.push({ pc: pcMicroscope.id, kc: kcVisual.id, sort: 1, label: 'Case3: 工业显微镜→视觉检测' });
  if (pcRobot && kcVisual) mappingDefs.push({ pc: pcRobot.id, kc: kcVisual.id, sort: 1, label: 'Case3: 检测机器人→视觉检测' });

  // Case 5: 工业内窥镜→视觉检测 (will be disabled later)
  // Case 6: 超声波探伤仪 → 超声检测, 探伤参数
  if (pcUSFlaw && kcUltrasonic) mappingDefs.push({ pc: pcUSFlaw.id, kc: kcUltrasonic.id, sort: 1, label: 'Case6: 超声波探伤仪→超声检测' });
  if (pcUSFlaw && kcFlawParams) mappingDefs.push({ pc: pcUSFlaw.id, kc: kcFlawParams.id, sort: 2, label: 'Case6: 超声波探伤仪→探伤参数' });

  // Case 6: 三维扫描仪 → 三维扫描
  if (pc3D && kc3DScan) mappingDefs.push({ pc: pc3D.id, kc: kc3DScan.id, sort: 1, label: 'Case6: 三维扫描仪→三维扫描' });

  console.log(`\n=== Creating ${mappingDefs.length} mappings ===`);
  let created = 0, skipped = 0, errors = 0;

  for (const m of mappingDefs) {
    try {
      const existing = await prisma.productCategoryKnowledgeMapping.findUnique({
        where: {
          productCategoryId_knowledgeCategoryId: {
            productCategoryId: m.pc,
            knowledgeCategoryId: m.kc,
          }
        }
      });
      if (existing) {
        console.log(`  SKIP: ${m.label}`);
        skipped++;
        continue;
      }
      await prisma.productCategoryKnowledgeMapping.create({
        data: {
          productCategoryId: m.pc,
          knowledgeCategoryId: m.kc,
          sortOrder: m.sort,
          isActive: true,
        }
      });
      console.log(`  CREATED: ${m.label}`);
      created++;
    } catch (e) {
      console.log(`  ERROR (${m.label}): ${e.message}`);
      errors++;
    }
  }

  // ==========================================
  // Step 6: Verification
  // ==========================================
  const total = await prisma.productCategoryKnowledgeMapping.count();
  console.log(`\n=== Summary: Created=${created}, Skipped=${skipped}, Errors=${errors}, Total=${total} ===`);

  // Case 2: Verify 工业内窥镜 has 3 mappings
  const endoscopeMappings = await prisma.productCategoryKnowledgeMapping.count({
    where: { productCategoryId: pcEndoscope?.id, isActive: true }
  });
  console.log(`\n--- Case 2: 工业内窥镜 mappings: ${endoscopeMappings} (expected 3) ---`);

  // Case 3: Verify M:N — 视觉检测 has multiple ProductCategories
  const visualMappings = await prisma.productCategoryKnowledgeMapping.findMany({
    where: { knowledgeCategoryId: kcVisual?.id, isActive: true },
    include: { productCategory: { select: { name: true } } }
  });
  console.log(`\n--- Case 3: 视觉检测 ← ${visualMappings.length} ProductCategories ---`);
  visualMappings.forEach(m => console.log(`  ${m.productCategory.name}`));

  // Case 4: Duplicate protection
  if (pcEndoscope && kcEndoscope) {
    try {
      await prisma.productCategoryKnowledgeMapping.create({
        data: {
          productCategoryId: pcEndoscope.id,
          knowledgeCategoryId: kcEndoscope.id,
          sortOrder: 99,
        }
      });
      console.log('\n--- Case 4: FAIL - Duplicate was NOT rejected! ---');
    } catch (e) {
      console.log('\n--- Case 4: PASS - Duplicate REJECTED ---');
    }
  }

  // Case 5: Disable 工业内窥镜→视觉检测
  if (pcEndoscope && kcVisual) {
    await prisma.productCategoryKnowledgeMapping.updateMany({
      where: { productCategoryId: pcEndoscope.id, knowledgeCategoryId: kcVisual.id },
      data: { isActive: false }
    });
    const disabled = await prisma.productCategoryKnowledgeMapping.findFirst({
      where: { productCategoryId: pcEndoscope.id, knowledgeCategoryId: kcVisual.id }
    });
    console.log(`\n--- Case 5: Disable 工业内窥镜→视觉检测 ---`);
    console.log(`  Mapping retained: YES (id=${disabled.id})`);
    console.log(`  isActive: ${disabled.isActive} (expected false)`);
  }

  // Case 6: Verify ultrasonic
  const usMappings = await prisma.productCategoryKnowledgeMapping.count({
    where: { productCategoryId: pcUSFlaw?.id, isActive: true }
  });
  console.log(`\n--- Case 6: 超声波探伤仪 mappings: ${usMappings} (expected 2) ---`);

  const d3Mappings = await prisma.productCategoryKnowledgeMapping.count({
    where: { productCategoryId: pc3D?.id, isActive: true }
  });
  console.log(`--- Case 6: 三维扫描仪 mappings: ${d3Mappings} (expected 1) ---`);

  await prisma.$disconnect();
  console.log('\n=== Seed Complete ===');
}

seed().catch(e => { console.error(e); process.exit(1); });