import { PrismaClient, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * M18.1 示例 Content 数据（KNOWLEDGE / SOLUTION / INSIGHT-参数百科）。
 *
 * 用途：验证内容闭环 —— Markdown 内容在 Admin 可编辑、Web 详情页安全渲染。
 * 幂等：按 slug upsert，重复运行不会产生重复数据。
 * 状态：PUBLISHED（Web 可见）。
 *
 * 定位说明：
 * - INSIGHT（参数百科）仅作为关联内容基础，不创建独立导航入口。
 */
interface SampleContent {
  type: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';
  title: string;
  slug: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const samples: SampleContent[] = [
  // ==================== KNOWLEDGE ====================
  {
    type: 'KNOWLEDGE',
    title: '工业视频内窥镜基础介绍',
    slug: 'industrial-video-borescope-introduction',
    summary: '了解工业视频内窥镜的工作原理、主要组成与典型应用场景。',
    content: `# 工业视频内窥镜基础介绍

工业视频内窥镜（Video Borescope）是一种用于**不可直接目视**区域的无损检测设备，通过插入探头即可观察设备内部状况。

## 主要组成

- 主机（显示、存储、控制）
- 插入管（刚性 / 柔性）
- 成像探头（镜头 + 光源）
- 辅助工具（导向、测量、抓取）

## 工作原理

> 探头将视频信号实时回传主机，操作人员无需拆解设备即可完成内部检查。

## 典型技术指标

| 指标 | 说明 |
| --- | --- |
| 探头直径 | 决定可进入的最小孔径 |
| 工作长度 | 决定可检测的深度 |
| 分辨率 | 影响成像清晰度 |
| 防水等级 | 决定环境适应性 |

## 应用价值

采用视频内窥镜可显著降低 **停机成本** 与 **检测风险**，广泛应用于工业设备维护。`,
    seoTitle: '工业视频内窥镜基础介绍',
    seoDescription: '工业视频内窥镜工作原理、组成与典型应用场景。',
    seoKeywords: '工业内窥镜,视频内窥镜,无损检测',
  },
  {
    type: 'KNOWLEDGE',
    title: '柔性探头检测应用场景',
    slug: 'flexible-probe-inspection-scenarios',
    summary: '柔性探头可深入复杂弯曲管路，适用于多种难以触及的内部检测场景。',
    content: `# 柔性探头检测应用场景

柔性探头拥有可弯曲的插入管，能够在**复杂弯曲管路**中灵活穿行，是内部检测的重要工具。

## 适用场景

1. 管道弯头内部检测
2. 发动机气缸内部检查
3. 涡轮叶片根部检查
4. 换热器管束检测

## 选择要点

- **弯曲半径**：越小越易通过急弯
- **导向能力**：是否支持轴向 / 周向导向
- **工作长度**：需覆盖检测深度

> 柔性探头在兼顾灵活性的同时，仍需配合良好的光源与成像质量。

## 小结

柔性探头可显著扩大内窥检测的覆盖范围，是工业无损检测体系中不可或缺的一环。`,
    seoTitle: '柔性探头检测应用场景',
    seoDescription: '柔性探头在管道、发动机等复杂场景的内部检测应用。',
    seoKeywords: '柔性探头,内窥检测,工业检测',
  },
  {
    type: 'KNOWLEDGE',
    title: '工业无损检测技术发展趋势',
    slug: 'industrial-ndt-technology-trends',
    summary: '工业无损检测正向数字化、智能化与自动化方向快速发展。',
    content: `# 工业无损检测技术发展趋势

随着工业制造与运维的智能化升级，无损检测（NDT）技术正迎来快速发展。

## 主要趋势

- **数字化**：检测数据全流程数字化记录与分析
- **智能化**：AI 辅助缺陷识别与自动判定
- **自动化**：机器人搭载检测设备实现无人化作业
- **可视化**：内窥、超声成像等可视化手段普及

## 技术对比

| 技术 | 优势 | 局限 |
| --- | --- | --- |
| 内窥检测 | 直观、可视化 | 受探头可达性限制 |
| 超声检测 | 深度大、灵敏度高 | 需要耦合剂 |
| 射线检测 | 结果直观 | 辐射防护要求高 |

## 展望

> 未来无损检测将更加 **便携化、实时化**，并深度融入工业互联网体系。`,
    seoTitle: '工业无损检测技术发展趋势',
    seoDescription: '工业无损检测技术向数字化、智能化、自动化发展的趋势分析。',
    seoKeywords: '无损检测,NDT,工业检测趋势',
  },

  // ==================== SOLUTION ====================
  {
    type: 'SOLUTION',
    title: '航空发动机内部检测方案',
    slug: 'aero-engine-internal-inspection-solution',
    summary: '面向航空发动机叶片、燃烧室等关键部位的内窥检测整体方案。',
    content: `# 航空发动机内部检测方案

## 方案概述

针对航空发动机 **叶片、燃烧室、涡轮** 等关键部位，提供高分辨率内窥检测整体方案。

## 检测对象

1. 压气机叶片
2. 燃烧室
3. 高压 / 低压涡轮
4. 燃油喷嘴

## 方案优势

- 高分辨率成像，缺陷识别更清晰
- 柔性探头，可达复杂内腔
- 全程检测数据可追溯

| 环节 | 说明 |
| --- | --- |
| 检测准备 | 制定工卡与安全规程 |
| 现场检测 | 多角度记录影像 |
| 数据分析 | 缺陷判定与报告生成 |

## 交付成果

> 提供标准化的检测影像库与缺陷判定报告，助力发动机健康管理。`,
    seoTitle: '航空发动机内部检测方案',
    seoDescription: '航空发动机叶片、燃烧室等关键部位的内窥检测解决方案。',
    seoKeywords: '航空发动机,内部检测,内窥方案',
  },
  {
    type: 'SOLUTION',
    title: '汽车铸件内部缺陷检测方案',
    slug: 'automotive-casting-defect-inspection-solution',
    summary: '针对汽车关键铸件内部气孔、缩松等缺陷的高效检测方案。',
    content: `# 汽车铸件内部缺陷检测方案

## 方案概述

针对汽车 **缸体、缸盖、转向节** 等关键铸件，实现内部缺陷的快速检测与判定。

## 常见缺陷

- 气孔
- 缩松 / 缩孔
- 夹杂
- 裂纹

## 实施流程

1. 建立检测节拍与标准
2. 探头选型与工艺验证
3. 全检 / 抽检策略制定
4. 缺陷数据统计分析

> 本方案可显著提升铸件出厂质量，降低内部缺陷漏检风险。

## 价值体现

通过自动化检测与数据闭环，实现 **质量追溯** 与 **持续改进**。`,
    seoTitle: '汽车铸件内部缺陷检测方案',
    seoDescription: '汽车关键铸件内部气孔、缩松等缺陷的高效检测方案。',
    seoKeywords: '汽车铸件,缺陷检测,内部检测方案',
  },

  // ==================== INSIGHT（参数百科）====================
  {
    type: 'INSIGHT',
    title: '镜头像素参数百科',
    slug: 'insight-lens-pixel-encyclopedia',
    summary: '工业内窥镜镜头像素参数的含义、影响因素与选型建议。',
    content: `# 镜头像素参数百科

## 什么是像素

像素（Pixel）是数字成像的最小单元，**像素数量越高，图像分辨率越高**。

## 常见规格

| 规格 | 典型分辨率 |
| --- | --- |
| 标清 | 640×480 |
| 高清 | 1280×720 |
| 全高清 | 1920×1080 |

## 影响因素

- 传感器尺寸
- 镜头质量
- 光照条件

> 像素并非越高越好，需结合传感器尺寸与使用场景综合选型。

## 选型建议

工业内窥检测建议优先选择 **不小于 1080P** 的成像配置，以确保缺陷细节清晰。`,
    seoTitle: '镜头像素参数百科',
    seoDescription: '工业内窥镜镜头像素参数含义与选型建议。',
    seoKeywords: '镜头像素,参数百科,内窥镜参数',
  },
  {
    type: 'INSIGHT',
    title: '管线直径参数百科',
    slug: 'insight-pipe-diameter-encyclopedia',
    summary: '管线直径参数对内窥探头选型与检测可达性的影响。',
    content: `# 管线直径参数百科

## 定义

管线直径决定了可进入的检测口径，是**探头选型的首要参数**。

## 与探头的关系

- 管线直径 **≥ 探头直径** 方可进入
- 直径差越大，检测空间越充裕
- 过盈配合会导致无法插入

| 管线直径 | 建议探头直径 |
| --- | --- |
| 4mm | ≤ 3.9mm |
| 6mm | ≤ 5.9mm |
| 8mm | ≤ 7.9mm |

> 选择探头时需预留一定余量，避免卡滞。

## 小结

明确管线直径参数，是确保内窥检测**顺利实施**与**安全操作**的基础。`,
    seoTitle: '管线直径参数百科',
    seoDescription: '管线直径参数对内窥探头选型与检测可达性的影响。',
    seoKeywords: '管线直径,参数百科,探头选型',
  },
  {
    type: 'INSIGHT',
    title: '景深参数百科',
    slug: 'insight-depth-of-field-encyclopedia',
    summary: '景深参数对工业内窥成像清晰范围的影响与使用建议。',
    content: `# 景深参数百科

## 什么是景深

景深（Depth of Field, DoF）指成像清晰的距离范围，**景深越大，清晰范围越宽**。

## 相关参数

- 光圈大小
- 焦距
- 物距

## 对检测的影响

1. 景深不足 → 远近物体不能同时清晰
2. 景深过大 → 背景遮罩可能影响主体识别

| 需求场景 | 景深偏好 |
| --- | --- |
| 近距离细节 | 中等景深 |
| 远距离概览 | 大景深 |

> 工业内窥检测需根据目标距离合理调整，获得清晰的缺陷影像。

## 使用建议

先以**概览**确定目标位置，再**靠近**进行细节检测。`,
    seoTitle: '景深参数百科',
    seoDescription: '景深参数对工业内窥成像清晰范围的影响与使用建议。',
    seoKeywords: '景深,参数百科,内窥成像',
  },
];

async function findAuthorId(): Promise<string> {
  const admin = await prisma.user.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });
  if (admin) return admin.id;
  throw new Error('未找到可用用户作为内容作者，请先执行 seed_admin.ts');
}

async function seed() {
  console.log('Seeding sample content (M18.1)...');
  const authorId = await findAuthorId();

  let created = 0;
  let updated = 0;

  for (const s of samples) {
    const content = await prisma.content.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        summary: s.summary,
        content: s.content,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        seoKeywords: s.seoKeywords,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        type: s.type,
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        content: s.content,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        seoKeywords: s.seoKeywords,
      },
    });
    if (content.createdAt.getTime() === content.updatedAt.getTime()) {
      created += 1;
    } else {
      updated += 1;
    }
    console.log(`  [${s.type}] ${s.title} (${s.slug})`);
  }

  console.log('\n=== Sample content seed complete ===');
  console.log(`Created: ${created}, Updated: ${updated}`);
  const counts = await prisma.content.groupBy({ by: ['type'], _count: true });
  for (const c of counts) {
    console.log(`  ${c.type}: ${c._count}`);
  }
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());