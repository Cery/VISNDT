import Link from 'next/link';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言 — CTA（石墨深底 + 需求 mini-form）。
 * 对齐 visndt_home_redesign.html cta 区块。表单提交引至既有需求创建路由
 * `/workspace/demands/create`（未登录引导登录后继续）。
 */
export default function CTASection() {
  return (
    <section className="bg-blueprint-graphite text-blueprint-paper py-20">
      <BlueprintContainer>
        <div className="grid grid-cols-1 xm:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-[27px] xm:text-[29px] font-extrabold text-white leading-[1.35] max-w-[12em]">
              找不到匹配的检测能力？
            </h2>
            <p className="mt-4 text-[14.5px] text-[#B9BEC3] max-w-[32em] leading-[1.8]">
              提交您的检测需求，系统会转化为标准参数并推送给匹配的供应商，供应商的报价会附带参数核对结果。
            </p>
            <div className="mt-7 flex gap-3">
              <Link
                href="/workspace/demands/create"
                className="rounded-blueprint bg-blueprint-amber text-blueprint-graphite border border-blueprint-amber font-semibold text-[13.5px] px-[18px] py-[9px] hover:bg-blueprint-amber-deep hover:border-blueprint-amber-deep hover:text-white transition-colors"
              >
                提交检测需求
              </Link>
              <Link
                href="/products"
                className="rounded-blueprint bg-transparent text-white border border-[#4B535B] font-semibold text-[13.5px] px-[18px] py-[9px] hover:bg-white/5 transition-colors"
              >
                浏览全部产品
              </Link>
            </div>
          </div>

          <form
            action="/workspace/demands/create"
            method="get"
            className="border border-[#454D55] bg-[#20262D] p-[26px]"
          >
            <label className="block font-mono text-[10.5px] text-[#7C848C] mb-1.5 tracking-[0.02em]">
              检测对象
            </label>
            <input
              type="text"
              name="q"
              placeholder="例如：航空发动机涡轮叶片"
              className="w-full bg-[#171C21] border border-[#3B424A] text-white px-3 py-[11px] text-[13.5px] font-sans mb-4 outline-none focus:border-blueprint-amber rounded-none"
            />
            <label className="block font-mono text-[10.5px] text-[#7C848C] mb-1.5 tracking-[0.02em]">
              关键限制（孔径 / 工作距离 / 环境）
            </label>
            <input
              type="text"
              name="note"
              placeholder="例如：入口孔径 φ8mm，工作距离 1.2m"
              className="w-full bg-[#171C21] border border-[#3B424A] text-white px-3 py-[11px] text-[13.5px] font-sans mb-4 outline-none focus:border-blueprint-amber rounded-none"
            />
            <label className="block font-mono text-[10.5px] text-[#7C848C] mb-1.5 tracking-[0.02em]">
              期望响应时间
            </label>
            <select
              className="w-full bg-[#171C21] border border-[#3B424A] text-white px-3 py-[11px] text-[13.5px] font-sans mb-4 outline-none focus:border-blueprint-amber rounded-none"
            >
              <option>24小时内</option>
              <option>3个工作日内</option>
              <option>不限</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-blueprint bg-blueprint-amber text-blueprint-graphite font-bold text-sm py-[11px] hover:bg-blueprint-amber-deep hover:text-white transition-colors"
            >
              提交需求以开始匹配
            </button>
          </form>
        </div>
      </BlueprintContainer>
    </section>
  );
}