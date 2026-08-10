import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceSupplierResponseRfqDto {
  @ApiProperty({ description: 'RFQ UUID' })
  id: string;

  @ApiProperty({ description: 'RFQ display title resolved from the related demand title' })
  title: string;

  @ApiProperty({ description: 'RFQ reference identifier' })
  reference: string;

  @ApiProperty({ description: 'RFQ status' })
  status: string;

  @ApiProperty({ description: 'RFQ creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'RFQ last update time' })
  updatedAt: Date;
}

export class WorkspaceSupplierResponseDemandDto {
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

export class WorkspaceSupplierResponseBuyerOrganizationDto {
  @ApiPropertyOptional({ description: 'Buyer organization UUID' })
  id?: string;

  @ApiPropertyOptional({ description: 'Buyer organization name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Buyer organization type' })
  type?: string;
}

export class WorkspaceSupplierResponseDto {
  @ApiProperty({ description: 'RFQ response UUID' })
  id: string;

  @ApiProperty({ description: 'RFQ response status' })
  status: string;

  @ApiProperty({ description: 'RFQ response creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'RFQ response last update time' })
  updatedAt: Date;

  @ApiProperty({ type: WorkspaceSupplierResponseRfqDto })
  rfq: WorkspaceSupplierResponseRfqDto;

  @ApiProperty({ type: WorkspaceSupplierResponseDemandDto })
  demand: WorkspaceSupplierResponseDemandDto;

  @ApiProperty({ type: WorkspaceSupplierResponseBuyerOrganizationDto })
  buyerOrganization: WorkspaceSupplierResponseBuyerOrganizationDto;
}
