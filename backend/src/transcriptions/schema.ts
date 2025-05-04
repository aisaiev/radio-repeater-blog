import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { articles } from 'src/articles/schema';

export const transcriptions = pgTable('transcriptions', {
  id: serial('id').primaryKey(),
  title: text('title'),
  start: text('start').notNull(),
  end: text('end').notNull(),
  content: text('content').notNull(),
  isRaw: boolean('is_raw').notNull().default(false),
  articleId: integer('article_id')
    .references(() => articles.id)
    .notNull(),
});

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  article: one(articles, {
    fields: [transcriptions.articleId],
    references: [articles.id],
  }),
}));
