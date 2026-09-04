import Link from 'next/link';
import SectionHeader from '@/components/brand/SectionHeader';

/**
 * M39 (799) — Platform Operating Loop Section（首页平台化重构 · 新增展示组件）。
 *
 * 目标：把首页从「企业官网集合」层面（页面各自为政）提升为「工程能力发现平台」的
 * 首屏操作模型 —— 显式呈现 VISNDT 的端到端业务闭环与双角色旅程，而不是孤立页面入口。
 *
 * 语义冻结声明（§5.2 / §8）：
 *  - 仅重排/重组既有权威的展示层（Discovery / Capability / Demand / Match / RFQ /
 *    Response / Offer / Inquiry / Workspace），全部复用现有 canonical 路由；
 *  - 不新增任何 Domain / Authority / Entity / API / Schema / 第二套工作流；
 *  - Inquiry 始终保持「连接（Connection）」语义，绝不为本组件引入交易语义；
 *  - 仅创建展示层新组件（§5.1 明确允许重组页面/重排区块/新增展示组件）。
 */
export default function PlatformJourneySection() {
  return (
    <section className="py-20 md:py-24 bg-white border-y border-slate-100 overflow-hidden">
      <div className="vds-container-wide px-6">
        <SectionHeader
          eyebrow="平台操作模型"
          title="一条工程发现到技术连接的业务闭环"
          subtitle="VISNDT 不是企业官网合集，而是工业检测能力发现平台：从工程信息出发，到能力评估、需求匹配、询价响应、报价决策，直至技术连接与业务跟进。"
          className="mb-14"
        />

        {/* ——— 统一业务闭环 stepper（平台操作模型的「主循环」）——— */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-primary rounded-full" />
            <h3 className="text-base font-bold text-foreground">统一业务闭环</h3>
            <span className="text-xs font-mono text-muted-foreground">/ PLATFORM LOOP</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {LOOP_STEPS.map((step) => (
              <Link
                key={step.seq}
                href={step.href}
                className="group relative flex flex-col rounded-xl border border-slate-200/80 bg-surface-1 p-4 shadow-industrial-sm hover:border-primary/40 hover:shadow-industrial-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-slate-400 tabular-nums">{step.seq}</span>
                  <span className="w-6 h-px bg-gradient-to-r from-primary/70 to-transparent" aria-hidden="true" />
                </div>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary shrink-0">{step.en}</p>
                <p className="text-sm font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{step.zh}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{step.desc}</p>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
            第 03–09 步在登录后于工作台内完成；未登录用户可从公开发现面（01–02）起步。
          </p>
        </div>

        {/* ——— 双角色旅程（BUYER loop / SUPPLIER loop）——— */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ROLE_JOURNEYS.map((journey) => (
            <div
              key={journey.role}
              className="relative rounded-2xl border border-slate-200/80 bg-surface-2 p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/70 to-industrial-cyan/0" aria-hidden="true" />
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{journey.role}</p>
                  <h4 className="text-lg font-bold text-foreground mt-1">{journey.title}</h4>
                </div>
                <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-muted-foreground">
                  {journey.tag}
                </span>
              </div>

              <ol className="space-y-0">
                {journey.steps.map((s, i) => (
                  <li key={s.label} className="relative flex gap-4 pb-4 last:pb-0">
                    {/* 竖线轨道 */}
                    {i < journey.steps.length - 1 && (
                      <span className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200" aria-hidden="true" />
                    )}
                    <span className="relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-primary">
                      {s.seq}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={journey.primaryHref}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg text-sm font-semibold shadow-industrial-sm hover:opacity-90 transition-opacity"
                >
                  {journey.primaryLabel}
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
                >
                  先看能力
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const LOOP_STEPS = [
  { seq: '01', en: 'Discover', zh: '工程发现', desc: '统一检索能力/产品/知识/方案', href: '/search' },
  { seq: '02', en: 'Evaluate', zh: '能力评估', desc: '参数理解、对比与技术判断', href: '/products' },
  { seq: '03', en: 'Demand', zh: '提出需求', desc: '发布结构化检测需求', href: '/register' },
  { seq: '04', en: 'Match', zh: '确定性匹配', desc: '加权参数匹配具备能力的供应商', href: '/register' },
  { seq: '05', en: 'RFQ', zh: '发起询价', desc: '定向询价请求（连接起点）', href: '/register' },
  { seq: '06', en: 'Response', zh: '方案响应', desc: '供应商提交方案与参数响应', href: '/register' },
  { seq: '07', en: 'Offer', zh: '报价决策', desc: 'Offer/Quote 评估与决策', href: '/register' },
  { seq: '08', en: 'Connect', zh: '技术连接', desc: 'Inquiry 建立业务连接', href: '/register' },
  { seq: '09', en: 'Follow-up', zh: '业务跟进', desc: '工作台商机闭环与通知', href: '/register' },
];

const ROLE_JOURNEYS = [
  {
    role: 'BUYER',
    title: '采购方工作流',
    tag: '需求发起 · RFQ 发起',
    primaryHref: '/register?role=BUYER',
    primaryLabel: '进入采购方工作台',
    steps: [
      { seq: '01', label: '提出检测需求', desc: '在需求工作台创建 Demand，定义检测参数与优先项。' },
      { seq: '02', label: '获得确定性匹配', desc: '平台按工程相关性加权匹配具备能力的供应商。' },
      { seq: '03', label: '发起询价（RFQ）', desc: '向定向供应商发起询价，进入方案获取通道。' },
      { seq: '04', label: '评审响应与报价', desc: '查看供应商方案响应与 Offer/Quote 并做决策。' },
      { seq: '05', label: '技术连接与跟进', desc: '通过 Inquiry 建立连接，在工作台持续跟进闭环。' },
    ],
  },
  {
    role: 'SUPPLIER',
    title: '能力提供商工作流',
    tag: '机会接收 · 方案报价',
    primaryHref: '/register?role=SUPPLIER',
    primaryLabel: '进入供应商工作台',
    steps: [
      { seq: '01', label: '接收询价机会', desc: '在机会中心查看定向 RFQ 与匹配能力机会。' },
      { seq: '02', label: '评审询价需求', desc: '理解需求参数上下文，判断能力匹配度。' },
      { seq: '03', label: '提交方案响应', desc: '提交响应并提供能力参数与交付说明。' },
      { seq: '04', label: '准备报价（Offer）', desc: '针对已接受响应准备供应能力报价。' },
      { seq: '05', label: '建立连接与跟进', desc: '通过 Inquiry 建立业务连接，并在工作台持续跟进。' },
    ],
  },
];