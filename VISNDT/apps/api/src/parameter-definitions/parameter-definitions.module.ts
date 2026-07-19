import { Module } from '@nestjs/common';
import { ParameterDefinitionsController } from './parameter-definitions.controller';
import { ParameterDefinitionsService } from './parameter-definitions.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ParameterDefinitionsController],
  providers: [ParameterDefinitionsService],
})
export class ParameterDefinitionsModule {}