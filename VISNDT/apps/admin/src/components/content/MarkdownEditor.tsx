import { useState } from 'react';
import { Segmented } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

/**
 * Markdown 编辑器 + 预览面板（集成 Ant Design Form.Item）。
 *
 * 安全约束：
 * - react-markdown 默认不执行原始 HTML（作为字符展示），不渲染 script/iframe。
 * - 支持基础 Markdown：标题、列表、表格、引用、图片引用语法、链接（GFM）。
 */
export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = '请输入内容正文（支持 Markdown 语法）',
  rows = 10,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
      <div
        style={{
          padding: '4px 8px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa',
        }}
      >
        <Segmented
          size="small"
          value={mode}
          onChange={(v) => setMode(v as 'edit' | 'preview')}
          options={[
            { label: '编辑', value: 'edit' },
            { label: '预览', value: 'preview' },
          ]}
        />
      </div>

      {mode === 'edit' ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            padding: 12,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          className="markdown-preview"
          style={{ padding: 12, minHeight: rows * 24, overflow: 'auto' }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '*暂无内容*'}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}