import { Controller, Get, Post, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { EmbeddingService } from './embedding.service';

@Controller('embedding')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    return this.embeddingService.getStatus();
  }

  @Post('content/:contentId')
  @HttpCode(HttpStatus.OK)
  async generateContentEmbedding(@Param('contentId') contentId: string) {
    return this.embeddingService.generateContentEmbedding(contentId);
  }

  @Post('content')
  @HttpCode(HttpStatus.OK)
  async generateAllContentEmbeddings() {
    return this.embeddingService.generateAllContentEmbeddings();
  }

  @Post('product/:productId')
  @HttpCode(HttpStatus.OK)
  async generateProductEmbedding(@Param('productId') productId: string) {
    return this.embeddingService.generateProductEmbedding(productId);
  }

  @Post('product')
  @HttpCode(HttpStatus.OK)
  async generateAllProductEmbeddings() {
    return this.embeddingService.generateAllProductEmbeddings();
  }

  @Post('chunk/:contentId')
  @HttpCode(HttpStatus.OK)
  async generateContentChunks(@Param('contentId') contentId: string) {
    return this.embeddingService.generateContentChunks(contentId);
  }

  @Post('chunk')
  @HttpCode(HttpStatus.OK)
  async generateAllContentChunks() {
    return this.embeddingService.generateAllContentChunks();
  }
}