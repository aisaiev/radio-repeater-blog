import { Module } from '@nestjs/common';
import { TranscriptionsController } from './controller/transcriptions.controller';
import { TranscriptionsService } from './service/transcriptions.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TranscriptionsController],
  providers: [TranscriptionsService],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {}
