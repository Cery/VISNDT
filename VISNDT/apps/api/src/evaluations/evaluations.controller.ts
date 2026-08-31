import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { ApiResponse } from '../common/dto/api-response.dto';
import { EvaluationsService } from './evaluations.service';
import { BuyerEvaluationGuard } from './guards/buyer-evaluation.guard';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { QueryEvaluationDto } from './dto/query-evaluation.dto';

@ApiTags('Evaluations')
@ApiBearerAuth()
@Controller('evaluations')
@UseGuards(JwtAuthGuard, BuyerEvaluationGuard)
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Create a persistent Buyer evaluation state for a Product/SupplierProduct',
  })
  async create(
    @Body() dto: CreateEvaluationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.create(dto, user);
    return ApiResponse.ok(result, 'Evaluation created');
  }

  @Get()
  @ApiOperation({ summary: 'List my (Buyer) evaluations (paginated)' })
  async getMine(
    @Query() query: QueryEvaluationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const { page = 1, pageSize = 20 } = query;
    const result = await this.service.getMine(user, page, pageSize);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an evaluation by ID (owner-only)' })
  @ApiParam({ name: 'id', description: 'Evaluation UUID' })
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.getById(id, user);
    return ApiResponse.ok(result);
  }

  @Get(':id/connection')
  @ApiOperation({
    summary:
      'Resolve Connection context (Product/Organization) to continue into the existing Inquiry authority',
  })
  @ApiParam({ name: 'id', description: 'Evaluation UUID' })
  async connectionContext(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.connectionContext(id, user);
    return ApiResponse.ok(result, 'Connection context resolved');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update evaluation state / note (owner-only)' })
  @ApiParam({ name: 'id', description: 'Evaluation UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEvaluationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.update(id, dto, user);
    return ApiResponse.ok(result, 'Evaluation updated');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an evaluation (owner-only)' })
  @ApiParam({ name: 'id', description: 'Evaluation UUID' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.remove(id, user);
    return ApiResponse.ok(result, 'Evaluation deleted');
  }
}