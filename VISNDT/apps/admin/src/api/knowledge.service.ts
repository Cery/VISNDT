import { apiClient } from './client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface KnowledgeDomain {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent?: { id: string; name: string; slug: string } | null;
  children?: { id: string; name: string; slug: string }[];
  categories?: KnowledgeCategory[];
  _count?: { categories: number };
}

export interface KnowledgeCategory {
  id: string;
  domainId: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  domain?: { id: string; name: string; slug: string };
}

export type KnowledgeEntryStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type KnowledgeReferenceType = 'SOURCE' | 'RELATED' | 'SUPPLEMENT';
export type KnowledgeRelationType = 'RELATED' | 'CHILD' | 'PARENT' | 'PREREQUISITE' | 'FOLLOWUP';

export interface KnowledgeEntry {
  id: string;
  domainId: string;
  categoryId: string;
  title: string;
  slug: string;
  summary?: string | null;
  structuredBody: any;
  status: KnowledgeEntryStatus;
  authorId: string;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
  domain?: { id: string; name: string; slug: string };
  category?: { id: string; name: string; slug: string };
  author?: { id: string; name: string; email: string };
  contentRefs?: KnowledgeContentRef[];
  sourceRelations?: KnowledgeRelation[];
  targetRelations?: KnowledgeRelation[];
  _count?: { contentRefs: number; sourceRelations: number; targetRelations: number };
}

export interface KnowledgeContentRef {
  id: string;
  knowledgeId: string;
  contentId: string;
  referenceType: KnowledgeReferenceType;
  sortOrder: number;
  createdAt: string;
  content?: { id: string; title: string; slug: string; type: string; status: string };
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: KnowledgeRelationType;
  description?: string | null;
  createdAt: string;
  source?: { id: string; title: string; slug: string; status: string };
  target?: { id: string; title: string; slug: string; status: string };
}

