-- 819 Permission Foundation
-- Admin-controlled org-level enablement for SupplierProduct self-service.
-- Opt-in (default false): an organization must be explicitly enabled before
-- its SUPPLIER members can use SupplierProduct self-service.
-- Does NOT gate Admin attach/governance or Platform Product authority, and is
-- not a second RBAC / new claim (gates only against authenticated SUPPLIER access).

ALTER TABLE "organization"
  ADD COLUMN "supplier_product_management_enabled" BOOLEAN NOT NULL DEFAULT false;