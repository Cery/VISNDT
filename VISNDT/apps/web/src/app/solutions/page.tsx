import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '工业检测解决方案 – VISNDT',
  description:
    '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
};

const SOLUTIONS = [
  {
    title: '航空航天检测',
    description:
      '针对飞机部件、涡轮叶片和复合材料结构的高精度无损检测解决方案。通过先进的视觉和超声检测系统确保飞行安全。',
    scenario: '飞机发动机内窥镜检测、复合材料缺陷检测、焊缝质量评估。',
  },
  {
    title: '汽车检测',
    description:
      '针对发动机部件、传动系统和车身结构的综合检测解决方案。在制造过程中及早发现缺陷。',
    scenario: '发动机缸孔检测、铸件缺陷检测、装配线质量控制。',
  },
  {
    title: '管道检测',
    description:
      '先进的管道检测相机和爬行器系统，用于管道内部检查。识别工业管道中的腐蚀、堵塞和结构问题。',
    scenario: '市政排水检测、石化管道评估、暖通空调管道检测。',
  },
  {
    title: '电子检测',
    description:
      '针对PCB组装、半导体制造和电子元器件质量保证的显微检测解决方案。',
    scenario: 'PCB焊点检测、IC引线框架检查、连接器针脚验证。',
  },
  {
    title: '制造检测',
    description:
      '覆盖制造全流程的在线和离线检测系统，从原材料检测到最终产品验证。',
    scenario: '机加工件表面检测、焊缝检查、涂层质量评估。',
  },
];

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            工业检测<span className="text-industrial-cyan">解决方案</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            为关键工业应用提供全面的无损检测和视觉检测解决方案。
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.title}
              className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">
                {solution.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {solution.description}
              </p>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  应用场景
                </span>
                <p className="text-xs text-slate-500 mt-1">{solution.scenario}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}