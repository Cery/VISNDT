import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 819 Permission Foundation — Admin toggles SupplierProduct self-service
 * enablement for a target organization. The flag only gates the SUPPLIER
 * self-service surface; Admin attach/governance is not gated by it.
 */
export class UpdateSupplierProductEnablementDto {
  @ApiProperty({
    description:
      'Whether SupplierProduct self-service is enabled for the target organization (opt-in).',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;
}