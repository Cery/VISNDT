import { Module } from '@nestjs/common';
import { ParameterDefinitionsController } from './parameter-definitions.controller';
import { ParameterDefinitionsService } from './parameter-definitions.service';

@Module({
  controllers: [ParameterDefinitionsController],
  providers: [ParameterDefinitionsService],
})
export class ParameterDefinitionsModule {}