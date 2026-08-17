import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/dto/api-response.dto';
import { KnowledgeContextAdapter } from './knowledge-context/knowledge-context-adapter.service';

/**
 * MatchingController
 *
 * M23.0 — Read-side endpoints for match knowledge context.
 * Does NOT modify MatchingService, ScoringService, or weighted_v1.
 */
@ApiTags('Matches')
@Controller('matches')
export class MatchingController {
  constructor(
    private readonly knowledgeContextAdapter: KnowledgeContextAdapter,
  ) {}

  /**
   * GET /matches/:id/knowledge-context
   *
   * Returns the runtime-computed Knowledge Context for a DemandMatch.
   * This is a read-side companion capability:
   *   - Does NOT modify matchScore
   *   - Does NOT affect ranking
   *   - Does NOT call AI
   *   - Does NOT change the database
   *
   * Resolution:
   *   DemandMatch → Product → ProductCategory
   *     → KnowledgeDomain → KnowledgeCategory
   *     → KnowledgeEntry → KnowledgeRelation
   *     → KnowledgeContext
   */
  @Get(':id/knowledge-context')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get knowledge context for a match',
    description:
      'Returns runtime-computed knowledge context (domain, category, relevant entries, relations) for a DemandMatch. Read-side only — does not modify matching or scoring.',
  })
  @ApiParam({ name: 'id', description: 'DemandMatch UUID' })
  async getKnowledgeContext(@Param('id') id: string) {
    const context = await this.knowledgeContextAdapter.resolveKnowledgeContext(id);
    return ApiResponse.ok(context);
  }
}