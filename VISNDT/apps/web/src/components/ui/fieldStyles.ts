/**
 * VISNDT Web UI — Shared Field Visual & State Semantics.
 * 统一 Label / Control / Helper / Error 的视觉与可访问性语义（对接 WP-2 §12 Form Contract）。
 * 全部复用 Tailwind 既有 CSS 变量（--primary / --ring / --destructive / --input …），
 * 不引入页面级 ad-hoc 颜色。
 */
export const inputBase = [
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
].join(' ');

/** 可见 Label（Form Contract：Label 必须与 Control 存在明确关联 —— 由 FieldShell 的 htmlFor/id 保证） */
export const labelText = 'mb-1.5 block text-sm font-medium text-foreground';

export const requiredMark = 'text-destructive';

export const helperText = 'mt-1 text-xs text-muted-foreground';

export const errorText = 'mt-1 flex items-center gap-1 text-xs text-destructive';

/* ============================================================
 * 同源基本形状：所有 Form Primitive 的交互状态语义一致
 * ============================================================ */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background';