import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';

/**
 * RAG Module — M21.7.6 AI RAG Foundation
 *
 * Knowledge Retrieval Preparation Layer.
 * Provides retrieval context, source registry, and pipeline foundation.
 *
 * No LLM, no embedding, no vector database, no autonomous decision.
 * All knowledge sources are PLANNED. All retrieval returns DEFERRED.
 */

@Module({
  providers: [RAGService],
  exports: [RAGService],
})
export class RAGModule {}