import Link from "next/link"
import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  children: ReactNode
  showBrandPanel?: boolean
  className?: string
}

const highlights = [
  "Next.js 15 and Supabase auth built in",
  "Rate-limited email flows",
  "OAuth-ready callback handling",
  "Production setup docs included",
]

export function AuthShell({
  children,
  showBrandPanel = true,
  className,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-fade-overlay" />

      <div className="relative flex flex-1 flex-col lg:flex-row">
        {showBrandPanel ? (
          <aside className="hidden w-[26rem] shrink-0 border-r border-border px-10 py-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link href="/" className="mb-14 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold text-primary">
                  D
                </span>
                <span className="text-lg font-bold tracking-tight">
                  {siteConfig.name}
                </span>
                <span className="rounded-md border border-border bg-muted px-2 py-1 text-[0.65rem] font-semibold text-primary">
                  v2.0
                </span>
              </Link>

              <div className="space-y-4">
                <h1 className="max-w-xs text-4xl font-bold leading-tight tracking-tight">
                  Ship your idea. Not boilerplate.
                </h1>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  A focused starter for builders who want auth, database, docs,
                  and deployment paths to feel calm from day one.
                </p>
              </div>

              <div className="mt-9 space-y-3">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">
                Auth system ready for client projects
              </span>
            </div>
          </aside>
        ) : null}

        <section
          className={cn(
            "flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10",
            className
          )}
        >
          {children}
        </section>
      </div>

      <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/80 px-4 py-3 text-xs text-muted-foreground sm:px-10">
        <span>2026 {siteConfig.name}</span>
        <nav className="flex items-center gap-5">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
        </nav>
      </footer>
    </main>
  )
}
