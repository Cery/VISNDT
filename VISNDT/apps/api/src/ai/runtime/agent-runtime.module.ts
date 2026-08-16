import { Module, forwardRef } from '@nestjs/common';
import { AgentRuntimeService } from './agent-runtime.service';
import { AIModule } from '../ai.module';
import { AuditLogModule } from '../../audit-log/audit-log.module';

/**
 * Agent Runtime Module — M21.7.2 Agent Runtime Foundation
 *
 * Foundation module for AI Agent Runtime lifecycle management.
 * Provides AgentRuntimeService for context validation, capability routing,
 * and audit integration.
 *
 * No LLM execution, no business mutation, no autonomous decision.
 * All capabilities remain PLANNED.
 */

@Module({
  imports: [forwardRef(() => AIModule), AuditLogModule],
  providers: [AgentRuntimeService],
  exports: [AgentRuntimeService],
})
export class AgentRuntimeModule {}