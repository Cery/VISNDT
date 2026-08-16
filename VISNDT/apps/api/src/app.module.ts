import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationMembersModule } from './organization-members/organization-members.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { ParameterGroupsModule } from './parameter-groups/parameter-groups.module';
import { ParameterDefinitionsModule } from './parameter-definitions/parameter-definitions.module';
import { ProductParametersModule } from './product-parameters/product-parameters.module';
import { ProductMediaModule } from './product-media/product-media.module';
import { OffersModule } from './offers/offers.module';
import { DemandsModule } from './demands/demands.module';
import { RfqsModule } from './rfqs/rfqs.module';
import { RfqResponsesModule } from './rfq-responses/rfq-responses.module';
import { WorkflowEventsModule } from './workflow-events/workflow-events.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { StorageModule } from './storage/storage.module';
import { FileAssetModule } from './file-asset/file-asset.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ContentModule } from './content/content.module';
import { ContentMediaModule } from './content-media/content-media.module';
import { ContentRevisionModule } from './content-revision/content-revision.module';
import { ContentTagModule } from './content-tag/content-tag.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { SemanticModule } from './semantic/semantic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    HealthModule,
    UsersModule,
    OrganizationsModule,
    OrganizationMembersModule,
    ProductCategoriesModule,
    ProductsModule,
    ParameterGroupsModule,
    ParameterDefinitionsModule,
    ProductParametersModule,
    ProductMediaModule,
    OffersModule,
    DemandsModule,
    RfqsModule,
    RfqResponsesModule,
    WorkflowEventsModule,
    AuthModule,
    AdminModule,
    NotificationsModule,
    InquiriesModule,
    StorageModule,
    FileAssetModule,
    AuditLogModule,
    WorkspaceModule,
    ContentModule,
    ContentMediaModule,
    ContentRevisionModule,
    ContentTagModule,
    AnalyticsModule,
    EmbeddingModule,
    SemanticModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
