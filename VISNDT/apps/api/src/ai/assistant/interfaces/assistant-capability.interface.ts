/**
 * Assistant Capability Interface — M21.7.5 AI Assistant Foundation
 *
 * Defines the capability registry for AI Assistant.
 * All capabilities are PLANNED. No execution, no mutation.
 */

// ============================================
// Assistant Capability
// ============================================

export interface AssistantCapability {
  /** Unique capability ID */
  id: string;
  /** Human-readable capability name */
  name: string;
  /** Capability category */
  category: AssistantCapabilityCategory;
  /** Capability description */
  description: string;
  /** Whether this capability modifies business state */
  mutationAllowed: false;
  /** Whether human review is required */
  requiresHumanReview: true;
  /** Capability status */
  status: AssistantCapabilityStatus;
  /** Input schema */
  inputSchema?: Record<string, unknown>;
  /** Output schema */
  outputSchema?: Record<string, unknown>;
  /** Tags for discovery */
  tags?: string[];
}

export type AssistantCapabilityCategory =
  | 'BUSINESS_INSIGHT'   // Business insight and analysis
  | 'PRODUCT_ANALYSIS'   // Product analysis
  | 'RFQ_ANALYSIS'       // RFQ analysis
  | 'ADMIN_OPERATION';   // Admin operation assistance

export type AssistantCapabilityStatus =
  | 'PLANNED'      // Planned for future implementation
  | 'AVAILABLE'    // Ready for use
  | 'DEPRECATED';  // Deprecated

// ============================================
// Assistant Capability Registry
// ============================================

export interface AssistantCapabilityRegistry {
  /** All registered capabilities */
  capabilities: Map<string, AssistantCapability>;
  /** Register a new capability */
  register(capability: AssistantCapability): void;
  /** Get a capability by ID */
  get(id: string): AssistantCapability | undefined;
  /** List all capabilities */
  list(): AssistantCapability[];
  /** Get capability registry status */
  getStatus(): AssistantCapabilityRegistryStatus;
}

export interface AssistantCapabilityRegistryStatus {
  total: number;
  planned: number;
  available: number;
  categories: Record<AssistantCapabilityCategory, number>;
}