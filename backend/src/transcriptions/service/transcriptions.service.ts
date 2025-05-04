import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';

@Injectable()
export class TranscriptionsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createTranscriptions(
    transcriptions: (typeof schema.transcriptions.$inferInsert)[],
  ) {
    await this.database.insert(schema.transcriptions).values(transcriptions);
  }
}
