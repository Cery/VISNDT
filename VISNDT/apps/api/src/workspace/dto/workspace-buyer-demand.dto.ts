import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceBuyerDemandDto {
  @ApiProperty({ description: 'Demand UUID' })
  id: string;

  @ApiProperty({ description: 'Demand title' })
  title: string;

  @ApiProperty({ description: 'Demand status' })
  status: string;

  @ApiProperty({ description: 'Demand creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'Demand last update time' })
  updatedAt: Date;

  @ApiProperty({ description: 'Number of matches under the demand' })
  matchCount: number;

  @ApiProperty({ description: 'Number of RFQs under the demand' })
  rfqCount: number;
}
