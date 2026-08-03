import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDemandController } from './admin-demand.controller';
import { AdminDemandService } from './admin-demand.service';
import { AdminMatchingController } from './admin-matching.controller';
import { AdminMatchingService } from './admin-matching.service';
import { AdminInquiryController } from './admin-inquiry.controller';
import { AdminInquiryService } from './admin-inquiry.service';
import { AdminAuditLogController } from './admin-audit-log.controller';
import { AdminAuditLogService } from './admin-audit-log.service';

@Module({
  imports: [AuthModule],
  controllers: [
    AdminController,
    AdminDemandController,
    AdminMatchingController,
    AdminInquiryController,
    AdminAuditLogController,
  ],
  providers: [
    AdminService,
    AdminDemandService,
    AdminMatchingService,
    AdminInquiryService,
    AdminAuditLogService,
  ],
})
export class AdminModule {}