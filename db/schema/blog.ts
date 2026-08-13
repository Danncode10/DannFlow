import { boolean, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(), title: text("title").notNull(), slug: text("slug").notNull(), excerpt: text("excerpt"), content: text("content").notNull().default(""), coverImageUrl: text("cover_image_url"), seoTitle: text("seo_title"), seoDescription: text("seo_description"), isPublished: boolean("is_published").notNull().default(false), publishedAt: timestamp("published_at", { withTimezone: true }), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ slugUnique: uniqueIndex("blog_posts_slug_idx").on(t.slug) }));
