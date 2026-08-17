/**
 * Knowledge Base types for the public web.
 * Mirrors the backend KnowledgeEntry/KRContentRef/KRRelation models.
 */

export type KnowledgeEntryStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type KnowledgeReferenceType = 'SOURCE' | 'RELATED' | 'SUPPLEMENT';
export type KnowledgeRelationType = 'RELATED' | 'CHILD' | 'PARENT' | 'PREREQUISITE' | 'FOLLOWUP';

export interface KnowledgeDomain {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  _count?: { categories: number; knowledgeEntries: number };
}

export interface KnowledgeDomainDetail extends KnowledgeDomain {
  categories: (KnowledgeCategory & { _count?: { entries: number } })[];
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  domain?: { id: string; name: string; slug: string };
  _count?: { entries: number };
}

export interface KnowledgeEntryAuthor {
  id: string;
  name?: string | null;
}

export interface KnowledgeEntryListItem {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  status: KnowledgeEntryStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  domain?: { id: string; name: string; slug: string };
  category?: { id: string; name: string; slug: string };
  author?: KnowledgeEntryAuthor;
  _count?: { contentRefs: number };
}

export interface KnowledgeContentRef {
  id: string;
  knowledgeId: string;
  contentId: string;
  referenceType: KnowledgeReferenceType;
  sortOrder: number;
  content: {
    id: string;
    title: string;
    slug: string;
    type: string;
    summary?: string | null;
    coverImage?: { id: string; fileName: string } | null;
  };
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: KnowledgeRelationType;
  description?: string | null;
  source?: { id: string; title: string; slug: string; summary?: string | null };
  target?: { id: string; title: string; slug: string; summary?: string | null };
}

export interface KnowledgeEntryDetail extends KnowledgeEntryListItem {
  structuredBody: Record<string, unknown>;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  contentRefs: KnowledgeContentRef[];
  sourceRelations: KnowledgeRelation[];
  targetRelations: KnowledgeRelation[];
}

export interface KnowledgeEntriesResult {
  data: KnowledgeEntryListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}