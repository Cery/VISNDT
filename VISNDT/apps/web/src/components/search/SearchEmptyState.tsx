import Link from 'next/link';

type EmptyStateType = 'no-keyword' | 'no-results' | 'no-results-type';

interface SearchEmptyStateProps {
  type: EmptyStateType;
  /** Search keyword for contextual message */
  keyword?: string;
  /** Active search domain for type-specific message */
  domain?: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  product: '检测能力',
  'supplier-product': '能力型号',
  knowledge: '知识',
  solution: '方案',
  supplier: '供应商',
};

export default function SearchEmptyState({ type, keyword, domain }: SearchEmptyStateProps) {
  if (type === 'no-keyword') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Search Icon */}
        <div className="w-16 h-16 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          请输入搜索关键词
        </h3>
        <p className="text-sm text-slate-400 max-w-md">
          搜索工业检测能力、技术知识、解决方案或能力型号
        </p>
      </div>
    );
  }

  if (type === 'no-results-type' && domain) {
    const label = DOMAIN_LABELS[domain] ?? domain;
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          未找到相关的{label}
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          尝试切换至「全部」查看其他类型的结果，或使用更简短的关键词
        </p>
        <div className="flex gap-3">
          <Link
            href={`/search?q=${encodeURIComponent(keyword ?? '')}&type=all`}
            className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            查看全部结果
          </Link>
        </div>
      </div>
    );
  }

  // no-results (all types)
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-600 mb-2">
        未找到与 &ldquo;{keyword}&rdquo; 相关的内容
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-md">
        建议尝试使用不同的关键词，或浏览以下内容
      </p>
      <div className="flex gap-3">
        <Link
          href="/products"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          浏览能力分类
        </Link>
        <Link
          href="/knowledge"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          查看知识库
        </Link>
        <Link
          href="/solutions"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          查看解决方案
        </Link>
      </div>
    </div>
  );
}