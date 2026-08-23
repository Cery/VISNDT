import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../common/dto/api-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { WorkspaceService } from './workspace.service';
import { WorkspaceSupplierProductsQueryDto } from './dto/workspace-supplier-products-query.dto';

@ApiTags('Workspace')
@Controller('workspace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check workspace module readiness' })
  getStatus() {
    return this.workspaceService.getStatus();
  }

  @Get('buyer/overview')
  @ApiOperation({ summary: 'Get buyer workspace overview aggregates' })
  async getBuyerOverview(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getBuyerOverview(user));
  }

  @Get('buyer/demands')
  @ApiOperation({ summary: 'List buyer organization demands for workspace' })
  async getBuyerDemands(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getBuyerDemands(user));
  }

  @Get('buyer/pending-decisions')
  @ApiOperation({ summary: 'List buyer pending RFQ response decisions' })
  async getBuyerPendingDecisions(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getBuyerPendingDecisions(user));
  }

  @Get('supplier/overview')
  @ApiOperation({ summary: 'Get supplier workspace overview aggregates' })
  async getSupplierOverview(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getSupplierOverview(user));
  }

  @Get('supplier/rfqs')
  @ApiOperation({ summary: 'List targeted RFQs assigned to the current supplier organization' })
  async getSupplierRfqs(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getSupplierRfqs(user));
  }

  @Get('supplier/responses')
  @ApiOperation({ summary: 'List RFQ responses submitted by the current supplier organization' })
  async getSupplierResponses(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(await this.workspaceService.getSupplierResponses(user));
  }

  @Get('supplier/runtime/products')
  @ApiOperation({ summary: 'Supplier Runtime — SupplierProduct Overview for the current supplier organization (paged / filtered)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', schema: { type: 'number', default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size', schema: { type: 'number', default: 20 } })
  @ApiQuery({ name: 'q', required: false, description: 'Unified search: brand / series / modelNumber / capability name' })
  @ApiQuery({ name: 'status', required: false, description: 'Lifecycle status filter (comma-separated multi value)' })
  @ApiQuery({ name: 'series', required: false, description: 'Series string filter (contains)' })
  async getSupplierProducts(
    @CurrentUser() user: AuthRequest['user'],
    @Query() query: WorkspaceSupplierProductsQueryDto,
  ) {
    return ApiResponse.ok(await this.workspaceService.getSupplierProducts(user, query));
  }

  @Get('supplier/runtime/products/:supplierProductId/inquiry-context')
  @ApiOperation({ summary: 'Supplier Runtime — Buyer Inquiry context for a specific SupplierProduct (read-only)' })
  async getSupplierInquiryContext(
    @Param('supplierProductId') supplierProductId: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.workspaceService.getSupplierInquiryContext(user, supplierProductId),
    );
  }
}
