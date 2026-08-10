import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceBuyerDemandSummaryDto {
  @ApiProperty({ description: 'Total demands in the current buyer organization' })
  total: number;

  @ApiProperty({
    description: 'Demand counts grouped by status',
    type: Object,
    example: {
      DRAFT: 0,
      PUBLISHED: 3,
      SUBMITTED: 1,
      PROCESSING: 0,
      CLOSED: 0,
      CANCELLED: 0,
    },
  })
  statusCounts: Record<string, number>;
}

export class WorkspaceBuyerMatchSummaryDto {
  @ApiProperty({ description: 'Total matches for demands in the current buyer organization' })
  total: number;

  @ApiProperty({
    description: 'Match counts grouped by status',
    type: Object,
    example: {
      PENDING: 0,
      MATCHED: 4,
      REVIEWED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      EXPIRED: 0,
    },
  })
  statusCounts: Record<string, number>;
}

export class WorkspaceBuyerRfqSummaryDto {
  @ApiProperty({ description: 'Total RFQs created under the current buyer organization demands' })
  total: number;
}

export class WorkspaceBuyerResponseSummaryDto {
  @ApiProperty({ description: 'Pending supplier responses awaiting buyer decision' })
  pendingCount: number;

  @ApiProperty({ description: 'Accepted supplier responses' })
  acceptedCount: number;

  @ApiProperty({ description: 'Rejected supplier responses' })
  rejectedCount: number;
}

export class WorkspaceBuyerNotificationSummaryDto {
  @ApiProperty({ description: 'Unread notifications scoped to the current buyer organization' })
  unreadCount: number;
}

export class WorkspaceBuyerOverviewDto {
  @ApiProperty({ type: WorkspaceBuyerDemandSummaryDto })
  demandSummary: WorkspaceBuyerDemandSummaryDto;

  @ApiProperty({ type: WorkspaceBuyerMatchSummaryDto })
  matchSummary: WorkspaceBuyerMatchSummaryDto;

  @ApiProperty({ type: WorkspaceBuyerRfqSummaryDto })
  rfqSummary: WorkspaceBuyerRfqSummaryDto;

  @ApiProperty({ type: WorkspaceBuyerResponseSummaryDto })
  responseSummary: WorkspaceBuyerResponseSummaryDto;

  @ApiProperty({ type: WorkspaceBuyerNotificationSummaryDto })
  notificationSummary: WorkspaceBuyerNotificationSummaryDto;
}
