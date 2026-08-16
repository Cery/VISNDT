/**
 * AI Gateway Module — M21.7.1-7 Full AI Foundation Pipeline (CLOSED)
 *
 * AI Gateway → Agent Runtime → Assistant → RAG → Context → Tool Layer → Adapter → Semantic / Business APIs.
 */

export { AIModule } from './ai.module';
export { AIService } from './ai.service';
export { AIController } from './ai.controller';
export { AICapabilityGuard, AI_CAPABILITY_KEY, AI_MUTATION_KEY } from './ai-capability.guard';

// Agent Runtime exports
export { AgentRuntimeModule } from './runtime/agent-runtime.module';
export { AgentRuntimeService } from './runtime/agent-runtime.service';

// Assistant exports
export { AssistantModule } from './assistant/assistant.module';
export { AssistantService } from './assistant/assistant.service';

// RAG exports
export { RAGModule } from './rag/rag.module';
export { RAGService } from './rag/rag.service';

// Context exports
export { ContextModule } from './context/context.module';
export { ContextService } from './context/context.service';

// Tool Layer exports
export { ToolLayerModule } from './tools/tool-layer.module';
export { ToolRegistryService } from './tools/tool-registry.service';

// Adapter Layer exports
export { AbstractSemanticAdapter } from './adapter/semantic-adapter.base';

export * from './interfaces/ai-capability.interface';
export * from './dto/ai-request.dto';
export * from './runtime/interfaces';
export * from './assistant/interfaces';
export * from './rag/interfaces';
export * from './context/interfaces';
export * from './tools/tool-definition.interface';
export * from './tools/tool-invocation.interface';
export * from './adapter/interfaces';