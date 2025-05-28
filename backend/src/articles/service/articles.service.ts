import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../schema';
import * as transcriptionsSchema from 'src/transcriptions/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  inArray,
  SQL,
} from 'drizzle-orm';
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
    const { search, page, pageSize } = data;

    const filter = search
      ? ilike(transcriptionsSchema.transcriptions.content, `%${search}%`)
      : undefined;

    const total = await this.getArticlesTotal(filter);

    let articles: GetArticlesResponse[];
    if (!filter) {
      articles = await this.database
        .select({
          id: schema.articles.id,
          title: schema.articles.title,
          summary: schema.articles.summary,
          date: schema.articles.date,
        })
        .from(schema.articles)
        .orderBy(desc(schema.articles.date))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } else {
      const articleIds = await this.getArticleIdsByFilter(
        filter,
        page,
        pageSize,
      );
      articles = await this.getArticlesByIds(articleIds);
    }

    return {
      data: articles,
      total,
      page,
      pageSize,
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
      .sort((a, b) => a.id - b.id)
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
      .sort((a, b) => a.id - b.id)
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

  private async getArticlesTotal(filter?: SQL): Promise<number> {
    if (!filter) {
      return this.database
        .select({ count: count(schema.articles.id) })
        .from(schema.articles)
        .then((result) => result[0].count);
    }
    return this.database
      .select({ count: countDistinct(schema.articles.id) })
      .from(schema.articles)
      .leftJoin(
        transcriptionsSchema.transcriptions,
        eq(transcriptionsSchema.transcriptions.articleId, schema.articles.id),
      )
      .where(filter)
      .then((result) => result[0].count);
  }

  private async getArticleIdsByFilter(
    filter: SQL,
    page: number,
    pageSize: number,
  ): Promise<number[]> {
    return this.database
      .select({ id: schema.articles.id })
      .from(schema.articles)
      .leftJoin(
        transcriptionsSchema.transcriptions,
        eq(transcriptionsSchema.transcriptions.articleId, schema.articles.id),
      )
      .where(filter)
      .orderBy(desc(schema.articles.date))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .groupBy(schema.articles.id)
      .then((rows) => rows.map((a) => a.id));
  }

  private async getArticlesByIds(
    ids: number[],
  ): Promise<GetArticlesResponse[]> {
    if (!ids.length) return [];
    return this.database
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        summary: schema.articles.summary,
        date: schema.articles.date,
      })
      .from(schema.articles)
      .where(inArray(schema.articles.id, ids))
      .orderBy(desc(schema.articles.date));
  }
}
