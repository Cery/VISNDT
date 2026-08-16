/**
 * Adapter Contract Interface — M21.7.4 AI Tool Registry & Semantic Adapter Foundation
 *
 * Defines the contract between Tool Registry and Capability Adapters.
 * Adapters are the boundary between Tool Layer and Internal Capabilities.
 * No direct Semantic exposure, no business mutation.
 */

import { AIToolDefinition } from '../../tools/tool-definition.interface';
import { ToolInvocationRequest, ToolInvocationResult } from '../../tools/tool-invocation.interface';

// ============================================
// Adapter Type
// ============================================

export type AdapterType =
  | 'SEMANTIC'     // Semantic search/retrieval
  | 'BUSINESS'     // Business data query
  | 'ANALYTICS'    // Analytics and reporting
  | 'CONTENT'      // Content operations
  | 'UTILITY';     // Utility functions

// ============================================
// Adapter Status
// ============================================

export type AdapterStatus =
  | 'PLANNED'      // Planned for future implementation
  | 'AVAILABLE'    // Ready for use
  | 'UNAVAILABLE'  // Not yet implemented
  | 'DEPRECATED';  // Deprecated

// ============================================
// Adapter Capability
// ============================================

export interface AdapterCapability {
  /** Unique capability identifier */
  id: string;
  /** Human-readable capability name */
  name: string;
  /** Capability description */
  description: string;
  /** Whether this capability modifies business state */
  mutationAllowed: false;
  /** Capability status */
  status: AdapterStatus;
  /** Input schema */
  inputSchema?: Record<string, unknown>;
  /** Output schema */
  outputSchema?: Record<string, unknown>;
}

// ============================================
// Tool Adapter Interface
// ============================================

/**
 * Tool Adapter Interface — contract between Tool Registry and Capability Adapters.
 * All adapters must implement this interface.
 * Adapters are the boundary between Tool Layer and Internal Capabilities.
 */
export interface ToolAdapterInterface {
  /** Adapter type */
  readonly type: AdapterType;

  /** Adapter status */
  readonly status: AdapterStatus;

  /** List capabilities provided by this adapter */
  getCapabilities(): AdapterCapability[];

  /** Check if this adapter can handle a given tool */
  canHandle(tool: AIToolDefinition): boolean;

  /** Execute a tool invocation through this adapter */
  execute(request: ToolInvocationRequest): Promise<ToolInvocationResult>;
}

// ============================================
// Adapter Registry Entry
// ============================================

export interface AdapterRegistryEntry {
  /** Adapter instance */
  adapter: ToolAdapterInterface;
  /** Registered at timestamp */
  registeredAt: string;
  /** Tool IDs mapped to this adapter */
  toolIds: string[];
}