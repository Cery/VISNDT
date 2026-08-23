import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ description: 'Product UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('loose')
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Offer UUID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID('loose')
  @IsNotEmpty()
  offerId: string;

  @ApiProperty({ description: 'Organization UUID (receiving enterprise)', example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID('loose')
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Visitor name', example: 'Zhang Wei' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Visitor email', example: 'zhangwei@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Visitor phone', example: '+86-13800138000' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    description:
      'SupplierProduct UUID — optional reference to a specific published Supplier Model in the inquiry context.',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID('loose')
  @IsOptional()
  supplierProductId?: string;

  @ApiProperty({ description: 'Inquiry message', example: 'I am interested in this product, please provide more details.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}