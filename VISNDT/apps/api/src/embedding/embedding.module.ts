import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingService, OpenAIEmbeddingProvider } from './embedding.service';
import { EmbeddingController } from './embedding.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmbeddingController],
  providers: [EmbeddingService, OpenAIEmbeddingProvider],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}