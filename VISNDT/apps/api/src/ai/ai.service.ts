import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
  AIGatewayStatus,
  AICapability,
  AIBoundaryRule,
  AIRequestContext,
  AI_CAPABILITY_BOUNDARIES,
} from './interfaces/ai-capability.interface';

/**
 * AI Gateway Service — M21.7.1 AI Gateway Foundation
 *
 * Core service for AI Gateway status, capability management, and audit logging.
 * This is a FOUNDATION layer — no Agent Runtime, no LLM client, no business mutation.
 */

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  // ============================================
  // AI Capability Registry
  // ============================================

  private readonly capabilities: AICapability[] = [
    {
      id: 'CAP-001',
      category: 'SEARCH',
      label: 'Semantic Search',
      description: 'AI-powered semantic search and content discovery',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:search',
    },
    {
      id: 'CAP-002',
      category: 'ANALYSIS',
      label: 'Business Analysis',
      description: 'AI-driven business data analysis and insights',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:analysis',
    },
    {
      id: 'CAP-003',
      category: 'RECOMMEND',
      label: 'Smart Recommendations',
      description: 'AI-powered product and content recommendations',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:recommend',
    },
    {
      id: 'CAP-004',
      category: 'ASSIST',
      label: 'Admin Assistant',
      description: 'AI administrative assistance and summaries',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:assist',
    },
    {
      id: 'CAP-005',
      category: 'AUDIT',
      label: 'Audit Intelligence',
      description: 'AI audit analysis and risk detection',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:audit',
    },
    {
      id: 'CAP-006',
      category: 'MONITOR',
      label: 'Anomaly Detection',
      description: 'AI-powered system monitoring and anomaly detection',
      status: 'PLANNED',
      mutationAllowed: false,
      requiredScope: 'ai:monitor',
    },
  ];

  // ============================================
  // Gateway Status
  // ============================================

  getGatewayStatus(): AIGatewayStatus {
    return {
      status: 'READY',
      foundations: {
        semantic: true,
        embedding: true,
        analytics: true,
        audit: true,
        monitoring: true,
      },
      boundaries: {
        semanticLayerProtected: true,
        noAutonomousDecision: true,
        noBusinessMutation: true,
        humanInLoop: true,
      },
      availableCapabilities: 0,
      plannedCapabilities: this.capabilities.length,
    };
  }

  // ============================================
  // Capability Listing
  // ============================================

  getCapabilities(): AICapability[] {
    return this.capabilities;
  }

  // ============================================
  // Boundary Rules
  // ============================================

  getBoundaries(): AIBoundaryRule[] {
    return AI_CAPABILITY_BOUNDARIES;
  }

  // ============================================
  // AI Request Audit (placeholder)
  // ============================================

  /**
   * Log an AI request context using existing AuditLog infrastructure.
   * This is a PLACEHOLDER for future AI request auditing.
   * Does NOT create new database models.
   */
  async logAIRequest(context: AIRequestContext): Promise<void> {
    this.logger.log(
      `[AI Gateway] Request: capability=${context.capability}, requester=${context.requesterId}, status=${context.status}`,
    );

    await this.auditLogService.log({
      entityType: 'AI_REQUEST',
      entityId: `${context.capability}-${context.timestamp}`,
      action: 'STATUS_CHANGE',
      operatorId: context.requesterId,
      newValue: {
        capability: context.capability,
        timestamp: context.timestamp,
        status: context.status,
        metadata: context.metadata ?? {},
      },
    });

    this.logger.log(`[AI Gateway] Audit logged for capability=${context.capability}`);
  }
}