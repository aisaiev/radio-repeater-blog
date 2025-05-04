import { relations } from 'drizzle-orm';
import { date, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { transcriptions } from 'src/transcriptions/schema';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  date: date('date').notNull(),
  coverImageName: text('cover_image_name'),
  sourceFileName: text('source_file_name'),
});

export const articlesRelations = relations(articles, ({ many }) => ({
  transcriptions: many(transcriptions),
}));
