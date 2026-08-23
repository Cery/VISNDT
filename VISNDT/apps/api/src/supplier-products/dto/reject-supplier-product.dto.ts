import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * RejectSupplierProductDto — M28.0 Hybrid Model C.
 *
 * Rejection requires a reviewedNote; the transition API otherwise rejects
 * an empty note (both at validation and service layer).
 */
export class RejectSupplierProductDto {
  @ApiProperty({ description: 'Review note explaining the rejection', example: 'Missing technical specification' })
  @IsString()
  @IsNotEmpty()
  reviewedNote: string;
}