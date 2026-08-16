import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AICapabilityGuard } from './ai-capability.guard';
import { AgentRuntimeModule } from './runtime/agent-runtime.module';
import { ToolLayerModule } from './tools/tool-layer.module';
import { AssistantModule } from './assistant/assistant.module';
import { RAGModule } from './rag/rag.module';
import { ContextModule } from './context/context.module';

/**
 * AI Gateway Module — M21.7.1-7 Full AI Foundation Pipeline (CLOSED)
 *
 * AI Gateway → Agent Runtime → Assistant → RAG → Context → Tool Layer → Adapter → Semantic / Business APIs.
 * No LLM Client, no business mutation, no autonomous decision.
 */

@Module({
  imports: [AgentRuntimeModule, ToolLayerModule, AssistantModule, RAGModule, ContextModule],
  controllers: [AIController],
  providers: [AIService, AICapabilityGuard],
  exports: [AIService, AICapabilityGuard, AgentRuntimeModule, ToolLayerModule, AssistantModule, RAGModule, ContextModule],
})
export class AIModule {}