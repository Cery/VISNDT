import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';
import {
  CapabilityDetailDTO,
  CapabilitySupplierProductWithOffersDTO,
} from './dto/capability-detail.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Capabilities')
@Controller('capabilities')
export class CapabilitiesController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get(':id')
  @ApiOperation({
    summary:
      'Capability Discovery — read the capability graph for a Platform Product (Capability Authority).',
    description:
      'Returns Capability → SupplierProducts → (per-supplier) Offers. Transport boundary only; exposes NO raw database relations and NO bare Offer list.',
  })
  @ApiParam({ name: 'id', description: 'Platform Product UUID (capability node)' })
  async findCapability(@Param('id') id: string) {
    const graph = await this.discoveryService.findCapabilityGraph(id);

    // Group each Offer under its owning SupplierProduct.
    // Each supplier product carries ONLY its own offers[] (no bare Offer list).
    const bySupplier = new Map<string, typeof graph.offers>();
    for (const offer of graph.offers) {
      if (!offer.supplierProductId) continue;
      const list = bySupplier.get(offer.supplierProductId) ?? [];
      list.push(offer);
      bySupplier.set(offer.supplierProductId, list);
    }

    const supplierProducts: CapabilitySupplierProductWithOffersDTO[] =
      graph.supplierProducts.map((sp) => {
        const offersForSp = bySupplier.get(sp.id) ?? [];
        // Commercial layer summary: count + price band only (ACTIVE offers).
        // Reveals commercial availability; never internal governance data.
        const activeOffers = offersForSp.filter((o) => o.status === 'ACTIVE');
        const prices = activeOffers
          .map((o) => Number(o.price))
          .filter((p) => Number.isFinite(p) && p > 0)
          .sort((a, b) => a - b);
        const commercialSummary = {
          offerCount: offersForSp.length,
          activeOfferCount: activeOffers.length,
          priceFrom: prices.length > 0 ? prices[0] : null,
          priceTo: prices.length > 0 ? prices[prices.length - 1] : null,
          currency:
            (activeOffers.find((o) => o.currency) ??
              offersForSp.find((o) => o.currency))?.currency ?? null,
        };
        return {
          supplierProduct: { ...sp, commercialSummary } as never,
          offers: offersForSp as never[],
        };
      });

    const detail: CapabilityDetailDTO = {
      platformProduct: graph.capability as never,
      supplierProducts,
    };

    return ApiResponse.ok(detail, 'Capability detail retrieved');
  }
}