import { Module } from '@nestjs/common';
import { ArticlesController } from './controller/articles.controller';
import { ArticlesService } from './service/articles.service';
import { DatabaseModule } from 'src/database/database.module';
import { TranscriptionsModule } from 'src/transcriptions/transcriptions.module';

@Module({
  imports: [DatabaseModule, TranscriptionsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
