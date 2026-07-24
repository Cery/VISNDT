import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotificationStatus, NotificationType } from '@prisma/client';

export class QueryNotificationsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by notification status',
    enum: NotificationStatus,
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({
    description: 'Filter by notification type',
    enum: NotificationType,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}