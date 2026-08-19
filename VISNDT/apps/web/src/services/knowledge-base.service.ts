/**
 * Knowledge Base Service Layer
 *
 * Encapsulates public Knowledge Base API calls for page-level consumption.
 */
import {
  getPublicDomains as fetchDomains,
  getPublicDomainBySlug as fetchDomainBySlug,
  getPublicCategories as fetchCategories,
  getPublicEntries as fetchEntries,
  getPublicEntryBySlug as fetchEntryBySlug,
  getEntryRelatedProducts as fetchEntryRelatedProducts,
} from '@/lib/api/knowledge-base';
import type {
  KnowledgeDomain,
  KnowledgeDomainDetail,
  KnowledgeCategory,
  KnowledgeEntryDetail,
  KnowledgeEntriesResult,
  RelatedProductItem,
} from '@/types/knowledge-base';

export async function getDomains(): Promise<KnowledgeDomain[]> {
  return fetchDomains();
}

export async function getDomainBySlug(slug: string): Promise<KnowledgeDomainDetail> {
  return fetchDomainBySlug(slug);
}

export async function getCategories(domainId?: string): Promise<KnowledgeCategory[]> {
  return fetchCategories(domainId);
}

export async function getEntries(params: {
  domainId?: string;
  categoryId?: string;
  domainSlug?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<KnowledgeEntriesResult> {
  return fetchEntries(params);
}

export async function getEntryBySlug(slug: string): Promise<KnowledgeEntryDetail> {
  return fetchEntryBySlug(slug);
}

export async function getEntryRelatedProducts(slug: string): Promise<RelatedProductItem[]> {
  return fetchEntryRelatedProducts(slug);
}