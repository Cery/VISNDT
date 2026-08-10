import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceBuyerPendingResponseRfqDto {
  @ApiProperty({ description: 'RFQ UUID' })
  id: string;

  @ApiProperty({ description: 'RFQ status' })
  status: string;

  @ApiProperty({ description: 'RFQ creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'RFQ last update time' })
  updatedAt: Date;
}

export class WorkspaceBuyerPendingResponseDemandDto {
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
}

export class WorkspaceBuyerPendingResponseSupplierOrganizationDto {
  @ApiProperty({ description: 'Supplier organization UUID' })
  id: string;

  @ApiProperty({ description: 'Supplier organization name' })
  name: string;

  @ApiProperty({ description: 'Supplier organization type' })
  type: string;
}

export class WorkspaceBuyerPendingResponseDto {
  @ApiProperty({ description: 'RFQ response UUID' })
  id: string;

  @ApiProperty({ description: 'RFQ response status' })
  status: string;

  @ApiProperty({ description: 'When the response entered buyer pending decision state' })
  pendingSince: Date;

  @ApiProperty({ type: WorkspaceBuyerPendingResponseRfqDto })
  rfq: WorkspaceBuyerPendingResponseRfqDto;

  @ApiProperty({ type: WorkspaceBuyerPendingResponseDemandDto })
  demand: WorkspaceBuyerPendingResponseDemandDto;

  @ApiProperty({ type: WorkspaceBuyerPendingResponseSupplierOrganizationDto })
  supplierOrganization: WorkspaceBuyerPendingResponseSupplierOrganizationDto;
}
