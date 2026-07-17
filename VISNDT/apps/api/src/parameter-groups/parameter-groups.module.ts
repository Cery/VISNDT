import { Module } from '@nestjs/common';
import { ParameterGroupsController } from './parameter-groups.controller';
import { ParameterGroupsService } from './parameter-groups.service';

@Module({
  controllers: [ParameterGroupsController],
  providers: [ParameterGroupsService],
})
export class ParameterGroupsModule {}