/**
 * Offer Service Layer
 *
 * Encapsulates Offer API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/offers.ts.
 */
import {
  getOffers as fetchOffers,
  getOffer as fetchOffer,
  createOffer as postOffer,
  updateOffer as patchOffer,
  submitOffer as postSubmit,
  withdrawOffer as postWithdraw,
} from '@/lib/api/offers';
import type { CreateOfferPayload, UpdateOfferPayload } from '@/lib/api/offers';
import type { PaginatedResponse } from '@/types/api';
import type { Offer } from '@/types/product';

export interface OffersSearchParams {
  organizationId?: string;
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/**
 * List offers with optional filtering.
 * GET /offers
 */
export async function getOffers(
  params: OffersSearchParams = {},
): Promise<PaginatedResponse<Offer>> {
  return fetchOffers(params);
}

/**
 * Get a single offer by ID.
 * GET /offers/:id
 */
export async function getOffer(id: string): Promise<Offer> {
  return fetchOffer(id);
}

/**
 * Create a new offer (DRAFT).
 * POST /offers
 */
export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  return postOffer(payload);
}

/**
 * Update an existing offer (DRAFT only).
 * PATCH /offers/:id
 */
export async function updateOffer(id: string, payload: UpdateOfferPayload): Promise<Offer> {
  return patchOffer(id, payload);
}

/**
 * Submit an offer (DRAFT → SUBMITTED).
 * POST /offers/:id/submit
 */
export async function submitOffer(id: string): Promise<Offer> {
  return postSubmit(id);
}

/**
 * Withdraw an offer (SUBMITTED → WITHDRAWN).
 * POST /offers/:id/withdraw
 */
export async function withdrawOffer(id: string): Promise<Offer> {
  return postWithdraw(id);
}