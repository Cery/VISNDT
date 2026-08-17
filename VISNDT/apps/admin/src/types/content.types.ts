export type ContentType = 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';
export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ContentMediaType = 'IMAGE' | 'ATTACHMENT';
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

export interface ContentTagRelation {
  tag: ContentTag;
}

export interface ContentMediaFileAsset {
  id: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
}

export interface ContentMedia {
  id: string;
  contentId: string;
  fileAssetId?: string | null;
  type: ContentMediaType;
  caption?: string | null;
  altText?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  fileAsset?: ContentMediaFileAsset | null;
}

export interface CreateContentMediaDto {
  fileAssetId?: string;
  type: ContentMediaType;
  caption?: string;
  altText?: string;
  sortOrder?: number;
}

export interface UpdateContentMediaDto {
  type?: ContentMediaType;
  caption?: string;
  altText?: string;
  sortOrder?: number;
}

export interface ContentAuthor {
  id: string;
  email: string;
  name?: string | null;
}

export interface ContentCoverImage {
  id: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  coverImageId?: string | null;
  status: ContentStatus;
  authorId: string;
  publishedAt?: string | null;
  archivedAt?: string | null;
  scheduledPublishAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  estimatedReadTime?: number | null;
  createdAt: string;
  updatedAt: string;
  author?: ContentAuthor;
  coverImage?: ContentCoverImage | null;
  media?: ContentMedia[];
  tags?: ContentTagRelation[];
}

export interface ContentListResponse {
  data: Content[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryContentParams {
  type?: ContentType;
  status?: ContentStatus;
  keyword?: string;
  tag?: string;
  sort?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CreateContentDto {
  type: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImageId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface UpdateContentDto {
  type?: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  coverImageId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  scheduledPublishAt?: string | null;
}

export interface ContentFormData {
  type: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImageId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface ContentRevisionSummary {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

export interface ContentRevisionDetail extends ContentRevisionSummary {
  title: string;
  summary?: string | null;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  coverImageId?: string | null;
  snapshot?: Record<string, unknown> | null;
}

export type ContentWorkflowAction =
  | 'CREATED'
  | 'SUBMITTED'
  | 'OPENED'
  | 'REVIEWED'
  | 'CLOSED';

export interface ContentApprovalTimelineItem {
  id: string;
  action: ContentWorkflowAction;
  operator?: { id: string; name?: string | null } | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}