/**
 * VISNDT Seed Script — M23.0 Cleanup + Base Data
 *
 * 1. Clean up meaningless E2E test data (users, products, categories, orgs, offers, matches, etc.)
 * 2. Seed 探伤仪 (Flaw Detector) and 工业内窥镜 (Industrial Endoscope) categories + parameters
 */

const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────────

function uid() {
  return randomUUID();
}

function now() {
  return new Date();
}

function slug(text) {
  // Simple slug: Chinese characters kept as-is, spaces → hyphens
  return text.trim().replace(/\s+/g, '-').toLowerCase();
}

// ─── Cleanup ─────────────────────────────────────────────────

async function cleanup() {
  console.log('--- Cleaning up test data ---');

  // 1. Delete dependent data first (respect FK constraints)
  const e2eProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { startsWith: 'E2E_' } },
        { name: { startsWith: 'E2E2_' } },
        { category: { name: { startsWith: 'E2E_' } } },
      ],
    },
    select: { id: true },
  });
  const e2eProductIds = e2eProducts.map(p => p.id);

  if (e2eProductIds.length > 0) {
    // Delete matches referencing these products
    await prisma.demandMatch.deleteMany({ where: { productId: { in: e2eProductIds } } });
    // Delete offers
    await prisma.offer.deleteMany({ where: { productId: { in: e2eProductIds } } });
    // Delete parameter values
    await prisma.productParameterValue.deleteMany({ where: { productId: { in: e2eProductIds } } });
    // Delete parameter associations
    await prisma.productParameterDefinition.deleteMany({ where: { productId: { in: e2eProductIds } } });
    // Delete product media
    await prisma.productMedia.deleteMany({ where: { productId: { in: e2eProductIds } } });
    // Delete products
    await prisma.product.deleteMany({ where: { id: { in: e2eProductIds } } });
    console.log(`  Deleted ${e2eProductIds.length} E2E products`);
  }

  // 2. Delete E2E categories
  const e2eCategories = await prisma.productCategory.findMany({
    where: { name: { startsWith: 'E2E_' } },
    select: { id: true, name: true },
  });
  for (const cat of e2eCategories) {
    // Update demands that reference this category
    await prisma.demand.updateMany({ where: { categoryId: cat.id }, data: { categoryId: null } });
  }
  const deletedCats = await prisma.productCategory.deleteMany({
    where: { name: { startsWith: 'E2E_' } },
  });
  console.log(`  Deleted ${deletedCats.count} E2E categories`);

  // 3. Delete E2E / ??? organizations
  const e2eOrgs = await prisma.organization.findMany({
    where: {
      OR: [
        { name: { startsWith: 'E2E_' } },
        { name: { startsWith: '???' } },
      ],
    },
    select: { id: true, name: true },
  });

  for (const org of e2eOrgs) {
    // Move users in this org to no org
    await prisma.user.updateMany({ where: { organizationId: org.id }, data: { organizationId: null } });
    // Delete org members
    await prisma.organizationMember.deleteMany({ where: { organizationId: org.id } });
    // Delete org demands
    await prisma.demand.deleteMany({ where: { organizationId: org.id } });
    // Delete org offers
    await prisma.offer.deleteMany({ where: { organizationId: org.id } });
    // Delete inquiries
    await prisma.inquiry.deleteMany({ where: { organizationId: org.id } });
  }
  const deletedOrgs = await prisma.organization.deleteMany({
    where: {
      OR: [
        { name: { startsWith: 'E2E_' } },
        { name: { startsWith: '???' } },
      ],
    },
  });
  console.log(`  Deleted ${deletedOrgs.count} E2E organizations`);

  // 4. Delete E2E users (and their related data)
  const e2eUserIds = (await prisma.user.findMany({
    where: { email: { contains: 'e2e_' } },
    select: { id: true },
  })).map(u => u.id);
  if (e2eUserIds.length > 0) {
    // Delete audit logs referencing these users
    await prisma.auditLog.deleteMany({ where: { operatorId: { in: e2eUserIds } } });
    console.log(`  Deleted audit logs for ${e2eUserIds.length} E2E users`);
    // Delete notifications
    await prisma.notification.deleteMany({ where: { userId: { in: e2eUserIds } } });
    console.log(`  Deleted notifications for ${e2eUserIds.length} E2E users`);
  }
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: { contains: 'e2e_' },
    },
  });
  console.log(`  Deleted ${deletedUsers.count} E2E users`);

  // 5. Delete all old parameter groups/definitions (will be re-created)
  const deletedOptions = await prisma.parameterOption.deleteMany({});
  console.log(`  Deleted ${deletedOptions.count} parameter options`);
  const deletedPPD = await prisma.productParameterDefinition.deleteMany({});
  console.log(`  Deleted ${deletedPPD.count} product-parameter associations`);
  const deletedPPV = await prisma.productParameterValue.deleteMany({});
  console.log(`  Deleted ${deletedPPV.count} product parameter values`);
  const deletedDemandParams = await prisma.demandParameter.deleteMany({});
  console.log(`  Deleted ${deletedDemandParams.count} demand parameters`);
  const deletedDefs = await prisma.parameterDefinition.deleteMany({});
  console.log(`  Deleted ${deletedDefs.count} parameter definitions`);
  const deletedGroups = await prisma.parameterGroup.deleteMany({});
  console.log(`  Deleted ${deletedGroups.count} parameter groups`);

  // 6. Delete old categories (keep only the ones we want)
  // Keep existing categories for now, just remove E2E ones (already done)
  // The existing 内窥镜 categories will be reorganized below

  // 7. Delete old offers and matches (will be recreated clean)
  await prisma.demandMatch.deleteMany({});
  console.log('  Deleted all matches');
  await prisma.offer.deleteMany({});
  console.log('  Deleted all offers');

  console.log('Cleanup complete.\n');
}

