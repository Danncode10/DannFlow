#!/usr/bin/env node

import fs from "node:fs/promises";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const MAX_BLOG_COUNT = 5;
const BLOG_TABLE = process.env.BLOG_POSTS_TABLE || "blog_posts";
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "business-template";
const ADMIN_ORIGIN = process.env.BLOG_ADMIN_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const PUBLIC_ORIGIN = process.env.BLOG_PUBLIC_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ADMIN_EDIT_PATH_TEMPLATE = process.env.BLOG_ADMIN_EDIT_PATH_TEMPLATE || "/dashboard/blog/{id}";
const PUBLIC_BASE_PATH = process.env.BLOG_PUBLIC_BASE_PATH || "/blog";
const ORGANIZATION_ID = process.env.BLOG_POST_ORGANIZATION_ID || "";
const EXTRA_COLUMNS = new Set(
  (process.env.BLOG_POST_EXTRA_COLUMNS || "")
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean),
);

const OPTIONAL_EXTRA_FIELDS = [
  "image_alt_text",
  "image_caption",
  "pexels_credit_url",
  "primary_keyword",
  "search_intent",
  "internal_links",
  "facebook_caption",
  "reddit_discussion_prompt",
  "seo_quality_score",
  "pre_publish_warnings",
];

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function assertText(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required blog field: ${field}`);
  }

  return value.trim();
}

function normalizeOrigin(value) {
  return value.replace(/\/+$/g, "");
}

function pathFromTemplate(template, post) {
  return template
    .replaceAll("{id}", post.id)
    .replaceAll("{slug}", post.slug);
}

function joinUrl(origin, path) {
  const cleanOrigin = normalizeOrigin(origin);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanOrigin}${cleanPath}`;
}

async function readInput() {
  const inputPath = process.argv[2];
  const raw = inputPath
    ? await fs.readFile(inputPath, "utf8")
    : await new Promise((resolve, reject) => {
        let data = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (chunk) => {
          data += chunk;
        });
        process.stdin.on("end", () => resolve(data));
        process.stdin.on("error", reject);
      });

  if (!raw.trim()) {
    throw new Error("Pass a JSON file path or pipe a JSON payload to stdin.");
  }

  return JSON.parse(raw);
}

async function ensureUniqueSlug(supabase, slug) {
  let candidate = slug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from(BLOG_TABLE)
      .select("id")
      .eq("app_id", APP_ID)
      .eq("slug", candidate)
      .maybeSingle();

    if (error) throw error;
    if (!data) return candidate;

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
}

function pickWarnings(post) {
  if (Array.isArray(post.pre_publish_warnings)) {
    return post.pre_publish_warnings.join("\n");
  }

  return post.pre_publish_warnings;
}

function pickExtraValue(post, field) {
  if (field === "pre_publish_warnings") {
    return pickWarnings(post)?.trim() || null;
  }

  if (field === "seo_quality_score") {
    return Number.isFinite(post.seo_quality_score) ? post.seo_quality_score : null;
  }

  return post[field]?.trim?.() || null;
}

function buildInsertPayload(post, title, slug, contentHtml) {
  const now = new Date().toISOString();
  const payload = {
    app_id: APP_ID,
    title,
    slug,
    excerpt: post.excerpt?.trim() || null,
    content: String(contentHtml),
    cover_image_url: post.cover_image_url?.trim() || null,
    seo_title: post.seo_title?.trim() || null,
    seo_description: post.seo_description?.trim() || null,
    is_published: true,
    published_at: now,
  };

  if (ORGANIZATION_ID) {
    payload.organization_id = ORGANIZATION_ID;
  }

  for (const field of OPTIONAL_EXTRA_FIELDS) {
    if (EXTRA_COLUMNS.has(field)) {
      payload[field] = pickExtraValue(post, field);
    }
  }

  return payload;
}

async function main() {
  const input = await readInput();
  const posts = Array.isArray(input) ? input : [input];
  if (posts.length === 0) throw new Error("At least one blog post is required.");
  if (posts.length > MAX_BLOG_COUNT) {
    throw new Error(`blog_count cannot exceed ${MAX_BLOG_COUNT}. Received ${posts.length}.`);
  }

  const supabase = createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const published = [];
  for (const post of posts) {
    const title = assertText(post.title, "title");
    const baseSlug = slugify(post.slug || title);
    const contentMarkdown = post.content_markdown ?? post.content;
    const contentHtml =
      post.content_html ?? marked.parse(assertText(contentMarkdown, "content_markdown"), { async: false });
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

    const { data, error } = await supabase
      .from(BLOG_TABLE)
      .insert(buildInsertPayload(post, title, uniqueSlug, contentHtml))
      .select("id, slug, title")
      .single();

    if (error) throw error;

    const pexelsKeyword = post.pexels_keyword?.trim() || "professional workspace planning";
    const pexelsDescription = post.pexels_description?.trim() || pexelsKeyword;
    const adminPath = pathFromTemplate(ADMIN_EDIT_PATH_TEMPLATE, data);
    const publicPath = `${PUBLIC_BASE_PATH.replace(/\/+$/g, "")}/${data.slug}`;
    const warnings = pickWarnings(post)?.trim() || "";

    published.push({
      id: data.id,
      title: data.title,
      slug: data.slug,
      edit_url: joinUrl(ADMIN_ORIGIN, adminPath),
      public_url: joinUrl(PUBLIC_ORIGIN, publicPath),
      pexels_keyword: pexelsKeyword,
      pexels_description: pexelsDescription,
      seo_quality_score: Number.isFinite(post.seo_quality_score) ? post.seo_quality_score : null,
      pre_publish_warnings: warnings,
      facebook_caption: post.facebook_caption?.trim() || "",
      reddit_discussion_prompt: post.reddit_discussion_prompt?.trim() || "",
    });
  }

  console.log(
    JSON.stringify(
      {
        count: published.length,
        table: BLOG_TABLE,
        app_id: APP_ID,
        posts: published,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
