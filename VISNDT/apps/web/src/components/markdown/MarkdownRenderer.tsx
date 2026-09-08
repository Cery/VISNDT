import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

/** 允许的链接协议白名单 */
const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  // 相对路径（站内链接）允许
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return SAFE_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Web 端 Markdown 安全渲染组件（服务端渲染）。
 *
 * 安全约束（XSS 防护）：
 * - skipHtml：原始 HTML（含 <script> / <style> / <iframe>）一律不渲染，仅作为字符展示/忽略。
 * - 链接 href / 图片 src 仅允许 http/https/mailto/tel 及站内相对路径，拦截 javascript: 等危险协议。
 *
 * 支持 GFM（标题、列表、表格、引用、图片引用语法、链接）。
 */
const components: Components = {
  // 835 Accessibility：单 H1 语义。文档正文的 markdown `#` 改按 h2 渲染，
  // 避免与页面级 h1（Title）冲突形成重复 h1；章节层级从 h2 起（页面标题为唯一 h1）。
  h1: (props) => <h2 {...(props as React.ComponentProps<'h2'>)} />,
  a: (props) => {
    const { href, children, ...rest } = props;
    return isSafeUrl(href || '') ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    ) : (
      <span {...rest}>{children}</span>
    );
  },
  img: (props) => {
    const { src, alt, ...rest } = props;
    return isSafeUrl(src || '') ? <img src={src} alt={alt || ''} {...rest} /> : null;
  },
  // 846 §47 Knowledge Tables — 移动端 overflow-x:auto，不强行压缩成不可读小字。
  // 表格宽度不受限于阅读栏容器，超出时在容器内横向滚动。
  table: (props) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full text-sm" {...(props as React.ComponentProps<'table'>)} />
    </div>
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate prose-headings:font-bold max-w-none text-slate-700">
      <div className="text-[16px] leading-[1.8] [&_p]:my-4 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-1 [&_blockquote]:my-5">
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}