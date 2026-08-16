import { Module } from '@nestjs/common';
import { ContextService } from './context.service';

/**
 * Context Module — M21.7.7 AI Knowledge Context Foundation
 *
 * Context governance layer for AI capability orchestration.
 * Provides context validation, registry, traceability, and audit.
 *
 * No LLM, no vector DB, no embedding, no business mutation.
 * Context only defines contracts — no execution.
 */

@Module({
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}