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
  Settings
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/config"
import { ProfileForm } from "./profile-form"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getVibeCheckDataPaginated } from "@/services/dashboard"

import { PillTabs } from "@/components/ui/pill-tabs"

interface DashboardShellProps {
  profiles: any[]
  user: any
  profile: any
  repos: any[]
}

export function DashboardShell({ profiles, user, profile, repos }: DashboardShellProps) {
  const [activeTab, setActiveTab] = React.useState("overview")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['profiles-db'],
    queryFn: ({ pageParam = 0 }) => getVibeCheckDataPaginated({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length === 5 ? allPages.length : undefined,
    initialData: { pages: [profiles], pageParams: [0] }
  });

  const displayProfiles = data?.pages.flat() || profiles;

  const DASHBOARD_TABS = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "database", label: "Database", icon: Database },
    { id: "code", label: "Code", icon: Code2 },
    { id: "docs", label: "Docs", icon: BookOpen },
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
        
        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
               onClick={() => fetchNextPage()}
               disabled={isFetchingNextPage}
               className="px-6 py-2.5 rounded-full bg-secondary text-foreground text-sm font-bold uppercase tracking-widest hover:bg-card border border-border transition-all cursor-pointer shadow-sm active:scale-95"
            >
               {isFetchingNextPage ? 'Retrieving...' : 'Load Additional Nodes'}
            </button>
          </div>
        )}
      </TabsContent>

      {/* 3. Code Tab */}
      <TabsContent value="code" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">Version Control Context</h2>
          <p className="text-sm text-muted-foreground">AI-indexed repository history and active modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo: any, i: number) => (
            <a key={i} href={repo.url} target="_blank" rel="noopener noreferrer" className="block group">
              <Card className="bg-card text-card-foreground border border-border group-hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-mono text-foreground group-hover:text-primary transition-colors uppercase">{repo.name}</CardTitle>
                  <GitBranch className="w-4 h-4 text-muted-foreground group-hover:text-primary/70" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-1">"{repo.description || "No mission statement."}"</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </TabsContent>

      {/* 4. Docs Tab */}
      <TabsContent value="docs" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">Internal Documentation</h2>
          <p className="text-sm text-muted-foreground">The architectural wisdom of the {siteConfig.name} ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                The Trinity Model
              </CardTitle>
              <CardDescription>Understanding Eyes, Blueprint, and Action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                To maintain high velocity, we divide our system into three layers:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-foreground/50">
                <li><span className="text-foreground font-medium tracking-tight">The Eyes:</span> Typed definitions that mirror your cloud database state.</li>
                <li><span className="text-foreground font-medium tracking-tight">The Blueprint:</span> Timestamped SQL savepoints for instant disaster recovery.</li>
                <li><span className="text-foreground font-medium tracking-tight">The Action:</span> Pure business logic isolated from UI components.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border border-border shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Vibe Coding Workflow
              </CardTitle>
              <CardDescription>How to dance with the AI architect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                1. **Check Point**: Always run `npm run checkpoint` before big changes.
              </p>
              <p>
                2. **Sync Types**: After modifying the database, run `npm run update-types`.
              </p>
              <p>
                3. **Diagnostic**: Use the Diagnostic Protocol in `AGENTS.md` whenever tools feel disconnected.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* 5. Settings Tab */}
      <TabsContent value="settings" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center w-full py-16">
          <Card className="bg-card text-card-foreground border border-border p-8 md:p-14 max-w-2xl w-full shadow-sm rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-accent opacity-30" />
            <ProfileForm profile={profile} />
          </Card>
        </div>
      </TabsContent>

    </Tabs>



  )
}
