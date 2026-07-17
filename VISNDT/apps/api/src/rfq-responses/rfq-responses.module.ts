import { Module } from '@nestjs/common';
import { RfqResponsesController } from './rfq-responses.controller';
import { RfqResponsesService } from './rfq-responses.service';

@Module({
  controllers: [RfqResponsesController],
  providers: [RfqResponsesService],
})
export class RfqResponsesModule {}