import { API_BASE_URL } from '@/lib/constants';
import UiIcon from '@/lib/ui-icon';
import { BusinessIdentityBadge } from '@visndt/design-system';
import type { ContentMedia } from '@/types/content';

/**
 * Build the public download URL for a FileAsset.
 * GET /files/:id/download redirects to a signed URL once the owning Content is PUBLISHED.
 */
function fileUrl(fileAssetId?: string): string | null {
  if (!fileAssetId) return null;
  return `${API_BASE_URL}/files/${fileAssetId}/download`;
}

/** 由 MIME 推导简写标签（Public Metadata Display） */
function mimeTag(mimeType?: string): string {
  if (!mimeType) return '文件';
  if (mimeType.startsWith('image/')) return '图片';
  if (mimeType === 'application/pdf') return 'PDF';
  return mimeType.split('/')[1]?.toUpperCase() ?? '文件';
}

/**
 * Public media gallery for a content.
 * IMAGE media renders as a responsive image grid；ATTACHMENT media renders as download links。
 * 统一媒体元信息展示：Asset Business Identity + MIME 标签（复用 641 BusinessIdentityBadge，纯展示）。
 */
export default function MediaGallery({ media }: { media?: ContentMedia[] }) {
  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.type === 'IMAGE');
  const attachments = media.filter((m) => m.type === 'ATTACHMENT');

  return (
    <div className="mt-10">
      {images.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">媒体画廊</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((m) => {
              const src = fileUrl(m.fileAsset?.id);
              if (!src) return null;
              return (
                <figure key={m.id} className="overflow-hidden rounded-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={m.altText || m.caption || '内容配图'}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <figcaption className="px-3 py-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-500 truncate">
                      {m.caption || m.fileAsset?.fileName || '内容配图'}
                    </span>
                    {m.fileAsset?.id && (
                      <span className="shrink-0">
                        <BusinessIdentityBadge type="ASSET" id={m.fileAsset.id} variant="compact" />
                      </span>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {attachments.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">附件</h2>
          <ul className="space-y-2">
            {attachments.map((m) => {
              const href = fileUrl(m.fileAsset?.id);
              if (!href) return null;
              return (
                <li key={m.id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <span><UiIcon name="attachment" size={16} color="#2563eb" /></span>
                    {m.caption || m.fileAsset?.fileName || '附件'}
                  </a>
                  <div className="ml-6 mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 bg-slate-100">
                      {mimeTag(m.fileAsset?.mimeType)}
                    </span>
                    {m.fileAsset?.id && (
                      <span className="inline-flex items-center">
                        <BusinessIdentityBadge type="ASSET" id={m.fileAsset.id} variant="compact" />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}