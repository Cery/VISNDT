import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SupplierProductsService } from './supplier-products.service';
import { CreateSupplierProductDto } from './dto/create-supplier-product.dto';
import { RejectSupplierProductDto } from './dto/reject-supplier-product.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Supplier Products')
@Controller('admin/supplier-products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SupplierProductsController {
  constructor(private readonly service: SupplierProductsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a SupplierProduct DRAFT (ADMIN). organizationId is derived from the authenticated user context.',
  })
  async create(
    @Body() dto: CreateSupplierProductDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'Authenticated admin must belong to an organization to create a supplier product',
      );
    }
    const result = await this.service.createDraft({
      ...dto,
      organizationId: user.organizationId,
    });
    return ApiResponse.ok(result, 'SupplierProduct created');
  }

  @Get()
  @ApiOperation({
    summary:
      'Admin Governance Pool — list SupplierProducts across all organizations (status filter + pagination)',
  })
  async findAll(
    @Query()
    query: { status?: string; page?: string; pageSize?: string },
  ) {
    const page = parseInt(query.page ?? '1', 10);
    const pageSize = parseInt(query.pageSize ?? '20', 10);
    const result = await this.service.findAllAdmin({
      status: query.status as never,
      page,
      pageSize,
    });
    return ApiResponse.ok(result, 'SupplierProducts listed');
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get a SupplierProduct by ID (Admin Governance Pool, across organizations)',
  })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOneAdmin(id));
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit SupplierProduct (DRAFT → SUBMITTED)' })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async submit(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.submit(id, user.id),
      'SupplierProduct submitted',
    );
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Begin review (SUBMITTED → REVIEWING)' })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async beginReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.beginReview(id, user.id),
      'SupplierProduct review started',
    );
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve SupplierProduct (REVIEWING → APPROVED)' })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.approve(id, user.id),
      'SupplierProduct approved',
    );
  }

  @Post(':id/reject')
  @ApiOperation({
    summary:
      'Reject SupplierProduct (REVIEWING → REJECTED). reviewedNote is required.',
  })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  @ApiBody({ type: RejectSupplierProductDto })
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectSupplierProductDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.reject(id, user.id, dto.reviewedNote),
      'SupplierProduct rejected',
    );
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish SupplierProduct (APPROVED → PUBLISHED)' })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.publish(id, user.id),
      'SupplierProduct published',
    );
  }
}