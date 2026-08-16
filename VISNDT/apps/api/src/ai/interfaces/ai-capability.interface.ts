/**
 * AI Capability Boundary Interface — M21.7.1 AI Gateway Foundation
 *
 * Defines the AI capability boundary contract.
 * AI outputs are ADVISORY only. Human confirmation is required for business actions.
 */

// ============================================
// AI Capability Category
// ============================================

export type AICapabilityCategory =
  | 'SEARCH'       // Semantic search, content discovery
  | 'ANALYSIS'     // Data analysis, trends, insights
  | 'RECOMMEND'    // Product/content recommendations
  | 'ASSIST'       // Administrative assistance, summaries
  | 'AUDIT'        // Audit intelligence, risk analysis
  | 'MONITOR';     // System monitoring, anomaly detection

// ============================================
// AI Capability Status
// ============================================

export type AICapabilityStatus =
  | 'AVAILABLE'    // Ready for use
  | 'PLANNED'      // Planned for future implementation
  | 'DEFERRED';     // Deferred to later stage

// ============================================
// AI Capability Definition
// ============================================

export interface AICapability {
  id: string;
  category: AICapabilityCategory;
  label: string;
  description: string;
  status: AICapabilityStatus;
  /** Whether this capability may modify business state */
  mutationAllowed: boolean;
  /** Required permission scope */
  requiredScope: string;
}

// ============================================
// AI Boundary Rules
// ============================================

export interface AIBoundaryRule {
  id: string;
  rule: string;
  description: string;
  scope: 'GLOBAL' | 'CAPABILITY' | 'DATA';
}

// ============================================
// AI Gateway Status
// ============================================

export interface AIGatewayStatus {
  status: 'READY' | 'DEGRADED' | 'UNAVAILABLE';
  foundations: {
    semantic: boolean;
    embedding: boolean;
    analytics: boolean;
    audit: boolean;
    monitoring: boolean;
  };
  boundaries: {
    semanticLayerProtected: boolean;
    noAutonomousDecision: boolean;
    noBusinessMutation: boolean;
    humanInLoop: boolean;
  };
  availableCapabilities: number;
  plannedCapabilities: number;
}

// ============================================
// AI Request Context (audit placeholder)
// ============================================

export interface AIRequestContext {
  /** AI capability being requested */
  capability: string;
  /** Request timestamp */
  timestamp: string;
  /** Requester ID (from JWT) */
  requesterId: string;
  /** Request status */
  status: 'RECEIVED' | 'VALIDATED' | 'REJECTED' | 'FORWARDED';
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// AI Capability Boundary Rules
// ============================================

export const AI_CAPABILITY_BOUNDARIES: AIBoundaryRule[] = [
  {
    id: 'BOUNDARY-001',
    rule: 'No Autonomous AI Decision',
    description: 'AI outputs are advisory only. Human confirmation is required for all business actions.',
    scope: 'GLOBAL',
  },
  {
    id: 'BOUNDARY-002',
    rule: 'Semantic Layer Protection',
    description: 'Semantic Layer is an Internal Capability. AI Gateway must not expose RetrievalService, RankingService, or UnifiedSearchService directly.',
    scope: 'CAPABILITY',
  },
  {
    id: 'BOUNDARY-003',
    rule: 'No Business Mutation',
    description: 'AI must not modify Product, Content, Demand, RFQ, Offer, or Matching state.',
    scope: 'DATA',
  },
  {
    id: 'BOUNDARY-004',
    rule: 'Human-in-the-Loop',
    description: 'AI suggestions must pass through human review before any system action.',
    scope: 'GLOBAL',
  },
  {
    id: 'BOUNDARY-005',
    rule: 'Audit Trail Required',
    description: 'All AI requests must be auditable with requester, capability, timestamp, and status.',
    scope: 'GLOBAL',
  },
];