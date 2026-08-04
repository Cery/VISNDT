import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '知识中心 – VISNDT',
  description:
    '为工业检测专业人士提供的技术文章、检测指南、应用案例和设备选型指南。',
};

const SECTIONS = [
  {
    title: '检测指南',
    description:
      '工业无损检测的基本原理和方法。了解视觉检测、超声检测、射线检测等NDT技术。',
    items: [
      '视觉检测入门',
      '理解内窥镜规格参数',
      'NDT方法选择指南',
      '检测标准概述',
    ],
  },
  {
    title: '技术文章',
    description:
      '深入的技术文章，涵盖工业检测设备、成像技术和测量技术的最新发展。',
    items: [
      '高清与标清内窥镜对比',
      '立体测量技术',
      '紫外与红外检测应用',
      'NDT中的数字图像处理',
    ],
  },
  {
    title: '应用案例',
    description:
      '真实案例研究，展示工业检测设备如何在各行业部署以解决关键的质量和安全挑战。',
    items: [
      '航空航天：涡轮叶片检测',
      '汽车：发动机缸体质量控制',
      '能源：锅炉管道检查',
      '土木：桥梁结构评估',
    ],
  },
  {
    title: '选型指南',
    description:
      '根据您的具体应用需求、环境和预算，选择合适检测设备的实用指导。',
    items: [
      '如何选择探头直径',
      '转向与固定内窥镜对比',
      '便携式与台式系统对比',
      '影响图像质量的关键因素',
    ],
  },
];

export default function KnowledgePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            知识<span className="text-industrial-cyan">中心</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            为工业检测专业人士提供的专家资源。指南、文章、案例研究和设备选型建议。
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {section.description}
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-slate-600 flex items-start gap-2"
                  >
                    <span className="text-slate-300 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}