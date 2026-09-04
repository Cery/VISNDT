import { Module } from '@nestjs/common';
import { SupplierProductsService } from './supplier-products.service';
import { SupplierProductsController } from './supplier-products.controller';
import { SupplierProductsSelfServiceController } from './supplier-products-self-service.controller';
import { SupplierSelfServiceGuard } from './supplier-self-service.guard';

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
 *
 * 819: SupplierProductsSelfServiceController (SUPPLIER self-service) added,
 *   gated by SupplierSelfServiceGuard (enabled supplier org, existing membership).
 */
@Module({
  controllers: [SupplierProductsController, SupplierProductsSelfServiceController],
  providers: [SupplierProductsService, SupplierSelfServiceGuard],
  exports: [SupplierProductsService],
})
export class SupplierProductsModule {}