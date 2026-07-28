import { ApiProperty } from '@nestjs/swagger';

export class CreateFileAssetDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (max 10MB)',
  })
  file: Express.Multer.File;
}