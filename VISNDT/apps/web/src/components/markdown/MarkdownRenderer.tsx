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
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate prose-headings:font-bold max-w-none text-slate-700 leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}