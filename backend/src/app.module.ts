import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/app-config.module';
import { ArticlesModule } from './articles/articles.module';
import { TranscriptionsModule } from './transcriptions/transcriptions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../../public'),
    }),
    AppConfigModule,
    DatabaseModule,
    ArticlesModule,
    TranscriptionsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
