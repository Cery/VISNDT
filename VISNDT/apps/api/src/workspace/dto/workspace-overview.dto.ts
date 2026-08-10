import { ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceOverviewDto {
  @ApiPropertyOptional({
    description: 'Workspace role that the overview is scoped to',
    enum: ['BUYER', 'SUPPLIER'],
  })
  workspaceRole?: 'BUYER' | 'SUPPLIER';

  @ApiPropertyOptional({
    description: 'Organization context for the aggregated workspace view',
  })
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Placeholder for future summary cards and counters',
    type: Object,
  })
  summary?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Placeholder for future recent activity aggregation',
    type: [Object],
  })
  recentActivities?: Record<string, unknown>[];
}
