import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SupplierProductsService } from './supplier-products.service';
import { SupplierSelfServiceGuard } from './supplier-self-service.guard';
import { CreateMySupplierProductDto } from './dto/create-my-supplier-product.dto';
import { UpdateMySupplierProductDto } from './dto/update-my-supplier-product.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

/**
 * 819/820 Permission Foundation + Self-Service Foundation — SupplierProduct
 * Self-Service surface.
 *
 * Mounted WITHOUT the `admin/` prefix and gated by SupplierSelfServiceGuard
 * (authenticated SUPPLIER org member whose organization has been enabled by an Admin).
 *
 * Every query / mutation is scoped server-side to the authenticated organization
 * (user.organizationId). OrganisationId is NEVER accepted from the client —
 * ownership can never be spoofed. create / edit are 820 additions.
 */
@ApiTags('Supplier Products (Self-Service)')
@Controller('supplier-products')
@UseGuards(JwtAuthGuard, SupplierSelfServiceGuard)
@ApiBearerAuth()
export class SupplierProductsSelfServiceController {
  constructor(private readonly service: SupplierProductsService) {}

  @Post('my')
  @ApiOperation({
    summary:
      '820 Self-Service — create an OWN SupplierProduct DRAFT. Scoped to the authenticated organization. Multiple distinct modelNumber allowed under the same Platform Product.',
  })
  @ApiBody({ type: CreateMySupplierProductDto })
  async createMy(
    @Body() dto: CreateMySupplierProductDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.createOwn(user.organizationId!, dto),
      'SupplierProduct draft created',
    );
  }

  @Get('my')
  @ApiOperation({
    summary:
      'List my organization SupplierProducts (SUPPLIER self-service). Scoped to the authenticated organization. Supports own-model keyword/status filter + pagination.',
  })
  async listMy(
    @Query() query: { keyword?: string; status?: string; page?: string; pageSize?: string },
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.findAllByOrganization(user.organizationId!, {
        keyword: query.keyword,
        status: query.status as never,
        page: parseInt(query.page ?? '1', 10),
        pageSize: parseInt(query.pageSize ?? '20', 10),
      }),
      'My SupplierProducts listed',
    );
  }

  @Get('my/:id')
  @ApiOperation({
    summary:
      'Read one of my organization SupplierProducts by id (SUPPLIER self-service, organization-scoped).',
  })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async findOneMy(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.findOne(id, user.organizationId!),
      'SupplierProduct fetched',
    );
  }

  @Patch('my/:id')
  @ApiOperation({
    summary:
      '820 Self-Service — edit an OWN SupplierProduct content (SUPPLIER, organization-scoped). Editable in DRAFT / APPROVED only.',
  })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  @ApiBody({ type: UpdateMySupplierProductDto })
  async updateMy(
    @Param('id') id: string,
    @Body() dto: UpdateMySupplierProductDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.updateOwn(id, user.organizationId!, dto),
      'SupplierProduct updated',
    );
  }

  @Post('my/:id/submit')
  @ApiOperation({
    summary:
      '821 Self-Service — submit an OWN SupplierProduct for admin review (DRAFT → SUBMITTED, organization-scoped).',
  })
  @ApiParam({ name: 'id', description: 'SupplierProduct UUID' })
  async submitMy(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.submitOwn(id, user.organizationId!, user.id),
      'SupplierProduct submitted',
    );
  }
}