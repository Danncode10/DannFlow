import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getBlogPostById } from "@/services/blog";
import { requireSuperAdmin } from "@/services/superAdmin";

type Platform = "facebook" | "reddit";

type PublishBody = {
  postId?: string;
  platform?: Platform;
  caption?: string;
};

function missingEnv(names: string[]) {
  return names.filter((name) => !process.env[name]);
}

function configuredError(platform: Platform, missing: string[]) {
  return NextResponse.json(
    {
      error: `${platform === "facebook" ? "Facebook" : "Reddit"} API is not configured yet.`,
      missing,
    },
    { status: 503 },
  );
}

async function publishToFacebook(message: string, blogUrl: string) {
  const missing = missingEnv(["FACEBOOK_PAGE_ID", "FACEBOOK_PAGE_ACCESS_TOKEN"]);
  if (missing.length) return { ok: false as const, missing };

  const version = process.env.FACEBOOK_GRAPH_API_VERSION || "v23.0";
  const pageId = process.env.FACEBOOK_PAGE_ID!;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;
  const endpoint = `https://graph.facebook.com/${version}/${pageId}/feed`;

  const body = new URLSearchParams({
    access_token: pageAccessToken,
    message,
    link: blogUrl,
  });

  const response = await fetch(endpoint, { method: "POST", body });
  const result = await response.json();
  if (!response.ok) {
    const detail = result?.error?.message || "Facebook rejected the post.";
    throw new Error(detail);
  }

  let url = result?.id ? `https://www.facebook.com/${result.id}` : `https://www.facebook.com/${pageId}`;
  if (result?.id) {
    const permalinkResponse = await fetch(
      `https://graph.facebook.com/${version}/${result.id}?fields=permalink_url&access_token=${encodeURIComponent(pageAccessToken)}`,
    );
    if (permalinkResponse.ok) {
      const permalink = await permalinkResponse.json();
      if (permalink?.permalink_url) url = permalink.permalink_url;
    }
  }

  return { ok: true as const, id: String(result.id || ""), url };
}

async function getRedditAccessToken() {
  const missing = missingEnv([
    "REDDIT_CLIENT_ID",
    "REDDIT_CLIENT_SECRET",
    "REDDIT_REFRESH_TOKEN",
    "REDDIT_USER_AGENT",
  ]);
  if (missing.length) return { ok: false as const, missing };

  const credentials = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": process.env.REDDIT_USER_AGENT!,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.REDDIT_REFRESH_TOKEN!,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.access_token) {
    throw new Error(result?.message || "Reddit rejected the OAuth refresh token.");
  }

  return { ok: true as const, accessToken: String(result.access_token) };
}

async function publishToReddit(title: string, blogUrl: string) {
  const missing = missingEnv(["REDDIT_SUBREDDIT"]);
  if (missing.length) return { ok: false as const, missing };

  const tokenResult = await getRedditAccessToken();
  if (!tokenResult.ok) return tokenResult;

  const response = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenResult.accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": process.env.REDDIT_USER_AGENT!,
    },
    body: new URLSearchParams({
      api_type: "json",
      extension: "json",
      kind: "link",
      resubmit: "true",
      sendreplies: "true",
      sr: process.env.REDDIT_SUBREDDIT!,
      title,
      url: blogUrl,
    }),
  });

  const result = await response.json();
  const errors = result?.json?.errors;
  if (!response.ok || (Array.isArray(errors) && errors.length > 0)) {
    const detail = Array.isArray(errors) && errors[0]?.[1]
      ? errors[0][1]
      : result?.message || "Reddit rejected the post.";
    throw new Error(detail);
  }

  const data = result?.json?.data || {};
  const url =
    data.url ||
    data.permalink ||
    data.user_submitted_page ||
    (process.env.REDDIT_USERNAME
      ? `https://www.reddit.com/user/${process.env.REDDIT_USERNAME}/submitted/`
      : `https://www.reddit.com/r/${process.env.REDDIT_SUBREDDIT}/new/`);

  return { ok: true as const, id: String(data.name || data.id || ""), url };
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const body = (await req.json()) as PublishBody;
    if (!body.postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }
    if (body.platform !== "facebook" && body.platform !== "reddit") {
      return NextResponse.json({ error: "platform must be facebook or reddit" }, { status: 400 });
    }

    const post = await getBlogPostById(body.postId);
    if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    if (!post.is_published) {
      return NextResponse.json({ error: "Publish the blog post before posting to social media." }, { status: 400 });
    }

    const blogUrl = `${siteConfig.url}/blog/${post.slug}`;
    const caption = body.caption?.trim();

    if (body.platform === "facebook") {
      const facebookResult = await publishToFacebook(
        caption || post.facebook_caption || `${post.title}\n\n${blogUrl}`,
        blogUrl,
      );
      if (!facebookResult.ok) return configuredError("facebook", facebookResult.missing);
      return NextResponse.json({ platform: "facebook", ...facebookResult });
    }

    const redditResult = await publishToReddit(
      caption || post.reddit_discussion_prompt || post.title,
      blogUrl,
    );
    if (!redditResult.ok) return configuredError("reddit", redditResult.missing);
    return NextResponse.json({ platform: "reddit", ...redditResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Social publishing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
