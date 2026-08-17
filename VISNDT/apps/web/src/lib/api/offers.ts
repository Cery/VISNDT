import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Offer } from '@/types/product';

export interface OffersSearchParams {
  organizationId?: string;
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateOfferPayload {
  productId: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
}

export interface UpdateOfferPayload {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
}

/**
 * List offers with optional filtering.
 * GET /offers
 */
export async function getOffers(
  params: OffersSearchParams = {},
): Promise<PaginatedResponse<Offer>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<Offer>>>(
    '/offers',
    { params: params as Record<string, string | number | undefined> },
  );
  return res.data;
}

/**
 * Get a single offer by ID.
 * GET /offers/:id
 */
export async function getOffer(id: string): Promise<Offer> {
  const res = await apiClient<ApiResponse<Offer>>(`/offers/${id}`);
  return res.data;
}

/**
 * Create a new offer (DRAFT).
 * POST /offers
 */
export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  const res = await apiClient<ApiResponse<Offer>>('/offers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Update an existing offer (DRAFT only).
 * PATCH /offers/:id
 */
export async function updateOffer(id: string, payload: UpdateOfferPayload): Promise<Offer> {
  const res = await apiClient<ApiResponse<Offer>>(`/offers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Submit an offer (DRAFT → SUBMITTED).
 * POST /offers/:id/submit
 */
export async function submitOffer(id: string): Promise<Offer> {
  const res = await apiClient<ApiResponse<Offer>>(`/offers/${id}/submit`, {
    method: 'POST',
  });
  return res.data;
}

/**
 * Withdraw an offer (SUBMITTED → WITHDRAWN).
 * POST /offers/:id/withdraw
 */
export async function withdrawOffer(id: string): Promise<Offer> {
  const res = await apiClient<ApiResponse<Offer>>(`/offers/${id}/withdraw`, {
    method: 'POST',
  });
  return res.data;
}