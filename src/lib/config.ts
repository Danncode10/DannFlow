export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "DannFlow",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Danncode10",
  description: "The backbone template for your next million-dollar idea.",
} as const;
