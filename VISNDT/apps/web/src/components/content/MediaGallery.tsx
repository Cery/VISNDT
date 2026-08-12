import { API_BASE_URL } from '@/lib/constants';
import type { ContentMedia } from '@/types/content';

/**
 * Build the public download URL for a FileAsset.
 * GET /files/:id/download redirects to a signed URL once the owning Content is PUBLISHED.
 */
function fileUrl(fileAssetId?: string): string | null {
  if (!fileAssetId) return null;
  return `${API_BASE_URL}/files/${fileAssetId}/download`;
}

/**
 * Public media gallery for a content.
 * Renders IMAGE media as a responsive image grid and ATTACHMENT media as download links.
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
                  {m.caption && (
                    <figcaption className="px-3 py-2 text-sm text-slate-500">
                      {m.caption}
                    </figcaption>
                  )}
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
                    <span>📎</span>
                    {m.caption || m.fileAsset?.fileName || '附件'}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}