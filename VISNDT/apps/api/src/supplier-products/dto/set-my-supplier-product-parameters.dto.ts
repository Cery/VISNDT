import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  ValidateNested,
  IsUUID,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * WP-5A — Parameter Write (R2) self-service override item.
 *
 * A SupplierProduct-specific override binds a ParameterDefinition to a value.
 * valueNumber is kept optional (numeric parameters may project a number).
 */
export class MyParameterOverrideItem {
  @ApiProperty({ description: 'ParameterDefinition UUID' })
  @IsUUID()
  parameterDefinitionId: string;

  @ApiProperty({ description: 'Override value text ("—" / "Not provided" for missing)' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Optional numeric projection' })
  @IsOptional()
  @IsNumber()
  valueNumber?: number;
}

/**
 * WP-5A — Parameter Write (R2) self-service set DTO.
 *
 * Full-set replace semantics: the provided { items } become the complete override
 * set for the SupplierProduct — each item is upserted (by supplierProductId +
 * parameterDefinitionId unique), and any persisted override NOT present in the
 * list is removed. This keeps the override model authoritative (full replace,
 * no dangling entries). Parameter Definition authority stays untouched.
 */
export class SetMySupplierProductParametersDto {
  @ApiProperty({ type: [MyParameterOverrideItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MyParameterOverrideItem)
  items: MyParameterOverrideItem[];
}