const STATUS_LABEL: Record<KnowledgeEntryStatus, string> = {
  DRAFT: '草稿',
  REVIEW: '审核中',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

const REF_TYPE_LABEL: Record<KnowledgeReferenceType, string> = {
  SOURCE: '来源',
  RELATED: '相关',
  SUPPLEMENT: '补充',
};

const RELATION_TYPE_LABEL: Record<KnowledgeRelationType, string> = {
  RELATED: '相关',
  CHILD: '子级',
  PARENT: '父级',
  PREREQUISITE: '前置',
  FOLLOWUP: '后续',
};

export const knowledgeLabels = {
  status: STATUS_LABEL,
  referenceType: REF_TYPE_LABEL,
  relationType: RELATION_TYPE_LABEL,
};

export const knowledgeService = {
  // ============================================
  // Domains
  // ============================================
  async getDomains(): Promise<KnowledgeDomain[]> {
    const res = (await apiClient.get('/knowledge/domains')) as unknown as ApiResponse<KnowledgeDomain[]>;
    return res.data;
  },

  async getDomain(id: string): Promise<KnowledgeDomain> {
    const res = (await apiClient.get(`/knowledge/domains/${id}`)) as unknown as ApiResponse<KnowledgeDomain>;
    return res.data;
  },

  async createDomain(data: { name: string; slug: string; description?: string; parentId?: string; sortOrder?: number }): Promise<KnowledgeDomain> {
    const res = (await apiClient.post('/knowledge/domains', data)) as unknown as ApiResponse<KnowledgeDomain>;
    return res.data;
  },

  async updateDomain(id: string, data: { name?: string; slug?: string; description?: string; parentId?: string | null; sortOrder?: number }): Promise<KnowledgeDomain> {
    const res = (await apiClient.patch(`/knowledge/domains/${id}`, data)) as unknown as ApiResponse<KnowledgeDomain>;
    return res.data;
  },

  async deleteDomain(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/domains/${id}`);
  },

  // ============================================
  // Categories
  // ============================================
  async getCategories(domainId?: string): Promise<KnowledgeCategory[]> {
    const params = domainId ? { domainId } : {};
    const res = (await apiClient.get('/knowledge/categories', { params })) as unknown as ApiResponse<KnowledgeCategory[]>;
    return res.data;
  },

  async getCategory(id: string): Promise<KnowledgeCategory> {
    const res = (await apiClient.get(`/knowledge/categories/${id}`)) as unknown as ApiResponse<KnowledgeCategory>;
    return res.data;
  },

  async createCategory(data: { domainId: string; name: string; slug: string; description?: string; sortOrder?: number }): Promise<KnowledgeCategory> {
    const res = (await apiClient.post('/knowledge/categories', data)) as unknown as ApiResponse<KnowledgeCategory>;
    return res.data;
  },

  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string; domainId?: string; sortOrder?: number }): Promise<KnowledgeCategory> {
    const res = (await apiClient.patch(`/knowledge/categories/${id}`, data)) as unknown as ApiResponse<KnowledgeCategory>;
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/categories/${id}`);
  },

  // ============================================
  // Entries
  // ============================================
  async getEntries(params?: { domainId?: string; categoryId?: string; status?: string; search?: string }): Promise<KnowledgeEntry[]> {
    const res = (await apiClient.get('/knowledge/entries', { params })) as unknown as ApiResponse<KnowledgeEntry[]>;
    return res.data;
  },

  async getEntry(id: string): Promise<KnowledgeEntry> {
    const res = (await apiClient.get(`/knowledge/entries/${id}`)) as unknown as ApiResponse<KnowledgeEntry>;
    return res.data;
  },

  async createEntry(data: {
    domainId: string;
    categoryId: string;
    title: string;
    slug: string;
    summary?: string;
    structuredBody: any;
    authorId: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }): Promise<KnowledgeEntry> {
    const res = (await apiClient.post('/knowledge/entries', data)) as unknown as ApiResponse<KnowledgeEntry>;
    return res.data;
  },

  async updateEntry(id: string, data: {
    domainId?: string;
    categoryId?: string;
    title?: string;
    slug?: string;
    summary?: string;
    structuredBody?: any;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }): Promise<KnowledgeEntry> {
    const res = (await apiClient.patch(`/knowledge/entries/${id}`, data)) as unknown as ApiResponse<KnowledgeEntry>;
    return res.data;
  },

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/entries/${id}`);
  },

  // ============================================
  // Content Refs
  // ============================================
  async getContentRefs(knowledgeId?: string): Promise<KnowledgeContentRef[]> {
    const params = knowledgeId ? { knowledgeId } : {};
    const res = (await apiClient.get('/knowledge/content-refs', { params })) as unknown as ApiResponse<KnowledgeContentRef[]>;
    return res.data;
  },

  async createContentRef(data: { knowledgeId: string; contentId: string; referenceType?: string; sortOrder?: number }): Promise<KnowledgeContentRef> {
    const res = (await apiClient.post('/knowledge/content-refs', data)) as unknown as ApiResponse<KnowledgeContentRef>;
    return res.data;
  },

  async updateContentRef(id: string, data: { referenceType?: string; sortOrder?: number }): Promise<KnowledgeContentRef> {
    const res = (await apiClient.patch(`/knowledge/content-refs/${id}`, data)) as unknown as ApiResponse<KnowledgeContentRef>;
    return res.data;
  },

  async deleteContentRef(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/content-refs/${id}`);
  },

  // ============================================
  // Relations
  // ============================================
  async getRelations(knowledgeId?: string): Promise<KnowledgeRelation[]> {
    const params = knowledgeId ? { knowledgeId } : {};
    const res = (await apiClient.get('/knowledge/relations', { params })) as unknown as ApiResponse<KnowledgeRelation[]>;
    return res.data;
  },

  async createRelation(data: { sourceId: string; targetId: string; relationType: string; description?: string }): Promise<KnowledgeRelation> {
    const res = (await apiClient.post('/knowledge/relations', data)) as unknown as ApiResponse<KnowledgeRelation>;
    return res.data;
  },

  async deleteRelation(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/relations/${id}`);
  },
};