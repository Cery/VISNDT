import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceSupplierRfqBuyerOrganizationDto {
  @ApiPropertyOptional({ description: 'Buyer organization UUID' })
  id?: string;

  @ApiPropertyOptional({ description: 'Buyer organization name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Buyer organization type' })
  type?: string;
}

export class WorkspaceSupplierRfqDto {
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

  @ApiProperty({ type: WorkspaceSupplierRfqBuyerOrganizationDto })
  buyerOrganization: WorkspaceSupplierRfqBuyerOrganizationDto;
}
