import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../common/dto/api-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { WorkspaceService } from './workspace.service';

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
}
