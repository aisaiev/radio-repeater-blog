import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../schema';
import * as transcriptionsSchema from 'src/transcriptions/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { count, desc } from 'drizzle-orm';
import { CreateArticleRequest } from '../dto/create-article.request';
import { TranscriptionsService } from 'src/transcriptions/service/transcriptions.service';
import { GetArticlesResponse } from '../dto/get-articles.response';
import { GetArticleResponse } from '../dto/get-article.response';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from 'src/common/dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly transcriptionsService: TranscriptionsService,
  ) {}

  async getArticles(
    data: PaginationRequestDto,
  ): Promise<PaginationResponseDto<GetArticlesResponse>> {
    const total = await this.database
      .select({ count: count(schema.articles.id) })
      .from(schema.articles)
      .then((result) => result[0].count);

    const articles = await this.database
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        summary: schema.articles.summary,
        date: schema.articles.date,
      })
      .from(schema.articles)
      .orderBy(desc(schema.articles.date))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    return {
      data: articles,
      total,
      page: data.page,
      pageSize: data.pageSize,
    };
  }

  async getArticle(id: number): Promise<GetArticleResponse | null> {
    const article = await this.database.query.articles.findFirst({
      with: { transcriptions: true },
      where: (articles, { eq }) => eq(articles.id, id),
    });
    if (!article) return null;

    const { transcriptions: articleTranscriptions, ...articleData } = article;
    type Transcription =
      typeof transcriptionsSchema.transcriptions.$inferSelect;

    const transcriptions = (articleTranscriptions as unknown as Transcription[])
      .filter((t) => !t.isRaw)
      .map((t) => {
        return {
          id: t.id,
          title: t.title,
          start: t.start,
          end: t.end,
          content: t.content,
        };
      });
    const rawTranscriptions = (
      articleTranscriptions as unknown as Transcription[]
    )
      .filter((t) => t.isRaw)
      .map((t) => {
        return {
          id: t.id,
          start: t.start,
          end: t.end,
          content: t.content,
        };
      });

    return {
      ...articleData,
      transcriptions,
      rawTranscriptions,
    };
  }

  async createArticle(article: CreateArticleRequest): Promise<void> {
    const [insertedArticle] = await this.database
      .insert(schema.articles)
      .values(article)
      .returning({ id: schema.articles.id });

    if (insertedArticle) {
      const transcriptions = article.transcriptions.map((transcription) => ({
        ...transcription,
        isRaw: false,
        articleId: insertedArticle.id,
      }));
      const rawTranscriptions = article.rawTranscriptions.map(
        (transcription) => ({
          ...transcription,
          isRaw: true,
          articleId: insertedArticle.id,
        }),
      );
      await this.transcriptionsService.createTranscriptions([
        ...transcriptions,
        ...rawTranscriptions,
      ]);
    }
  }
}
