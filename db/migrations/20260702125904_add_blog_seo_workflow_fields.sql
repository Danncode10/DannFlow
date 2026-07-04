-- Adds reusable blog SEO workflow and social draft fields.

alter table public.blog_posts
  add column if not exists image_alt_text text,
  add column if not exists image_caption text,
  add column if not exists pexels_credit_url text,
  add column if not exists primary_keyword text,
  add column if not exists search_intent text,
  add column if not exists internal_links text,
  add column if not exists facebook_caption text,
  add column if not exists reddit_discussion_prompt text,
  add column if not exists seo_quality_score integer,
  add column if not exists pre_publish_warnings text;
