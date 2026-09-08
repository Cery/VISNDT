import Link from 'next/link';
import SectionHeader from '@/components/brand/SectionHeader';

/**
 * 835 Platform UIUX — 首页知识中心改为「工程信息表面」紧凑编排（834 §10 / §17-A）。
 * 移除 834 诊断的 icon-card 营销索引（W6）：不再用大渐变图标块制造“技术感”，
 * 信息本身（mono 索引 + 领域 + 语境 + 严谨描述）即技术感。
 * 全部入口仍落在既有权威 /knowledge-base（无新 Domain / API / 路由）。
 */
const KNOWLEDGE_DOMAINS = [
  { key: '01', title: '检测技术', desc: '内窥镜、超声、涡流等无损检测技术原理与选型指导。' },
  { key: '02', title: '检测场景', desc: '面向航空航天、汽车、管道等典型场景的检测方案拆解。' },
  { key: '03', title: '设备应用', desc: '检测相机、测量系统等设备在实际工况中的应用要点。' },
  { key: '04', title: '行业应用', desc: '不同工业领域的无损检测标准与合规要求解读。' },
  { key: '05', title: '检测方法', desc: '具体缺陷类型对应的检测方法与操作规范说明。' },
  { key: '06', title: '参数指导', desc: '关键检测参数（分辨率、直径、焦距等）的选型指导。' },
];

export default function KnowledgeCenterSection() {
  return (
    <section className="py-16 md:py-20 bg-industrial-slate border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader
          eyebrow="工程信息"
          title="工业检测知识体系"
          subtitle="结构化工程信息：理解检测能力边界、参数语境与标准语境。"
          className="mb-10 animate-slide-up"
        />

        {/* 紧凑工程信息 rail（数据/对象导向，非 icon 营销卡） */}
        <div className="divide-y divide-slate-100 border-y border-slate-200/80">
          {KNOWLEDGE_DOMAINS.map((d) => (
            <Link
              key={d.key}
              href="/knowledge-base"
              className="group flex items-center gap-4 py-3 hover:bg-surface-1 transition-colors"
            >
              <span className="w-10 font-mono text-xs text-slate-400 tabular-nums shrink-0">{d.key}</span>
              <span className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  {d.title}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{d.desc}</span>
              </span>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-right">
          <Link
            href="/knowledge-base"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            进入知识中心
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}