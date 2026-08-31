import Link from 'next/link';
import IndustrialBadge from '@/components/brand/IndustrialBadge';

const CORE_CAPABILITIES = [
  { key: 'discovery', label: '能力发现', code: 'DSC-01: 能力发现' },
  { key: 'connection', label: '技术连接', code: 'CNX-02: 技术连接' },
  { key: 'matching', label: '需求匹配', code: 'MCH-03: 需求匹配' },
];

/**
 * M33.8 — Home First-Screen Industrial Tech Visual Repair（734）
 *
 * VT-R1 / VT-R2 / VT-R5：把 733 判定的「深色 Hero + CTA 营销横幅范式」首屏，
 * 重构为非对称工业技术构成 —— 顶部遥测/坐标带 + 左侧文本技术入口 + 右侧
 * 工业检测仪器视觉锚点面板（gauge / 刻度 / 坐标十字线 / 信号读数）+ 底部测量轴 rail。
 *
 * - CTA 收敛为「技术平台入口」（mono 序号 + 测量元数据），不再是整个 Hero 的主视觉焦点。
 * - 仅展示层重组；复用既有 design-tokens / grid-pattern / mono / 工业色；
 *   不新增 data source、不伪造 KPI、不改业务路由（/products /solutions /register）。
 * - 纯展示性遥测标签（SYS.STATUS / GAIN:42dB / AX:28.7°）为技术系统语言，非业务统计。
 * - 保持 Server Component（无 client 指令），h1 唯一。
 */
