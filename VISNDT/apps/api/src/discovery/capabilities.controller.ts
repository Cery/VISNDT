import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';
import { CapabilityDetailDTO } from './dto/capability-detail.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Capabilities')
@Controller('capabilities')
export class CapabilitiesController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get(':id')
  @ApiOperation({
    summary:
      'Capability Discovery — read the non-commercial capability graph for a Platform Product (Capability Authority).',
    description:
      'Returns Capability → published SupplierProducts (model context only). P2 frozen: Offer remains commercial/private and is NEVER part of this public payload — no price, no currency, no commercialSummary, no offers.',
  })
  @ApiParam({ name: 'id', description: 'Platform Product UUID (capability node)' })
  async findCapability(@Param('id') id: string) {
    const graph = await this.discoveryService.findCapabilityGraph(id);

    // Public transport exposes ONLY the non-commercial model context. No Offer
    // aggregation, no price band, no commercial summary (P2 — commercial cleanup).
    const supplierProducts = graph.supplierProducts;

    const detail: CapabilityDetailDTO = {
      platformProduct: graph.capability as never,
      supplierProducts: supplierProducts as never,
    };

    return ApiResponse.ok(detail, 'Capability detail retrieved');
  }
}