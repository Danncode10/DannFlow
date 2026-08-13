import { sql } from "drizzle-orm";
import { boolean, integer, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { organizations } from "./core";

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId: text("app_id").notNull().default(sql`current_setting('app.id', true)`),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    imageAltText: text("image_alt_text"),
    imageCaption: text("image_caption"),
    pexelsCreditUrl: text("pexels_credit_url"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    primaryKeyword: text("primary_keyword"),
    searchIntent: text("search_intent"),
    internalLinks: text("internal_links"),
    facebookCaption: text("facebook_caption"),
    redditDiscussionPrompt: text("reddit_discussion_prompt"),
    seoQualityScore: integer("seo_quality_score"),
    prePublishWarnings: text("pre_publish_warnings"),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    appSlugUnique: uniqueIndex("blog_posts_app_id_slug_idx").on(table.appId, table.slug),
  }),
);
