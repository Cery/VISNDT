import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Notification read status',
    enum: NotificationStatus,
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}