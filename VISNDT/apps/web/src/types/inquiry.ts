/** Request body for POST /inquiries */
export interface CreateInquiryDto {
  productId: string;
  offerId: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
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
  };
  notificationsSent: number;
}