/**
 * Tool Definition Interface — M21.7.3 AI Tool Layer Foundation
 *
 * Defines the Tool contract for the AI Tool Layer.
 * All tools are READ-ONLY and ADVISORY. No business mutation.
 */

// ============================================
// Tool Category
// ============================================

export type ToolCategory =
  | 'SEMANTIC'     // Semantic search, retrieval
  | 'BUSINESS'     // Business data query
  | 'ANALYTICS'    // Analytics and reporting
  | 'CONTENT'      // Content operations
  | 'UTILITY';     // Utility functions

// ============================================
// Tool Status
// ============================================

export type ToolStatus =
  | 'PLANNED'      // Planned for future implementation
  | 'AVAILABLE'    // Ready for use
  | 'DEPRECATED';  // Deprecated, will be removed

// ============================================
// AI Tool Definition
// ============================================

export interface AIToolDefinition {
  /** Unique tool identifier */
  id: string;
  /** Human-readable tool name */
  name: string;
  /** Tool category */
  category: ToolCategory;
  /** Tool description */
  description: string;
  /** Input schema (JSON Schema-like) */
  inputSchema: ToolInputSchema;
  /** Output schema (JSON Schema-like) */
  outputSchema: ToolOutputSchema;
  /** Whether this tool may modify business state */
  mutationAllowed: false;
  /** Tool implementation status */
  status: ToolStatus;
  /** Required permission scope */
  requiredScope: string;
  /** Tags for discovery */
  tags?: string[];
}

// ============================================
// Tool Input Schema
// ============================================

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolSchemaProperty>;
  required?: string[];
}

export interface ToolSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: string[];
  default?: unknown;
}

// ============================================
// Tool Output Schema
// ============================================

export interface ToolOutputSchema {
  type: 'object';
  properties: Record<string, ToolSchemaProperty>;
  description: string;
}

// ============================================
// Tool Registration
// ============================================

export interface ToolRegistration {
  definition: AIToolDefinition;
  registeredAt: string;
  registeredBy: string;
}

// ============================================
// Tool Validation Result
// ============================================

export interface ToolValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================
// Tool Registry Status
// ============================================

export interface ToolRegistryStatus {
  totalTools: number;
  plannedTools: number;
  availableTools: number;
  categories: Record<ToolCategory, number>;
}