export default function HeroSection() {
  return (
    <section className="relative bg-industrial-dark overflow-hidden">
      {/* 低噪技术网格（保留既有视觉场） */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-25" aria-hidden="true" />
      {/* 底部收敛，避免与下分区块生硬衔接 */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-industrial-dark to-transparent" aria-hidden="true" />
      {/* 单点受控 glow（非营销发散） */}
      <div className="absolute -left-24 top-16 w-80 h-80 bg-primary/15 rounded-full blur-[110px]" aria-hidden="true" />

      <div className="relative z-10 vds-container-wide px-6 py-12 md:py-16 lg:py-20">
        {/* ---- 顶部遥测 / 坐标带（mono 技术元数据，VT-R5） ---- */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-10 font-mono text-[11px] tracking-[0.18em] uppercase text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan animate-pulse" aria-hidden="true" />
            SYSTEM: ONLINE
          </span>
          <span className="hidden md:inline-flex items-center gap-2">
            <span className="w-6 h-px bg-white/20" aria-hidden="true" />
            NDT BASE: UT / RT / PT
          </span>
          <span className="hidden sm:inline tabular-nums">VISNDT.SYS / 2026</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* ---- 左侧：文本 + 技术入口（CTA 收敛为 Technical Platform Entry） ---- */}
          <div className="lg:col-span-7">
            {/* Brand Context */}
            <IndustrialBadge label="工业检测能力发现平台" tone="cyan" className="mb-6" />
            <p className="font-mono text-xs text-industrial-cyan/70 mb-3 flex items-center gap-2">
              <span aria-hidden="true">[ +00.000° / 123.456E , 45.678N ]</span>
            </p>

            {/* Value Proposition */}
            <h1 className="text-[2rem] sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-5">
              工业无损检测
              <br />
              <span className="bg-gradient-to-r from-industrial-cyan to-primary bg-clip-text text-transparent">
                产品与技术方案
              </span>{' '}
              平台
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
              连接工业检测需求方与能力提供商——发现高精度内窥镜、检测相机、测量系统，
              获取面向航空航天、汽车、管道、制造等行业的专业检测解决方案。
            </p>

            {/* Capability Context — 技术能力条（mono 字段标签，VT-R5） */}
            <div className="flex flex-wrap gap-3 mb-8">
              {CORE_CAPABILITIES.map((c) => (
                <div
                  key={c.key}
                  className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition-all duration-300 hover:border-industrial-cyan/30 hover:bg-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan" aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-200">{c.label}</span>
                  <span className="font-mono text-xs text-industrial-cyan/80">{c.code}</span>
                </div>
              ))}
            </div>

            {/* Action — 技术平台入口（Primary + Secondary，收敛非营销堆叠） */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-7 py-3 bg-primary text-white rounded-md font-semibold shadow-[var(--shadow-industrial-lg)] hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <span className="font-mono text-primary-foreground/60 mr-2 text-xs">ENTER</span>
                浏览产品目录
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center px-7 py-3 border border-white/20 bg-white/5 text-white rounded-md font-semibold hover:bg-white/10 hover:border-white/30 transition-all active:scale-[0.98]"
              >
                <span className="font-mono text-slate-400 mr-2 text-xs">SCAN</span>
                探索检测方案
              </Link>
            </div>

            {/* Role Entry Points（保留既有业务入口语义） */}
            <div className="flex flex-col sm:flex-row gap-3 justify-start items-start sm:items-center">
              <span className="text-xs font-mono text-slate-500">ROLE ACCESS</span>
              <Link
                href="/register?role=BUYER"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <span aria-hidden="true">◈</span>我是检测需求方
              </Link>
              <Link
                href="/register?role=SUPPLIER"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <span aria-hidden="true">◇</span>我是能力提供商
              </Link>
            </div>
          </div>

          {/* ---- 右侧：工业检测仪器视觉锚点面板（VT-R1） ---- */}
          <div className="lg:col-span-5">
            <div
              className="relative rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-10" aria-hidden="true" />
              {/* 面板标题栏 */}
              <div className="relative flex items-center justify-between border-b border-white/10 pb-3 mb-5 font-mono text-[11px] tracking-[0.18em] uppercase">
                <span className="text-industrial-cyan/80">INSTRUMENT / NDT</span>
                <span className="text-slate-500 tabular-nums">GAIN:42dB</span>
              </div>

              {/* 仪器示意：gauge + 刻度 + 坐标十字线（纯装饰） */}
              <svg viewBox="0 0 400 250" className="relative w-full h-auto" fill="none" aria-hidden="true">
                {/* 刻度环 */}
                <g stroke="currentColor" className="text-slate-600">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const a = (i / 24) * Math.PI;
                    const x1 = 200 + Math.sin(a) * 148;
                    const y1 = 30 + 172 - Math.cos(a) * 148;
                    const x2 = 200 + Math.sin(a) * (i % 3 === 0 ? 132 : 140);
                    const y2 = 30 + 172 - Math.cos(a) * (i % 3 === 0 ? 132 : 140);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 2 : 1} />;
                  })}
                </g>
                {/* 量程弧 */}
                <path
                  d="M 86 172 A 114 114 0 0 1 314 172"
                  stroke="currentColor"
                  className="text-industrial-cyan"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* 指针读数 */}
                <line x1="200" y1="172" x2="160" y2="80" stroke="currentColor" className="text-industrial-cyan" strokeWidth="3" strokeLinecap="round" />
                <circle cx="200" cy="172" r="7" fill="currentColor" className="text-industrial-cyan/40" />
                <circle cx="200" cy="172" r="3" fill="currentColor" className="text-industrial-cyan" />

                {/* 坐标十字线 */}
                <g stroke="currentColor" className="text-slate-500" strokeWidth="1">
                  <line x1="40" y1="40" x2="80" y2="40" />
                  <line x1="60" y1="24" x2="60" y2="56" />
                </g>
                <text x="24" y="34" fill="currentColor" className="text-slate-500 font-mono" fontSize="11">AX:28.7°</text>

                {/* 设备/探伤信号线性读数 */}
                <line x1="40" y1="212" x2="360" y2="212" stroke="currentColor" className="text-slate-700" />
                {[60, 110, 160, 210, 260, 310].map((x, i) => (
                  <line key={x} x1={x} y1="204" x2={x} y2={i % 2 ? 212 : 216} stroke="currentColor" className="text-slate-600" />
                ))}
                <path
                  d="M40 212 L80 212 L95 150 L110 212 L150 212 L165 172 L180 212 L230 212 L245 200 L260 212 L360 212"
                  stroke="currentColor"
                  className="text-industrial-cyan/90"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>

              {/* 面板底部 mono 遥测行 */}
              <div className="relative mt-5 grid grid-cols-3 gap-2">
                {[
                  { k: 'SIG', v: 'STABLE' },
                  { k: 'BASE', v: 'UT/RT' },
                  { k: 'MODE', v: 'SCAN' },
                ].map((r) => (
                  <div key={r.k} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="font-mono text-[10px] tracking-widest uppercase text-slate-500">{r.k}</p>
                    <p className="font-mono text-sm font-bold text-industrial-cyan mt-0.5">{r.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- 底部测量轴 rail（空间化/模块化技术信息组织，VT-R2） ---- */}
        <div className="mt-12 pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-lg overflow-hidden">
            {[
              { idx: '01', en: 'DISCOVER', zh: '能力发现', desc: '标准化检测能力目录' },
              { idx: '02', en: 'CONNECT', zh: '技术连接', desc: '需求与方案精确对接' },
              { idx: '03', en: 'MATCH', zh: '需求匹配', desc: '确定性 RFQ 撮合' },
            ].map((m) => (
              <div key={m.idx} className="bg-industrial-dark px-5 py-4 flex items-center gap-4">
                <span className="font-mono text-xl font-bold text-industrial-cyan/70 tabular-nums">{m.idx}</span>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-slate-500">{m.en}</p>
                  <p className="text-white font-semibold leading-tight">{m.zh}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}