// ─── Seed Categories ─────────────────────────────────────────

async function seedCategories() {
  console.log('--- Seeding categories ---');

  // Clear existing categories (keep demands' categoryId references intact by nulling them)
  const existingCats = await prisma.productCategory.findMany({ select: { id: true } });
  for (const cat of existingCats) {
    await prisma.demand.updateMany({ where: { categoryId: cat.id }, data: { categoryId: null } });
  }
  // Delete products that reference old categories
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});

  const result = {};

  // ─── 探伤仪 (Flaw Detector) ──────────────────────────────────
  const flawDetector = await prisma.productCategory.create({
    data: {
      id: uid(),
      name: '探伤仪',
      slug: 'flaw-detector',
      createdAt: now(),
      updatedAt: now(),
    },
  });
  result.flawDetector = flawDetector;

  const flawSubcategories = [
    { name: '超声波探伤仪', slug: 'ultrasonic-flaw-detector' },
    { name: '涡流探伤仪', slug: 'eddy-current-flaw-detector' },
    { name: '磁粉探伤仪', slug: 'magnetic-particle-flaw-detector' },
    { name: '射线探伤仪', slug: 'radiographic-flaw-detector' },
  ];
  result.flawSubs = {};
  for (const sub of flawSubcategories) {
    const cat = await prisma.productCategory.create({
      data: {
        id: uid(),
        name: sub.name,
        slug: sub.slug,
        parentId: flawDetector.id,
        createdAt: now(),
        updatedAt: now(),
      },
    });
    result.flawSubs[sub.slug] = cat;
    console.log(`  Created: ${sub.name} (${sub.slug})`);
  }

  // ─── 工业内窥镜 (Industrial Endoscope) ────────────────────────
  const endoscope = await prisma.productCategory.create({
    data: {
      id: uid(),
      name: '工业内窥镜',
      slug: 'industrial-endoscope',
      createdAt: now(),
      updatedAt: now(),
    },
  });
  result.endoscope = endoscope;

  const endoSubcategories = [
    { name: '电子视频内窥镜', slug: 'electronic-video-endoscope' },
    { name: '光学硬杆内窥镜', slug: 'optical-rigid-endoscope' },
    { name: '光纤成像内窥镜', slug: 'fiber-optic-endoscope' },
  ];
  result.endoSubs = {};
  for (const sub of endoSubcategories) {
    const cat = await prisma.productCategory.create({
      data: {
        id: uid(),
        name: sub.name,
        slug: sub.slug,
        parentId: endoscope.id,
        createdAt: now(),
        updatedAt: now(),
      },
    });
    result.endoSubs[sub.slug] = cat;
    console.log(`  Created: ${sub.name} (${sub.slug})`);
  }

  console.log('Categories seeded.\n');
  return result;
}

