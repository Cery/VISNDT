import { Module } from '@nestjs/common';
import { SupplierProductsService } from './supplier-products.service';
import { SupplierProductsController } from './supplier-products.controller';

/**
 * SupplierProductsModule — M28.0 Hybrid Model C Domain Service + API transport.
 *
 * Domain boundary:
 *   SupplierProduct = Supplier Owned Model Entity (belongsTo Organization)
 *                     bound to platformProductId (Platform Capability Node)
 *
 * 660.9: Transport layer — Admin-governance API controller exposed here.
 *   SupplierProduct governance routes (create/list/get + lifecycle transitions).
 *   organizationId is always derived from the authenticated user context.
 */
@Module({
  controllers: [SupplierProductsController],
  providers: [SupplierProductsService],
  exports: [SupplierProductsService],
})
export class SupplierProductsModule {}