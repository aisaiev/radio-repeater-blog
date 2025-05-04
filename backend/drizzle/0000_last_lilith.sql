CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"date" date NOT NULL,
	"cover_image_name" text,
	"source_file_name" text
);
--> statement-breakpoint
CREATE TABLE "transcriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"start" text NOT NULL,
	"end" text NOT NULL,
	"content" text NOT NULL,
	"is_raw" boolean DEFAULT false NOT NULL,
	"article_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transcriptions" ADD CONSTRAINT "transcriptions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;