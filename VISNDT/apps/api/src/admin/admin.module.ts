import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmbeddingModule } from '../embedding/embedding.module';
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
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminMonitoringController } from './admin-monitoring.controller';
import { AdminMonitoringService } from './admin-monitoring.service';
import { AdminAuditIntelligenceController } from './admin-audit-intelligence.controller';
import { AdminAuditIntelligenceService } from './admin-audit-intelligence.service';
import { AdminProductCategoryKnowledgeMappingController } from './admin-product-category-knowledge-mapping.controller';
import { AdminProductCategoryKnowledgeMappingService } from './admin-product-category-knowledge-mapping.service';

@Module({
  imports: [AuthModule, EmbeddingModule],
  controllers: [
    AdminController,
    AdminDemandController,
    AdminMatchingController,
    AdminInquiryController,
    AdminAuditLogController,
    AdminAnalyticsController,
    AdminMonitoringController,
    AdminAuditIntelligenceController,
    AdminProductCategoryKnowledgeMappingController,
  ],
  providers: [
    AdminService,
    AdminDemandService,
    AdminMatchingService,
    AdminInquiryService,
    AdminAuditLogService,
    AdminAnalyticsService,
    AdminMonitoringService,
    AdminAuditIntelligenceService,
    AdminProductCategoryKnowledgeMappingService,
  ],
})
export class AdminModule {}