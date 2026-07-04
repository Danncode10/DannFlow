import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { getPublishedBlogPost } from "@/services/blog";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  try {
    return await getPublishedBlogPost(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || `Read "${post.title}" on the ${siteConfig.name} blog.`;
  const imageAlt = post.image_alt_text || post.title;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: siteConfig.name,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url, alt: imageAlt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt || "",
    image: post.cover_image_url || undefined,
    keywords: post.primary_keyword || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    url: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Blog
        </Link>

        {post.cover_image_url && (
          <figure className="mb-8">
            <div className="rounded-2xl overflow-hidden aspect-video">
              <Image
                src={post.cover_image_url}
                alt={post.image_alt_text || post.title}
                width={1200}
                height={630}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            {(post.image_caption || post.pexels_credit_url) && (
              <figcaption className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                {post.image_caption}
                {post.image_caption && post.pexels_credit_url ? " " : null}
                {post.pexels_credit_url && (
                  <a
                    href={post.pexels_credit_url}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Image source
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        )}

        <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(post.published_at ?? post.created_at)}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime(post.content)} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        <div className="w-12 h-1 bg-primary rounded-full mb-8" />

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-[13px] text-muted-foreground mb-4">
            Ready to get started? Get in touch today.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </article>
    </>
  );
}
