import { Injectable, Logger } from '@nestjs/common';
import {
  AIToolDefinition,
  ToolCategory,
  ToolRegistration,
  ToolValidationResult,
  ToolRegistryStatus,
} from './tool-definition.interface';
import {
  ToolInvocationRequest,
  ToolInvocationResult,
  ToolInvocationOutput,
} from './tool-invocation.interface';
import {
  ToolAdapterInterface,
  AdapterType,
  AdapterRegistryEntry,
} from '../adapter/interfaces/adapter-contract.interface';

/**
 * Tool Registry Service — M21.7.3 Tool Layer + M21.7.4 Adapter Enhancement
 *
 * Central registry for AI Tool definitions and Adapter mappings.
 * Registers, queries, and validates tools. Does NOT execute them.
 * Maps tools to capability adapters for controlled invocation.
 *
 * Rules:
 * 1. All tools have mutationAllowed=false (read-only, advisory).
 * 2. Tool Registry only describes and validates — never executes.
 * 3. All PLANNED tools return DEFERRED status.
 * 4. Tool invocation always requires human review.
 * 5. Adapters are the boundary to Internal Capabilities.
 */

@Injectable()
export class ToolRegistryService {
  private readonly logger = new Logger(ToolRegistryService.name);

  /** Registered tools indexed by ID */
  private readonly tools = new Map<string, ToolRegistration>();

  /** Registered adapters indexed by adapter type */
  private readonly adapters = new Map<AdapterType, AdapterRegistryEntry>();

  constructor() {
    this.initializePlannedTools();
  }

  // ============================================
  // Tool Registry
  // ============================================

  /**
   * Register a tool definition.
   * Only tools with mutationAllowed=false are accepted.
   */
  registerTool(definition: AIToolDefinition, registeredBy: string): ToolRegistration {
    if (definition.mutationAllowed !== false) {
      throw new Error(
        `Tool '${definition.id}' has mutationAllowed=true. ` +
        'All tools must be read-only and advisory.',
      );
    }

    const registration: ToolRegistration = {
      definition,
      registeredAt: new Date().toISOString(),
      registeredBy,
    };

    this.tools.set(definition.id, registration);
    this.logger.log(`[Tool Registry] Registered tool: ${definition.id} (${definition.category})`);
    return registration;
  }

  /**
   * Get a tool by ID.
   */
  getTool(toolId: string): AIToolDefinition | undefined {
    const registration = this.tools.get(toolId);
    return registration?.definition;
  }

  /**
   * List all registered tools.
   */
  listTools(category?: ToolCategory): AIToolDefinition[] {
    const all = Array.from(this.tools.values()).map(r => r.definition);
    if (category) {
      return all.filter(t => t.category === category);
    }
    return all;
  }

  /**
   * Get tool registry status.
   */
  getRegistryStatus(): ToolRegistryStatus {
    const all = Array.from(this.tools.values()).map(r => r.definition);
    const categories: Record<ToolCategory, number> = {
      SEMANTIC: 0,
      BUSINESS: 0,
      ANALYTICS: 0,
      CONTENT: 0,
      UTILITY: 0,
    };

    for (const tool of all) {
      categories[tool.category] = (categories[tool.category] || 0) + 1;
    }

    return {
      totalTools: all.length,
      plannedTools: all.filter(t => t.status === 'PLANNED').length,
      availableTools: all.filter(t => t.status === 'AVAILABLE').length,
      categories,
    };
  }

  // ============================================
  // Adapter Registry (M21.7.4)
  // ============================================

  /**
   * Register a capability adapter.
   * Maps the adapter to its type and optionally to specific tool IDs.
   */
  registerAdapter(adapter: ToolAdapterInterface, toolIds?: string[]): void {
    if (this.adapters.has(adapter.type)) {
      this.logger.warn(`[Tool Registry] Adapter type '${adapter.type}' already registered, overwriting`);
    }

    this.adapters.set(adapter.type, {
      adapter,
      registeredAt: new Date().toISOString(),
      toolIds: toolIds ?? [],
    });

    this.logger.log(`[Tool Registry] Registered adapter: ${adapter.type} (status=${adapter.status})`);
  }

  /**
   * Get an adapter by type.
   */
  getAdapter(type: AdapterType): ToolAdapterInterface | undefined {
    return this.adapters.get(type)?.adapter;
  }

