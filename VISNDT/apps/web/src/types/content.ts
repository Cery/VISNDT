/**
 * Content types for the public web.
 * Mirrors the backend Content model (PUBLISHED subset exposed to public).
 */

export type ContentType = 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentAuthor {
  id: string;
  email: string;
  name?: string | null;
}

export type ContentMediaType = 'IMAGE' | 'ATTACHMENT';

export interface ContentMediaFileAsset {
  id: string;
  fileName: string;
  mimeType: string;
}

/** 封面图片（FileAsset 公开投影，无 storageKey） */
export interface ContentCoverImage {
  id: string;
  fileName: string;
  mimeType: string;
}

export interface ContentMedia {
  id: string;
  type: ContentMediaType;
  caption?: string | null;
  altText?: string | null;
  sortOrder: number;
  fileAsset?: ContentMediaFileAsset | null;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  status: ContentStatus;
  authorId: string;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  estimatedReadTime?: number | null;
  createdAt: string;
  updatedAt: string;
  author?: ContentAuthor;
  coverImage?: ContentCoverImage | null;
  media?: ContentMedia[];
  tags?: { tag: ContentTag }[];
}

export interface ContentListParams {
  type?: ContentType;
  keyword?: string;
  tag?: string;
  sort?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export type ContentTagType = 'TOPIC' | 'INDUSTRY' | 'APPLICATION' | 'TECHNOLOGY';

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  type: ContentTagType;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}