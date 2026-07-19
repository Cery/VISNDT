import { Module } from '@nestjs/common';
import { RfqResponsesController } from './rfq-responses.controller';
import { RfqResponsesService } from './rfq-responses.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RfqResponsesController],
  providers: [RfqResponsesService],
})
export class RfqResponsesModule {}