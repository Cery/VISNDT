'use client';

import { useRef, useState } from 'react';
import type {
  MySupplierProductMedia,
} from '@/lib/api/supplier-self-service';
import {
  uploadMySupplierProductMedia,
  updateMySupplierProductMedia,
  deleteMySupplierProductMedia,
} from '@/lib/api/supplier-self-service';
import { fileAssetUrl } from '@/lib/media';

/**
 * WP-5A — Media Write (R1) for an OWN SupplierProduct.
 *
 * Full media self-service loop: Upload → Reload-reflect-as-persisted → preview →
 * set primary → reorder (displayOrder) → delete (confirm → API → persistence).
 * Only rendered in DRAFT / APPROVED (the server enforces this too).
 *
 * Ordering contract: the persisted displayOrder drives UI order; primary is
 * demoted server-side. Every mutation calls the API and then returns the fresh
 * media list via onReload (never frontend-only state).
 */

const inputClass =
  'w-full min-h-11 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-slate-500 focus:outline-none';
const btnBase =
  'inline-flex min-h-12 sm:min-h-11 items-center justify-center gap-1 rounded-md px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

function orderMedia(list: MySupplierProductMedia[]): MySupplierProductMedia[] {
  return [...list].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}

export default function SupplierModelMediaEditor({
  supplierProductId,
  media = [],
  editable = false,
  onReload,
}: {
  supplierProductId: string;
  media?: MySupplierProductMedia[] | null;
  editable: boolean;
  onReload: () => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [notify, setNotify] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const ordered = orderMedia(media ?? []);

  const flash = (tone: 'ok' | 'err', text: string) => setNotify({ tone, text });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setNotify(null);
    try {
      await uploadMySupplierProductMedia(supplierProductId, file, {});
      flash('ok', '媒体已上传并持久化。');
      await onReload();
    } catch (err) {
      flash('err', err instanceof Error ? err.message : '上传失败，请稍后重试。');
    } finally {
      setBusy(false);
    }
  };

  const setTitleAlt = async (m: MySupplierProductMedia, patch: { title?: string; altText?: string }) => {
    setBusy(true);
    setNotify(null);
    try {
      await updateMySupplierProductMedia(supplierProductId, m.id, patch);
      flash('ok', '媒体信息已保存。');
      await onReload();
    } catch (err) {
      flash('err', err instanceof Error ? err.message : '保存失败。');
    } finally {
      setBusy(false);
    }
  };

  const setPrimary = async (m: MySupplierProductMedia) => {
    setBusy(true);
    setNotify(null);
    try {
      await updateMySupplierProductMedia(supplierProductId, m.id, { isPrimary: true });
      flash('ok', '已设为主媒体（其余主媒体已自动降级）。');
      await onReload();
    } catch (err) {
      flash('err', err instanceof Error ? err.message : '设置主媒体失败。');
    } finally {
      setBusy(false);
    }
  };

  const moveOrder = async (m: MySupplierProductMedia, dir: -1 | 1) => {
    const idx = ordered.findIndex((x) => x.id === m.id);
    const target = ordered[idx + dir];
    if (!target) return;
    setBusy(true);
    setNotify(null);
    try {
      // Swap displayOrder with the adjacent media for a stable persisted ordering.
      const tmp = target.displayOrder ?? 0;
      await updateMySupplierProductMedia(supplierProductId, target.id, { displayOrder: m.displayOrder ?? 0 });
      await updateMySupplierProductMedia(supplierProductId, m.id, { displayOrder: tmp });
      flash('ok', '媒体顺序已保存。');
      await onReload();
    } catch (err) {
      flash('err', err instanceof Error ? err.message : '重排失败。');
    } finally {
      setBusy(false);
    }
  };

  const confirmAndDelete = async (m: MySupplierProductMedia) => {
    setBusy(true);
    setNotify(null);
    try {
      await deleteMySupplierProductMedia(supplierProductId, m.id);
      setConfirmDelete(null);
      flash('ok', '媒体已删除。');
      await onReload();
    } catch (err) {
      flash('err', err instanceof Error ? err.message : '删除失败。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="media-editor-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="media-editor-heading" className="text-base font-semibold text-slate-900">型号媒体</h2>
          <p className="mt-1 text-xs text-slate-500">
            已持久化的媒体（图片 / 规格书等）。顺序以保存的 displayOrder 为主媒体为准。
            {editable ? ' 可在 DRAFT / APPROVED 状态下上传、设主图、重排与删除。' : ' 当前状态不可编辑（须先回到 DRAFT / APPROVED）。'}
          </p>
        </div>
        {editable && (
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handleUpload(e)} aria-label="上传媒体文件" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={`${btnBase} bg-slate-900 text-white hover:bg-slate-700`}>
              {busy ? '处理中…' : '+ 上传媒体'}
            </button>
          </div>
        )}
      </div>

      {notify && (
        <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${notify.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {notify.text}
        </div>
      )}

      <div className="mt-4">
        {ordered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
            {editable ? '该型号暂无媒体。点击「上传媒体」添加。' : '该型号暂无媒体。'}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="型号媒体列表">
            {ordered.map((m) => {
              const url = m.fileAssetId ? fileAssetUrl(m.fileAssetId) : null;
              return (
                <li key={m.id} className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-36 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={m.altText || m.title || '型号媒体'} className="h-full w-full object-contain" />
                    ) : (
                      <span className="px-3 text-center text-xs text-slate-400">（暂无可预览文件）</span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">{m.mediaType ?? 'MEDIA'}</span>
                    {m.isPrimary && <span className="rounded-md border border-primary/30 px-1.5 py-0.5 text-[10px] font-medium text-primary">主媒体</span>}
                  </div>

                  {editable ? (
                    <div className="mt-2 space-y-1.5">
                      <input
                        defaultValue={m.title ?? ''}
                        onBlur={(e) => { if (e.target.value.trim() !== (m.title ?? '')) void setTitleAlt(m, { title: e.target.value.trim() || undefined }); }}
                        placeholder="标题"
                        aria-label="媒体标题"
                        className={inputClass}
                      />
                      <input
                        defaultValue={m.altText ?? ''}
                        onBlur={(e) => { if (e.target.value.trim() !== (m.altText ?? '')) void setTitleAlt(m, { altText: e.target.value.trim() || undefined }); }}
                        placeholder="Alt 文本（无障碍）"
                        aria-label="Alt 文本"
                        className={inputClass}
                      />
                      <div className="flex flex-wrap items-center gap-1.5">
                        {!m.isPrimary && (
                          <button type="button" onClick={() => void setPrimary(m)} disabled={busy} className={`${btnBase} border border-slate-300 text-slate-700 hover:bg-slate-100`}>
                            设为主图
                          </button>
                        )}
                        <button type="button" onClick={() => void moveOrder(m, -1)} disabled={busy || ordered.findIndex((x) => x.id === m.id) === 0} className={`${btnBase} border border-slate-300 text-slate-600 hover:bg-slate-100`} aria-label="上移">
                          ↑
                        </button>
                        <button type="button" onClick={() => void moveOrder(m, 1)} disabled={busy || ordered.findIndex((x) => x.id === m.id) === ordered.length - 1} className={`${btnBase} border border-slate-300 text-slate-600 hover:bg-slate-100`} aria-label="下移">
                          ↓
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(m.id)} disabled={busy} className={`${btnBase} ml-auto border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100`}>
                          删除
                        </button>
                      </div>
                      {confirmDelete === m.id && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                          <p>确认删除该媒体？（将同时清理已持久化的文件，不可撤销）</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button type="button" onClick={() => void confirmAndDelete(m)} disabled={busy} className="inline-flex min-h-11 items-center rounded-md bg-rose-600 px-3 text-xs font-medium text-white hover:bg-rose-500">确认删除</button>
                            <button type="button" onClick={() => setConfirmDelete(null)} className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-3 text-xs text-slate-600">取消</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {m.title && <p className="mt-1.5 text-sm font-medium text-slate-700">{m.title}</p>}
                      {m.altText && <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{m.altText}</p>}
                      <p className="mt-1 text-[11px] text-slate-400">顺序 {m.displayOrder ?? 0}</p>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}