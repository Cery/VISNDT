import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import IndustrialBadge from '@/components/brand/IndustrialBadge';

/**
 * 702_M29.2 — Search Hero.
 *
 * Elevates search from an auxiliary header tool into the core entry point for
 * Industrial Inspection Capability Discovery. Reuses the existing
 * GlobalSearchBar (no new search logic, API, or data structure) and expresses
 * only the legal search domains (检测能力 / 产品型号 / 知识 / 方案).
 */

const SEARCH_DOMAIN_HINTS = ['检测能力', '产品型号', '知识', '方案'];

export default function SearchHero() {
  return (
    <section className="relative bg-industrial-dark overflow-hidden">
      {/* Grid pattern overlay (matches home HeroSection language) */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-40" />
      {/* Ambient glows */}
      <div className="absolute -left-20 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute -right-20 top-1/3 w-96 h-96 bg-industrial-cyan/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-20 lg:py-24 text-center">
        {/* Eyebrow — brand context */}
        <IndustrialBadge label="工业检测能力发现平台" className="mb-6" />

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          搜索
          <span className="bg-gradient-to-r from-industrial-cyan to-primary bg-clip-text text-transparent">
            工业检测能力
          </span>
        </h1>

        {/* Capability discovery description */}
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          按产品型号、检测参数或技术关键词，发现工业检测能力、产品型号、技术知识与解决方案。
        </p>

        {/* Large search box — reuses existing GlobalSearchBar search logic */}
        <div className="max-w-2xl mx-auto">
          <GlobalSearchBar
            variant="hero"
            placeholder="搜索检测能力、型号、参数、知识或方案..."
          />
        </div>

        {/* Search domain hint — legal domains only, no standalone supplier */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500">可搜索：</span>
          {SEARCH_DOMAIN_HINTS.map((domain) => (
            <span
              key={domain}
              className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300"
            >
              {domain}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}