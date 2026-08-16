import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SemanticQueryService } from './semantic-query.service';
import {
  SemanticQueryDto,
  SemanticQueryResponse,
} from './dto/semantic-query.dto';

// ============================================
// SemanticQueryController — M21.4.4 Semantic Search API Foundation
//
// Internal Semantic Retrieval API.
// NOT a public search endpoint. NOT a business search API.
//
// Internal API Boundary:
//   - Default: Internal Capability (not Public)
//   - Guard: Internal usage guard (future: RBAC)
//   - Contract: Frozen (M21.4.4)
//
// Semantic Layer = Retrieve, NOT Decide.
// ============================================

/**
 * Internal Guard — placeholder for M21.4.4.
 * Marks this endpoint as internal capability, not public API.
 * Future: replace with real RBAC / API key guard.
 */
class InternalApiGuard {
  canActivate(): boolean {
    // Internal API — no auth guard for development phase (M21.4.4)
    // Future: add RBAC (M21.4.7 Admin Semantic Operation)
    return true;
  }
}

@ApiTags('Semantic - Internal')
@Controller('semantic')
export class SemanticQueryController {
  private readonly logger = new Logger(SemanticQueryController.name);

  constructor(private readonly semanticQueryService: SemanticQueryService) {}

  /**
   * Semantic Query API — Internal Retrieval Capability
   *
   * FROZEN CONTRACT (M21.4.4):
   *   GET /api/semantic/query?query=...&entityType=content|product|chunk&limit=10
   *
   * Input:
   *   - query: text query string
   *   - entityType: content | product | chunk
   *   - limit: 1-50 (default 10)
   *
   * Output:
   *   - query: original query text
   *   - entityType: target entity type
   *   - results: [{ entityType, entityId, similarity }]
   *   - total: result count
   *
   * Internal API only. Not a public search endpoint.
   */
  @Get('query')
  @HttpCode(HttpStatus.OK)
  @UseGuards(InternalApiGuard)
  @ApiOperation({
    summary: 'Semantic query (Internal)',
    description:
      'Internal semantic retrieval API. Returns raw vector similarity results. Not a public search endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'Semantic query results sorted by similarity (descending)',
  })
  async query(@Query() dto: SemanticQueryDto): Promise<SemanticQueryResponse> {
    this.logger.log(
      `Semantic query: type=${dto.entityType}, limit=${dto.limit}`,
    );
    return this.semanticQueryService.query(dto);
  }
}