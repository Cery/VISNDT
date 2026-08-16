import { Module } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';

/**
 * Tool Layer Module — M21.7.3 AI Tool Layer Foundation
 *
 * Foundation module for AI Tool Layer.
 * Provides ToolRegistryService for tool definition, registration,
 * validation, and invocation boundary.
 *
 * No business mutation, no autonomous execution, no LLM leakage.
 * All tools are PLANNED and mutationAllowed=false.
 */

@Module({
  providers: [ToolRegistryService],
  exports: [ToolRegistryService],
})
export class ToolLayerModule {}