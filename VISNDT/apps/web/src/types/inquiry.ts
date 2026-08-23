/** Request body for POST /inquiries */
export interface CreateInquiryDto {
  productId: string;
  offerId: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Optional specific published Supplier Model reference in the inquiry context (M28.0) */
  supplierProductId?: string;
}

/** Response from POST /inquiries */
export interface InquiryResponse {
  inquiry: {
    productId: string;
    productName: string;
    organizationId: string;
    organizationName: string;
    visitorName: string;
    visitorEmail: string;
    /** Supplier Model context echoed back when the inquiry referenced a specific published model */
    supplierProduct?: {
      supplierProductId: string;
      supplierModelLabel: string;
    } | null;
  };
  notificationsSent: number;
}