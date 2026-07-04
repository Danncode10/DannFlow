import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Newspaper } from "lucide-react";
import { listBlogPosts } from "@/services/blog";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;
const BLOG_PAGE_SIZE = 15;

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: `Tips, guides, and news from ${siteConfig.name}.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: `Tips, guides, and news from ${siteConfig.name}.`,
    url: "/blog",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: `Tips, guides, and news from ${siteConfig.name}.`,
  },
};

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

function pageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? 1) || 1);
  let posts: Awaited<ReturnType<typeof listBlogPosts>>["data"] = [];
  let total = 0;
  try {
    const result = await listBlogPosts({
      publishedOnly: true,
      page: currentPage,
      pageSize: BLOG_PAGE_SIZE,
    });
    posts = result.data;
    total = result.total;
  } catch {
    posts = [];
    total = 0;
  }
  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  if (total > 0 && currentPage > totalPages) redirect(pageHref(totalPages));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description: `Tips, guides, and news from ${siteConfig.name}.`,
    url: `${siteConfig.url}/blog`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
            Our Blog
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto">
            Tips, guides, and news from the team at {siteConfig.name}.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px] text-muted-foreground">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.image_alt_text || post.title}
                        width={640}
                        height={360}
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="text-[15px] font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto pt-3 border-t border-border">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(post.published_at ?? post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readingTime(post.content)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Blog pagination">
                <p className="text-center text-[13px] text-muted-foreground">
                  Page {safePage} of {totalPages} · {total} posts
                </p>
                <div className="flex max-w-full items-center justify-center gap-2 overflow-x-auto px-1 pb-1">
                  <Link
                    href={pageHref(Math.max(1, safePage - 1))}
                    aria-disabled={safePage === 1}
                    className={`min-h-12 shrink-0 inline-flex items-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium transition-colors ${
                      safePage === 1
                        ? "pointer-events-none bg-muted text-muted-foreground/40"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Link>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Link
                      key={page}
                      href={pageHref(page)}
                      aria-current={page === safePage ? "page" : undefined}
                      className={`h-12 w-12 shrink-0 inline-flex items-center justify-center rounded-lg border text-[13px] font-semibold transition-colors ${
                        page === safePage
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(Math.min(totalPages, safePage + 1))}
                    aria-disabled={safePage === totalPages}
                    className={`min-h-12 shrink-0 inline-flex items-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium transition-colors ${
                      safePage === totalPages
                        ? "pointer-events-none bg-muted text-muted-foreground/40"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
