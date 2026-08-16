import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AIService } from './ai.service';
import { AIGatewayStatus, AICapability, AIBoundaryRule } from './interfaces/ai-capability.interface';

/**
 * AI Gateway Controller — M21.7.1 AI Gateway Foundation
 *
 * Unified entry point for AI capability requests.
 * All endpoints are JWT-protected and return advisory-only data.
 * No business mutation, no autonomous decision, no semantic exposure.
 */

@ApiTags('AI Gateway')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get AI Gateway status and foundation readiness' })
  async getStatus(@Req() req: Request): Promise<AIGatewayStatus> {
    // Audit the AI request
    await this.aiService.logAIRequest({
      capability: 'GATEWAY_STATUS',
      timestamp: new Date().toISOString(),
      requesterId: (req.user as any)?.id ?? 'unknown',
      status: 'RECEIVED',
    });

    return this.aiService.getGatewayStatus();
  }

  @Get('capabilities')
  @ApiOperation({ summary: 'List available AI capabilities' })
  async getCapabilities(@Req() req: Request): Promise<AICapability[]> {
    await this.aiService.logAIRequest({
      capability: 'CAPABILITY_LIST',
      timestamp: new Date().toISOString(),
      requesterId: (req.user as any)?.id ?? 'unknown',
      status: 'RECEIVED',
    });

    return this.aiService.getCapabilities();
  }

  @Get('boundaries')
  @ApiOperation({ summary: 'List AI boundary rules' })
  async getBoundaries(@Req() req: Request): Promise<AIBoundaryRule[]> {
    await this.aiService.logAIRequest({
      capability: 'BOUNDARY_LIST',
      timestamp: new Date().toISOString(),
      requesterId: (req.user as any)?.id ?? 'unknown',
      status: 'RECEIVED',
    });

    return this.aiService.getBoundaries();
  }
}