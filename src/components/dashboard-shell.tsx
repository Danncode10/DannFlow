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
  Lock
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardShellProps {
  profiles: any[]
  user: any
  profile: any
  repos: any[]
}

export function DashboardShell({ profiles, user, profile, repos }: DashboardShellProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <TabsList className="bg-neutral-900/50 border border-neutral-800 p-1 h-12">
          <TabsTrigger value="overview" className="gap-2 px-4">
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2 px-4">
            <Database className="w-4 h-4" />
            <span>Database</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2 px-4">
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="gap-2 px-4">
            <BookOpen className="w-4 h-4" />
            <span>Docs</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/10 gap-1 px-3 py-1">
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
      <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">Supabase Engine</CardTitle>
              <Database className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">Live Sync: Enabled</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">GitHub Context</CardTitle>
              <GitBranch className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Indexed</div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">Repo: DannFlow-v2</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">Terminal MCP</CardTitle>
              <Terminal className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ready</div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">Execution Level: 100%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-neutral-900/20 border-neutral-800/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-10 h-10 text-neutral-600 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-200">The Software Engineering Edge</h3>
                <p className="text-neutral-500 leading-relaxed max-w-4xl italic">
                  "DannFlow is designed for architects who treat AI as a first-class collaborator. By structuring your project around the <span className="text-neutral-300">Trinity Model</span> (DB, Code, Terminal), you reduce cognitive load and maximize throughput. Every file exists for a reason, and every reason is typed."
                </p>
                <div className="flex gap-4">
                  <Badge variant="secondary">Modular Architecture</Badge>
                  <Badge variant="secondary">Type-Safe Services</Badge>
                  <Badge variant="secondary">AI-Native Workflow</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 2. Database Tab */}
      <TabsContent value="database" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-neutral-200">Database Orchestration</h2>
          <p className="text-sm text-neutral-500">Real-time sync with <span className="font-mono text-neutral-400">public.profiles</span></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.length > 0 ? (
            profiles.map((p: any, i: number) => (
              <Card key={i} className="bg-neutral-900/30 border-neutral-800/50 hover:bg-neutral-900/60 transition-all group relative">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{p.email || 'Anonymous'}</CardTitle>
                    <CardDescription className="text-[10px] font-mono uppercase tracking-widest">{p.role || 'user'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full ${p.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'} w-3/4`}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-neutral-600">
                    <span>Integrity</span>
                    <span>99.9%</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl flex flex-col items-center text-center">
              <Database className="w-12 h-12 text-neutral-800 mb-4" />
              <p className="text-neutral-500 font-mono">No database records found.</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* 3. Code Tab */}
      <TabsContent value="code" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-neutral-200">Version Control Context</h2>
          <p className="text-sm text-neutral-500">AI-indexed repository history and active modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo: any, i: number) => (
            <a key={i} href={repo.url} target="_blank" rel="noopener noreferrer" className="block group">
              <Card className="bg-neutral-900/30 border-neutral-800/50 group-hover:border-blue-900/50 hover:bg-neutral-900/60 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-mono text-neutral-300 group-hover:text-blue-400 transition-colors uppercase">{repo.name}</CardTitle>
                  <GitBranch className="w-4 h-4 text-neutral-700 group-hover:text-blue-500/50" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-500 leading-relaxed italic line-clamp-1">"{repo.description || "No mission statement."}"</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </TabsContent>

      {/* 4. Docs Tab */}
      <TabsContent value="docs" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-neutral-200">Internal Documentation</h2>
          <p className="text-sm text-neutral-500">The architectural wisdom of the DannFlow ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                The Trinity Model
              </CardTitle>
              <CardDescription>Understanding Eyes, Blueprint, and Action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-neutral-400 leading-relaxed">
              <p>
                To maintain high velocity, we divide our system into three layers:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-neutral-700">
                <li><span className="text-neutral-200 font-medium tracking-tight">The Eyes:</span> Typed definitions that mirror your cloud database state.</li>
                <li><span className="text-neutral-200 font-medium tracking-tight">The Blueprint:</span> Timestamped SQL savepoints for instant disaster recovery.</li>
                <li><span className="text-neutral-200 font-medium tracking-tight">The Action:</span> Pure business logic isolated from UI components.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-orange-500" />
                Vibe Coding Workflow
              </CardTitle>
              <CardDescription>How to dance with the AI architect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-neutral-400 leading-relaxed">
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
    </Tabs>
  )
}
