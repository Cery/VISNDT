export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  /**
   * M28.0 Supplier Runtime Preparation — Capability Operation Boundary marker.
   * Distinct from the legacy OrganizationMember roles above; represents the
   * Supplier Capability Operator (Consumer of SupplierProduct / Inquiry context).
   * NOT a Marketplace / Seller role. Permission boundary remains unchanged.
   */
  SUPPLIER = 'SUPPLIER',
}