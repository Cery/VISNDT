import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SemanticService } from './semantic.service';

/**
 * SemanticController — M21.4.3 Foundation
 *
 * Provides internal verification endpoints only.
 * No public search endpoints. No ranking. No aggregation.
 *
 * Future (M21.4.4+):
 *   - GET /semantic/search  — public semantic search
 *   - GET /semantic/similar  — similarity lookup
 */
@Controller('semantic')
export class SemanticController {
  private readonly logger = new Logger(SemanticController.name);

  constructor(private readonly semanticService: SemanticService) {}

  /**
   * Health check — verifies module availability and embedding stats.
   * Internal use only. Not a public API.
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    return {
      ok: true,
      module: 'Semantic Intelligence Layer',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Status — returns full module status including capabilities and stats.
   * Used for development verification and Admin monitoring (future M21.4.7).
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status() {
    return this.semanticService.getStatus();
  }
}