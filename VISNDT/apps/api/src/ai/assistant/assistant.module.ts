import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';

/**
 * Assistant Module — M21.7.5 AI Assistant Foundation
 *
 * Foundation module for AI Assistant orchestration.
 * Routes requests through Agent Runtime → Tool Layer → Adapter Layer.
 *
 * No LLM, no business mutation, no autonomous decision.
 * All capabilities are PLANNED. All outputs require human review.
 */

@Module({
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}