// ─── Seed Parameter Groups & Definitions ─────────────────────

async function seedParameters() {
  console.log('--- Seeding parameters ---');

  const result = { groups: {}, defs: {} };

  // ═══════════════════════════════════════════════════════════
  // 探伤仪参数
  // ═══════════════════════════════════════════════════════════

  // --- 检测参数组 ---
  const detGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '检测参数', code: 'FD_DETECTION',
      description: '探伤仪检测能力核心参数',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.FD_DETECTION = detGroup;

  const detectionParams = [
    { name: '检测范围', code: 'detection_range', unit: 'mm', dataType: 'STRING' },
    { name: '工作频率', code: 'operating_frequency', unit: 'MHz', dataType: 'STRING' },
    { name: '灵敏度余量', code: 'sensitivity_margin', unit: 'dB', dataType: 'NUMBER' },
    { name: '垂直线性误差', code: 'vertical_linearity_error', unit: '%', dataType: 'NUMBER' },
    { name: '水平线性误差', code: 'horizontal_linearity_error', unit: '%', dataType: 'NUMBER' },
    { name: '分辨率', code: 'resolution', unit: 'mm', dataType: 'STRING' },
    { name: '探头类型', code: 'probe_type', unit: null, dataType: 'STRING' },
    { name: '检测通道数', code: 'channel_count', unit: '个', dataType: 'NUMBER' },
    { name: '重复频率', code: 'repetition_rate', unit: 'Hz', dataType: 'STRING' },
    { name: '增益范围', code: 'gain_range', unit: 'dB', dataType: 'STRING' },
  ];
  for (const p of detectionParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: detGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  // --- 物理参数组 ---
  const physGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '物理参数', code: 'FD_PHYSICAL',
      description: '探伤仪物理规格参数',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.FD_PHYSICAL = physGroup;

  const physicalParams = [
    { name: '整机重量', code: 'weight', unit: 'kg', dataType: 'NUMBER' },
    { name: '外形尺寸', code: 'dimensions', unit: 'mm', dataType: 'STRING' },
    { name: '屏幕尺寸', code: 'screen_size', unit: '英寸', dataType: 'STRING' },
    { name: '屏幕分辨率', code: 'screen_resolution', unit: 'px', dataType: 'STRING' },
    { name: '电池容量', code: 'battery_capacity', unit: 'mAh', dataType: 'NUMBER' },
    { name: '续航时间', code: 'battery_life', unit: 'h', dataType: 'NUMBER' },
    { name: '供电方式', code: 'power_supply', unit: null, dataType: 'STRING' },
    { name: '数据接口', code: 'data_interface', unit: null, dataType: 'STRING' },
    { name: '存储容量', code: 'storage_capacity', unit: 'GB', dataType: 'NUMBER' },
  ];
  for (const p of physicalParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: physGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  // --- 环境参数组 ---
  const envGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '环境参数', code: 'FD_ENVIRONMENT',
      description: '探伤仪使用环境要求',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.FD_ENVIRONMENT = envGroup;

  const envParams = [
    { name: '工作温度范围', code: 'operating_temperature', unit: '℃', dataType: 'STRING' },
    { name: '存储温度范围', code: 'storage_temperature', unit: '℃', dataType: 'STRING' },
    { name: '防护等级', code: 'ip_rating', unit: null, dataType: 'STRING' },
    { name: '相对湿度', code: 'relative_humidity', unit: '%RH', dataType: 'STRING' },
  ];
  for (const p of envParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: envGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  // ═══════════════════════════════════════════════════════════
  // 工业内窥镜参数
  // ═══════════════════════════════════════════════════════════

  // --- 光学参数组 ---
  const optGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '光学参数', code: 'IE_OPTICAL',
      description: '工业内窥镜光学成像核心参数',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.IE_OPTICAL = optGroup;

  const opticalParams = [
    { name: '探头直径', code: 'probe_diameter', unit: 'mm', dataType: 'STRING' },
    { name: '工作长度', code: 'working_length', unit: 'm', dataType: 'STRING' },
    { name: '视场角', code: 'field_of_view', unit: '°', dataType: 'NUMBER' },
    { name: '景深范围', code: 'depth_of_field', unit: 'mm', dataType: 'STRING' },
    { name: '照明方式', code: 'illumination_type', unit: null, dataType: 'STRING' },
    { name: '镜头类型', code: 'lens_type', unit: null, dataType: 'STRING' },
    { name: '焦距类型', code: 'focus_type', unit: null, dataType: 'STRING' },
  ];
  for (const p of opticalParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: optGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  // --- 物理参数组 ---
  const iePhysGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '物理参数', code: 'IE_PHYSICAL',
      description: '工业内窥镜物理规格参数',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.IE_PHYSICAL = iePhysGroup;

  const iePhysicalParams = [
    { name: '整机重量', code: 'ie_weight', unit: 'kg', dataType: 'NUMBER' },
    { name: '显示屏尺寸', code: 'ie_display_size', unit: '英寸', dataType: 'STRING' },
    { name: '插入管材质', code: 'insertion_tube_material', unit: null, dataType: 'STRING' },
    { name: '弯曲角度(上/下/左/右)', code: 'articulation_angle', unit: '°', dataType: 'STRING' },
    { name: '电池续航', code: 'ie_battery_life', unit: 'h', dataType: 'NUMBER' },
    { name: '数据接口', code: 'ie_data_interface', unit: null, dataType: 'STRING' },
    { name: '存储容量', code: 'ie_storage', unit: 'GB', dataType: 'NUMBER' },
  ];
  for (const p of iePhysicalParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: iePhysGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  // --- 性能参数组 ---
  const perfGroup = await prisma.parameterGroup.create({
    data: {
      id: uid(), name: '性能参数', code: 'IE_PERFORMANCE',
      description: '工业内窥镜性能与功能参数',
      createdAt: now(), updatedAt: now(),
    },
  });
  result.groups.IE_PERFORMANCE = perfGroup;

  const perfParams = [
    { name: '图像分辨率', code: 'image_resolution', unit: '像素', dataType: 'STRING' },
    { name: '视频分辨率', code: 'video_resolution', unit: '像素', dataType: 'STRING' },
    { name: '图像传感器', code: 'image_sensor', unit: null, dataType: 'STRING' },
    { name: '变焦倍数', code: 'zoom_factor', unit: 'x', dataType: 'NUMBER' },
    { name: '防护等级', code: 'ie_ip_rating', unit: null, dataType: 'STRING' },
    { name: '工作温度', code: 'ie_operating_temp', unit: '℃', dataType: 'STRING' },
    { name: '测量功能', code: 'measurement_function', unit: null, dataType: 'STRING' },
    { name: '图像处理功能', code: 'image_processing', unit: null, dataType: 'STRING' },
  ];
  for (const p of perfParams) {
    const def = await prisma.parameterDefinition.create({
      data: {
        id: uid(), name: p.name, code: p.code,
        parameterGroupId: perfGroup.id, unit: p.unit,
        dataType: p.dataType, required: false,
        createdAt: now(), updatedAt: now(),
      },
    });
    result.defs[p.code] = def;
  }

  console.log('Parameters seeded.\n');
  return result;
}

// ─── Seed Parameter Options ──────────────────────────────────

async function seedOptions(defs) {
  console.log('--- Seeding parameter options ---');

  const optionsMap = {
    // 探头类型
    probe_type: [
      { value: 'single', label: '单晶直探头', order: 1 },
      { value: 'dual', label: '双晶直探头', order: 2 },
      { value: 'angle', label: '斜探头', order: 3 },
      { value: 'immersion', label: '水浸探头', order: 4 },
      { value: 'phased_array', label: '相控阵探头', order: 5 },
      { value: 'tofd', label: 'TOFD探头', order: 6 },
    ],
    // 供电方式
    power_supply: [
      { value: 'battery', label: '内置电池', order: 1 },
      { value: 'ac', label: '交流电源', order: 2 },
      { value: 'dual', label: '电池/交流双供电', order: 3 },
    ],
    // 数据接口
    data_interface: [
      { value: 'usb', label: 'USB', order: 1 },
      { value: 'wifi', label: 'WiFi', order: 2 },
      { value: 'ethernet', label: '以太网', order: 3 },
      { value: 'bluetooth', label: '蓝牙', order: 4 },
    ],
    // 照明方式
    illumination_type: [
      { value: 'led', label: 'LED照明', order: 1 },
      { value: 'fiber', label: '光纤导光', order: 2 },
      { value: 'laser', label: '激光照明', order: 3 },
      { value: 'uv', label: '紫外光', order: 4 },
    ],
    // 镜头类型
    lens_type: [
      { value: 'direct', label: '直视', order: 1 },
      { value: 'side', label: '侧视', order: 2 },
      { value: 'dual', label: '双镜头', order: 3 },
    ],
    // 焦距类型
    focus_type: [
      { value: 'fixed', label: '定焦', order: 1 },
      { value: 'manual', label: '手动调焦', order: 2 },
      { value: 'auto', label: '自动对焦', order: 3 },
    ],
    // 插入管材质
    insertion_tube_material: [
      { value: 'tungsten', label: '钨丝编织管', order: 1 },
      { value: 'stainless', label: '不锈钢编织管', order: 2 },
      { value: 'pu', label: 'PU涂塑管', order: 3 },
    ],
    // 图像传感器
    image_sensor: [
      { value: 'cmos', label: 'CMOS', order: 1 },
      { value: 'ccd', label: 'CCD', order: 2 },
    ],
    // 防护等级
    ie_ip_rating: [
      { value: 'ip65', label: 'IP65', order: 1 },
      { value: 'ip67', label: 'IP67', order: 2 },
      { value: 'ip68', label: 'IP68', order: 3 },
    ],
    // 测量功能
    measurement_function: [
      { value: 'none', label: '无', order: 1 },
      { value: 'length', label: '长度测量', order: 2 },
      { value: 'area', label: '面积测量', order: 3 },
      { value: 'stereo', label: '立体测量', order: 4 },
    ],
    // 图像处理功能
    image_processing: [
      { value: 'none', label: '无', order: 1 },
      { value: 'brightness', label: '亮度调节', order: 2 },
      { value: 'sharpness', label: '锐化', order: 3 },
      { value: 'hdr', label: 'HDR', order: 4 },
      { value: 'negative', label: '负片', order: 5 },
    ],
    // 防护等级 (探伤仪)
    ip_rating: [
      { value: 'ip54', label: 'IP54', order: 1 },
      { value: 'ip65', label: 'IP65', order: 2 },
      { value: 'ip67', label: 'IP67', order: 3 },
    ],
  };

  let count = 0;
  for (const [code, options] of Object.entries(optionsMap)) {
    const def = defs[code];
    if (!def) continue;
    for (const opt of options) {
      await prisma.parameterOption.create({
        data: {
          id: uid(),
          parameterDefinitionId: def.id,
          value: opt.value,
          label: opt.label,
          sortOrder: opt.order,
          createdAt: now(),
          updatedAt: now(),
        },
      });
      count++;
    }
  }
  console.log(`  Seeded ${count} parameter options\n`);
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log('=== VISNDT Seed Script ===\n');

  await cleanup();
  const categories = await seedCategories();
  const params = await seedParameters();
  await seedOptions(params.defs);

  // Print summary
  console.log('=== Seed Summary ===');
  const catCount = await prisma.productCategory.count();
  const groupCount = await prisma.parameterGroup.count();
  const defCount = await prisma.parameterDefinition.count();
  const optCount = await prisma.parameterOption.count();
  const userCount = await prisma.user.count();
  const prodCount = await prisma.product.count();
  console.log(`  Categories: ${catCount}`);
  console.log(`  Parameter Groups: ${groupCount}`);
  console.log(`  Parameter Definitions: ${defCount}`);
  console.log(`  Parameter Options: ${optCount}`);
  console.log(`  Users: ${userCount}`);
  console.log(`  Products: ${prodCount}`);
  console.log('\nDone.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });