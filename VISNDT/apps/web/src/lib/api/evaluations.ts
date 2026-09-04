import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Buyer Evaluation API layer — M34.6 BuyerEvaluation persistence (M34.7 consumption).
 *
 * Consumes ONLY the six existing M34.6 evaluation endpoints. No new server-side
 * state filter is added here: filtering happens on the client per 771 C1.
 */

/** EvaluationState — frozen DB enum (NOT_EVALUATED is UI-derived only). */
export type EvaluationState =
  | 'INTERESTED'
  | 'SHORTLISTED'
  | 'COMPARING'
  | 'CONTACTED';

/** EvaluationTargetType — frozen DB enum. */
export type EvaluationTargetType = 'PRODUCT' | 'SUPPLIER_PRODUCT';

/** Evaluation list/row item returned by GET /evaluations. */
export interface BuyerEvaluation {
  id: string;
  targetType: EvaluationTargetType;
  targetId: string;
  state: EvaluationState;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/** PATCH /evaluations/:id body (state / note transition). */
export interface UpdateEvaluationParams {
  state?: EvaluationState;
  note?: string;
}

/**
 * Connection context resolved by GET /evaluations/:id/connection.
 * Same shape consumed by the existing Inquiry flow — no second connection domain.
 */
export interface EvaluationConnectionContext {
  evaluationId: string;
  targetType: EvaluationTargetType;
  productId?: string;
  productName?: string;
  organizationId?: string | null;
  supplierProductId?: string | null;
  supplierModelLabel?: string;
  offerId?: string | null;
}

/**
 * List my (Buyer) evaluations — CLIENT-side state filtering, no server filter.
 * GET /evaluations?page=&pageSize=
 */
export async function getMyEvaluations(
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<BuyerEvaluation>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<BuyerEvaluation>>>(
    '/evaluations',
    { params: { page, pageSize } },
  );
  return res.data;
}

/**
 * Update evaluation state/note (owner-only).
 * PATCH /evaluations/:id
 */
export async function updateEvaluation(
  id: string,
  params: UpdateEvaluationParams,
): Promise<BuyerEvaluation> {
  const res = await apiClient<ApiResponse<BuyerEvaluation>>(`/evaluations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Delete an evaluation (owner-only) — reverts to UI-derived NOT_EVALUATED.
 * DELETE /evaluations/:id
 */
export async function deleteEvaluation(
  id: string,
): Promise<{ deleted: boolean; id: string }> {
  const res = await apiClient<ApiResponse<{ deleted: boolean; id: string }>>(
    `/evaluations/${id}`,
    { method: 'DELETE' },
  );
  return res.data;
}

/**
 * Resolve Connection context for the existing Inquiry flow.
 * GET /evaluations/:id/connection
 */
export async function getEvaluationConnectionContext(
  id: string,
): Promise<EvaluationConnectionContext> {
  const res = await apiClient<ApiResponse<EvaluationConnectionContext>>(
    `/evaluations/${id}/connection`,
  );
  return res.data;
}