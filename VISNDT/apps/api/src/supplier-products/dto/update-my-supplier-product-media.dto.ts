import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * WP-5A — Media Write (R1) self-service update DTO.
 *
 * Supports reorder (displayOrder), primary promotion (isPrimary) and
 * metadata (title / altText). A promoted primary transparently demotes the
 * other media of the same SupplierProduct (server-side enforced).
 */
export class UpdateMySupplierProductMediaDto {
  @ApiPropertyOptional({ description: 'Media title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Alt text (accessibility)' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Is this the primary media?' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}