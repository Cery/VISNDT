import { Module } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { CapabilitiesController } from './capabilities.controller';

/**
 * DiscoveryModule — M28.0 Hybrid Model C Aggregation + API transport.
 *
 * Service-side aggregation:
 *   Capability (Platform Product) ← mapped to → SupplierProducts ← owned by → Offers
 *
 * 660.9: Transport layer — Capability Discovery read API exposed here.
 *   GET /capabilities/:id returns CapabilityDetailDTO (nested, capability-anchored).
 *   No raw Prisma relations, no bare Offer list in the response.
 */
@Module({
  controllers: [CapabilitiesController],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}