import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    SuppliersModule,
  ],
})
export class AppModule {}