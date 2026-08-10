import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceSupplierRfqSummaryDto {
  @ApiProperty({ description: 'Total targeted RFQs assigned to the current supplier organization' })
  total: number;

  @ApiProperty({
    description: 'Targeted RFQ counts grouped by status',
    type: Object,
    example: {
      DRAFT: 0,
      OPEN: 2,
      RESPONDING: 1,
      CLOSED: 0,
      CANCELLED: 0,
    },
  })
  statusCounts: Record<string, number>;
}

export class WorkspaceSupplierResponseSummaryDto {
  @ApiProperty({ description: 'Total RFQ responses submitted by the current supplier organization' })
  total: number;

  @ApiProperty({
    description: 'RFQ response counts grouped by status',
    type: Object,
    example: {
      SUBMITTED: 1,
      VIEWED: 1,
      ACCEPTED: 0,
      REJECTED: 0,
    },
  })
  statusCounts: Record<string, number>;
}

export class WorkspaceSupplierNotificationSummaryDto {
  @ApiProperty({ description: 'Unread notifications scoped to the current supplier organization' })
  unreadCount: number;
}

export class WorkspaceSupplierMatchSummaryDto {
  @ApiProperty({
    description: 'Total demand matches linked to offers owned by the current supplier organization',
  })
  total: number;

  @ApiProperty({
    description: 'Demand match counts grouped by status',
    type: Object,
    example: {
      PENDING: 0,
      MATCHED: 2,
      REVIEWED: 0,
      ACCEPTED: 1,
      REJECTED: 0,
      EXPIRED: 0,
    },
  })
  statusCounts: Record<string, number>;
}

export class WorkspaceSupplierOverviewDto {
  @ApiProperty({ type: WorkspaceSupplierRfqSummaryDto })
  rfqSummary: WorkspaceSupplierRfqSummaryDto;

  @ApiProperty({ type: WorkspaceSupplierResponseSummaryDto })
  responseSummary: WorkspaceSupplierResponseSummaryDto;

  @ApiProperty({ type: WorkspaceSupplierNotificationSummaryDto })
  notificationSummary: WorkspaceSupplierNotificationSummaryDto;

  @ApiProperty({ type: WorkspaceSupplierMatchSummaryDto })
  matchSummary: WorkspaceSupplierMatchSummaryDto;
}
