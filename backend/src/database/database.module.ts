import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { EnvironmentVariables } from 'src/config/app-config.consts';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as articlesSchema from '../articles/schema';
import * as transcriptionsSchema from '../transcriptions/schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow(
            EnvironmentVariables.DATABASE_URL,
          ),
        });
        return drizzle(pool, {
          schema: {
            ...articlesSchema,
            ...transcriptionsSchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
