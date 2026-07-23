import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDemandController } from './admin-demand.controller';
import { AdminDemandService } from './admin-demand.service';
import { AdminMatchingController } from './admin-matching.controller';
import { AdminMatchingService } from './admin-matching.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, AdminDemandController, AdminMatchingController],
  providers: [AdminService, AdminDemandService, AdminMatchingService],
})
export class AdminModule {}