  /**
   * List all registered adapters.
   */
  listAdapters(): AdapterRegistryEntry[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get the adapter that can handle a given tool.
   */
  getAdapterForTool(toolId: string): ToolAdapterInterface | undefined {
    const tool = this.getTool(toolId);
    if (!tool) return undefined;

    // Check direct tool-to-adapter mapping
    for (const entry of this.adapters.values()) {
      if (entry.toolIds.includes(toolId)) {
        return entry.adapter;
      }
    }

    // Check by category
    const categoryMap: Record<ToolCategory, AdapterType> = {
      SEMANTIC: 'SEMANTIC',
      BUSINESS: 'BUSINESS',
      ANALYTICS: 'ANALYTICS',
      CONTENT: 'CONTENT',
      UTILITY: 'UTILITY',
    };

    const adapterType = categoryMap[tool.category];
    return this.adapters.get(adapterType)?.adapter;
  }

  /**
   * Get adapter status summary.
   */
  getAdapterStatus(): { type: AdapterType; status: string; capabilities: number }[] {
    return Array.from(this.adapters.values()).map(entry => ({
      type: entry.adapter.type,
      status: entry.adapter.status,
      capabilities: entry.adapter.getCapabilities().length,
    }));
  }

  // ============================================
  // Tool Validation
  // ============================================

  /**
   * Validate a tool definition without registering it.
   */
  validateTool(definition: AIToolDefinition): ToolValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!definition.id) {
      errors.push('Tool ID is required');
    }
    if (!definition.name) {
      errors.push('Tool name is required');
    }
    if (!definition.category) {
      errors.push('Tool category is required');
    }
    if (!definition.inputSchema) {
      errors.push('Input schema is required');
    }
    if (!definition.outputSchema) {
      errors.push('Output schema is required');
    }
    if (definition.mutationAllowed !== false) {
      errors.push(`Tool '${definition.id}' must have mutationAllowed=false`);
    }
    if (definition.status === 'AVAILABLE') {
      warnings.push(`Tool '${definition.id}' is marked AVAILABLE but no execution handler exists`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ============================================
  // Tool Invocation (placeholders)
  // ============================================

  /**
   * Validate a tool invocation request against the tool's input schema.
   * Does NOT execute the tool.
   */
  async validateInvocation(request: ToolInvocationRequest): Promise<ToolInvocationResult> {
    const tool = this.getTool(request.toolId);

    if (!tool) {
      return this.buildResult(request, 'REJECTED', `Tool '${request.toolId}' not found in registry`);
    }

    if (tool.mutationAllowed) {
      return this.buildResult(request, 'REJECTED', `Tool '${request.toolId}' has mutationAllowed=true — blocked`);
    }

    return this.buildResult(request, 'VALIDATED', `Tool '${tool.name}' validated`);
  }

  /**
   * Invoke a tool. All PLANNED tools return DEFERRED status.
   * No real execution occurs.
   */
  async invokeTool(request: ToolInvocationRequest): Promise<ToolInvocationResult> {
    const tool = this.getTool(request.toolId);

    if (!tool) {
      return this.buildResult(request, 'REJECTED', `Tool '${request.toolId}' not found in registry`);
    }

    if (tool.mutationAllowed) {
      return this.buildResult(request, 'REJECTED', `Tool '${request.toolId}' has mutationAllowed=true — blocked`);
    }

    if (tool.status !== 'AVAILABLE') {
      this.logger.log(`[Tool Registry] Tool '${request.toolId}' is ${tool.status} — execution deferred`);

      // Check if an adapter exists for this tool
      const adapter = this.getAdapterForTool(request.toolId);
      if (adapter && adapter.canHandle(tool)) {
        this.logger.log(`[Tool Registry] Adapter found for tool '${request.toolId}' (type=${adapter.type}, status=${adapter.status})`);
      }

      return this.buildResult(
        request,
        'DEFERRED',
        `Tool '${tool.name}' is ${tool.status}. Execution deferred to future implementation.`,
        {
          type: 'CONTEXT',
          summary: `Tool '${tool.name}' is planned for future implementation.`,
          data: {
            toolId: tool.id,
            toolStatus: tool.status,
            toolCategory: tool.category,
            adapterAvailable: adapter ? adapter.status === 'AVAILABLE' : false,
            adapterType: adapter?.type,
          },
        },
      );
    }

    // AVAILABLE tool: route through adapter if registered
    const adapter = this.getAdapterForTool(request.toolId);
    if (adapter) {
      this.logger.log(`[Tool Registry] Routing tool '${request.toolId}' through adapter: ${adapter.type}`);
      return adapter.execute(request);
    }

    // Future: route to actual tool handler
    return this.buildResult(request, 'DEFERRED', `Tool '${tool.name}' execution handler not yet implemented`);
  }

  // ============================================
  // Helper: Build Result
  // ============================================

  private buildResult(
    request: ToolInvocationRequest,
    status: ToolInvocationResult['status'],
    message: string,
    outputOverride?: ToolInvocationOutput,
  ): ToolInvocationResult {
    const output: ToolInvocationOutput = outputOverride ?? {
      type: 'CONTEXT',
      summary: message,
      data: {
        toolId: request.toolId,
        requestId: request.agentContext.requestId,
      },
    };

    return {
      status,
      output,
      requiresHumanReview: true,
      toolId: request.toolId,
      requestId: request.agentContext.requestId,
      executedAt: new Date().toISOString(),
      error: status === 'REJECTED' || status === 'ERROR' ? message : undefined,
    };
  }

  // ============================================
  // Planned Tools (Foundation Registry)
  // ============================================

  private initializePlannedTools(): void {
    const plannedTools: AIToolDefinition[] = [
      {
        id: 'TOOL-001',
        name: 'Semantic Search',
        category: 'SEMANTIC',
        description: 'AI-powered semantic search across Products, Content, and Knowledge',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query text' },
            entityType: { type: 'string', description: 'Entity type filter', enum: ['PRODUCT', 'CONTENT', 'ALL'] },
            limit: { type: 'number', description: 'Max results', default: 10 },
          },
          required: ['query'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            results: { type: 'array', description: 'Search results with similarity scores' },
          },
          description: 'Semantic search results',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:semantic',
        tags: ['search', 'semantic', 'retrieval'],
      },
      {
        id: 'TOOL-002',
        name: 'Business Analytics Query',
        category: 'ANALYTICS',
        description: 'Query business analytics data (Demand, RFQ, Offer, Matching)',
        inputSchema: {
          type: 'object',
          properties: {
            metric: { type: 'string', description: 'Metric to query', enum: ['demand_funnel', 'rfq_lifecycle', 'conversion', 'matching'] },
            timeRange: { type: 'string', description: 'Time range', enum: ['7d', '30d', '90d'] },
          },
          required: ['metric'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            data: { type: 'object', description: 'Analytics data' },
          },
          description: 'Business analytics data',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:analytics',
        tags: ['analytics', 'business', 'metrics'],
      },
      {
        id: 'TOOL-003',
        name: 'Content Discovery',
        category: 'CONTENT',
        description: 'Discover and retrieve content assets (Knowledge, Solutions, Articles)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Content query' },
            contentType: { type: 'string', description: 'Content type', enum: ['KNOWLEDGE', 'SOLUTION', 'ARTICLE', 'INSIGHT'] },
            limit: { type: 'number', description: 'Max results', default: 10 },
          },
          required: ['query'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            results: { type: 'array', description: 'Content results' },
          },
          description: 'Content discovery results',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:content',
        tags: ['content', 'discovery', 'knowledge'],
      },
      {
        id: 'TOOL-004',
        name: 'Product Capability Query',
        category: 'BUSINESS',
        description: 'Query product capabilities and specifications',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Product query' },
            categoryId: { type: 'string', description: 'Product category filter' },
            limit: { type: 'number', description: 'Max results', default: 10 },
          },
          required: ['query'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            results: { type: 'array', description: 'Product results' },
          },
          description: 'Product capability query results',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:business',
        tags: ['product', 'capability', 'query'],
      },
      {
        id: 'TOOL-005',
        name: 'Audit Intelligence Analysis',
        category: 'ANALYTICS',
        description: 'Analyze audit logs for risk indicators and patterns',
        inputSchema: {
          type: 'object',
          properties: {
            timeRange: { type: 'string', description: 'Time range', enum: ['7d', '30d', '90d'] },
            entityType: { type: 'string', description: 'Entity type filter' },
          },
          required: ['timeRange'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            indicators: { type: 'array', description: 'Risk indicators' },
          },
          description: 'Audit intelligence analysis results',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:audit',
        tags: ['audit', 'intelligence', 'risk'],
      },
      {
        id: 'TOOL-006',
        name: 'System Health Check',
        category: 'UTILITY',
        description: 'Query system health status and monitoring data',
        inputSchema: {
          type: 'object',
          properties: {
            component: { type: 'string', description: 'Component to check', enum: ['all', 'database', 'embedding', 'semantic', 'api'] },
          },
          required: [],
        },
        outputSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', description: 'System health status' },
          },
          description: 'System health check results',
        },
        mutationAllowed: false,
        status: 'PLANNED',
        requiredScope: 'ai:tool:utility',
        tags: ['system', 'health', 'monitoring'],
      },
    ];

    for (const tool of plannedTools) {
      this.registerTool(tool, 'system');
    }
  }
}