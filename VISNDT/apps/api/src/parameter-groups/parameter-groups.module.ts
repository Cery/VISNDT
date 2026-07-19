import { Module } from '@nestjs/common';
import { ParameterGroupsController } from './parameter-groups.controller';
import { ParameterGroupsService } from './parameter-groups.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ParameterGroupsController],
  providers: [ParameterGroupsService],
})
export class ParameterGroupsModule {}