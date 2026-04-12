"use client"

import * as React from "react"
import {
  Database,
  GitBranch,
  Terminal,
  Sparkles,
  User,
  Shield,
  Edit3,
  BookOpen,
  Activity,
  Code2,
  Lock,
  Settings,
  ShieldCheck
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/config"
import { ProfileForm } from "./profile-form"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getVibeCheckDataPaginated } from "@/services/dashboard"
import { useInView } from "react-intersection-observer"
import { BentoSkeleton } from "./dashboard/bento-skeleton"
import { useRouter, useSearchParams } from "next/navigation"
import { SecurityForm } from "./security-form"

import { PillTabs } from "@/components/ui/pill-tabs"

const REPOS_PER_PAGE = 5;

function RepoPagination({ repos }: { repos: any[] }) {
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE);
  const pageRepos = repos.slice(page * REPOS_PER_PAGE, (page + 1) * REPOS_PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Creator description banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-secondary border border-border">
        <GitBranch className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
          These are the public repositories of <span className="text-foreground font-black">Danncode10</span>, the creator of DannFlow.
          To show <span className="text-foreground font-black">your own repos</span>, edit{" "}
          <code className="bg-border px-1.5 py-0.5 rounded text-[10px]">src/lib/config.ts</code> → <code className="bg-border px-1.5 py-0.5 rounded text-[10px]">creatorRepos</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pageRepos.map((repo: any, i: number) => (
          <a key={i} href={repo.url} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="bg-card text-card-foreground border border-border group-hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm rounded-3xl h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono text-foreground group-hover:text-primary transition-colors uppercase truncate pr-2">
                  {repo.name}
                </CardTitle>
                <GitBranch className="w-4 h-4 text-muted-foreground group-hover:text-primary/70 shrink-0" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-2">
                  "{repo.description || "No mission statement."}"
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Pagination — [<] 1 2 3 [>] */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-black"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-black transition-all border ${
                page === i
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-black"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

interface DashboardShellProps {
  profiles: any[]
  user: any
  profile: any
  repos: any[]
}

export function DashboardShell({ profiles, user, profile, repos }: DashboardShellProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "overview"
  const [activeTab, setActiveTabLocal] = React.useState(initialTab)

  const setActiveTab = (tab: string) => {
    setActiveTabLocal(tab)
    router.push(`/dashboard?tab=${tab}`, { scroll: false })
  }

  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['profiles-db'],
    queryFn: ({ pageParam = 0 }) => getVibeCheckDataPaginated({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length === 5 ? allPages.length : undefined,
    initialData: { pages: [profiles], pageParams: [0] }
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const displayProfiles = data?.pages.flat() || profiles;

  const DASHBOARD_TABS = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "database", label: "Database", icon: Database },
    { id: "code", label: "Code", icon: Code2 },
    { id: "docs", label: "Docs", icon: BookOpen },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <PillTabs items={DASHBOARD_TABS} active={activeTab} onChange={setActiveTab} className="mb-0" />


        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 gap-1 px-3 py-1">
              <Lock className="w-3 h-3" />
              Admin Mode
            </Badge>
          )}
          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
            v1.1.0-alpha
          </Badge>
        </div>
      </div>

      {/* 1. Overview Tab */}
      <TabsContent value="overview" className="space-y-12 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <Card className="col-span-1 md:col-span-4 bg-card text-card-foreground border border-border shadow-sm hover:scale-[1.01] transition-all group rounded-3xl rounded-tl-xl p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-tighter">Supabase Engine</CardTitle>
              <Database className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">Active</div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">Live Sync: Enabled</p>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-4 bg-card text-card-foreground border border-border shadow-sm hover:scale-[1.01] transition-all group rounded-3xl p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-tighter">GitHub Context</CardTitle>
              <GitBranch className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">Indexed</div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">Repo: {siteConfig.name}-v2</p>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-4 bg-card text-card-foreground border border-border shadow-sm hover:scale-[1.01] transition-all group rounded-3xl rounded-tr-xl p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-tighter">Terminal MCP</CardTitle>
              <Terminal className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">Ready</div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">Execution Level: 100%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-10 md:p-14">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="w-24 h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center shrink-0">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter">The Software Engineering Edge</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl tracking-tight">
                  "{siteConfig.name} is designed for architects who treat AI as a first-class collaborator. By structuring your project around the <span className="text-foreground font-medium">Trinity Model</span> (DB, Code, Terminal), you reduce cognitive load and maximize throughput. Every file exists for a reason, and every reason is typed."
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-border py-1.5 px-4 rounded-full">Modular Architecture</Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-border py-1.5 px-4 rounded-full">Type-Safe Services</Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-border py-1.5 px-4 rounded-full">AI-Native Workflow</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>


      {/* 2. Database Tab */}
      <TabsContent value="database" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">Database Orchestration</h2>
          <p className="text-sm text-muted-foreground">Real-time sync with <span className="font-mono text-foreground/80">public.profiles</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProfiles.length > 0 ? (
            displayProfiles.map((p: any, i: number) => (
              <Card key={i} className="bg-card text-card-foreground border border-border hover:bg-card/90 transition-all group relative shadow-sm rounded-3xl">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{p.email || 'Anonymous'}</CardTitle>
                    <CardDescription className="text-[10px] font-mono uppercase tracking-widest">{p.role || 'user'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${p.role === 'admin' ? 'bg-primary' : 'bg-primary/50'} w-3/4`}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Integrity</span>
                    <span>99.9%</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 bg-secondary border border-dashed border-border rounded-3xl flex flex-col items-center text-center">
              <Database className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-mono">No database records found.</p>
            </div>
          )}
        </div>

        {isFetchingNextPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <BentoSkeleton />
            <BentoSkeleton />
            <BentoSkeleton />
          </div>
        )}

        <div ref={ref} className="h-4 w-full mt-4 flex items-center justify-center" />
      </TabsContent>

      {/* 3. Code Tab */}
      <TabsContent value="code" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-foreground">Version Control Context</h2>
            <p className="text-sm text-muted-foreground">AI-indexed repository history and active modules</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground self-start sm:self-auto">
            {repos.length} repositories indexed
          </span>
        </div>

        <RepoPagination repos={repos} />
      </TabsContent>

      {/* 4. Docs Tab */}
      <TabsContent value="docs" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">Internal Documentation</h2>
          <p className="text-sm text-muted-foreground">The architectural wisdom of the {siteConfig.name} ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Trinity Model */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                The Trinity Model
              </CardTitle>
              <CardDescription>Eyes, Blueprint, and Action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2 marker:text-foreground/50">
                <li><span className="text-foreground font-semibold">The Eyes:</span> Typed definitions that mirror your cloud database state via <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">src/types/supabase.ts</code>.</li>
                <li><span className="text-foreground font-semibold">The Blueprint:</span> Timestamped SQL savepoints in <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">supabase/backups/</code> for disaster recovery.</li>
                <li><span className="text-foreground font-semibold">The Action:</span> Pure business logic isolated in <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">src/services/</code>, never in UI components.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Vibe Coding Workflow */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Vibe Coding Workflow
              </CardTitle>
              <CardDescription>How to work with the AI architect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li><span className="text-foreground font-semibold">1. Check Point:</span> Run <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">npm run checkpoint</code> before big changes.</li>
                <li><span className="text-foreground font-semibold">2. Sync Types:</span> After any schema change, run <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">npm run update-types</code>.</li>
                <li><span className="text-foreground font-semibold">3. Diagnostic:</span> Use the MCP Diagnostic Protocol in <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">AGENTS.md</code> when tools disconnect.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Password Recovery Flow */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Password Recovery
              </CardTitle>
              <CardDescription>Forgot password end-to-end flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li><span className="text-foreground font-semibold">/forgot-password:</span> Collects email and triggers Supabase <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">resetPasswordForEmail</code> via Gmail SMTP.</li>
                <li><span className="text-foreground font-semibold">/reset-password:</span> Session-guarded — only renders the form if a valid Supabase auth token is present. Expired links show a clear "Link Expired" state.</li>
                <li><span className="text-foreground font-semibold">Toasts:</span> Sonner notifications confirm every step of the flow.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Re-authentication & password management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li><span className="text-foreground font-semibold">Re-auth Gate:</span> Dashboard password changes require the current password first — verified via a silent <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">signInWithPassword</code> before <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">updateUser</code>.</li>
                <li><span className="text-foreground font-semibold">Visibility Toggles:</span> All password fields have Eye/EyeOff icons for improved UX.</li>
                <li><span className="text-foreground font-semibold">Gmail Alert:</span> Enable the "Password Change" Supabase email template to trigger automatic Gmail security notifications on every successful update.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Gmail SMTP */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Gmail SMTP Setup
              </CardTitle>
              <CardDescription>Free email authentication for production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li><span className="text-foreground font-semibold">App Password:</span> Enable 2-Step Verification in Google, then generate a 16-char App Password.</li>
                <li><span className="text-foreground font-semibold">Supabase SMTP:</span> Host <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">smtp.gmail.com</code>, Port <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">465</code>.</li>
                <li><span className="text-foreground font-semibold">Templates:</span> Enable "Password Change" and "Reset Password" templates in Auth → Email Templates.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Performance Stack
              </CardTitle>
              <CardDescription>Caching, pagination & rate limiting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li><span className="text-foreground font-semibold">TanStack Query:</span> Client-side caching with optimistic mutations — zero redundant fetches on tab navigation.</li>
                <li><span className="text-foreground font-semibold">Cursor Pagination:</span> <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">useInfiniteQuery</code> + Intersection Observer for infinite scrolling.</li>
                <li><span className="text-foreground font-semibold">Rate Limiting:</span> Upstash Redis sliding-window via <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded font-mono">verifyRateLimit()</code> on all server actions.</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </TabsContent>

      {/* 5. Security Tab */}
      <TabsContent value="security" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center w-full py-6 md:py-12">
          <Card className="bg-card text-card-foreground border border-border p-6 md:p-12 max-w-2xl w-full shadow-sm rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-accent opacity-30" />
            <SecurityForm />
          </Card>
        </div>
      </TabsContent>

      {/* 6. Settings Tab */}
      <TabsContent value="settings" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center w-full py-6 md:py-12">
          <Card className="bg-card text-card-foreground border border-border p-6 md:p-12 max-w-2xl w-full shadow-sm rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-accent opacity-30" />
            <ProfileForm profile={profile} />
          </Card>
        </div>
      </TabsContent>

    </Tabs>



  )
}
