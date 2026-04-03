"use client";

import { useState } from "react";
import {
  Database,
  GitBranch,
  Shield,
  Zap,
  Terminal,
  Layers,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "Supabase Integration",
    description: "Auth, database, and real-time built in. Type-safe queries powered by auto-generated TypeScript definitions.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Shield,
    title: "Auth & RLS Ready",
    description: "Login, signup, and role-based access out of the box. Row Level Security policies baked into every service.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: GitBranch,
    title: "Git-First Workflow",
    description: "Structured for clean commits, branch strategies, and AI-assisted code reviews via GitHub MCP.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Zap,
    title: "AI-Native Architecture",
    description: "Built for Vibe Coding. Describe what you want, and your AI builds it using your typed services and schema.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Terminal,
    title: "Checkpoint System",
    description: "One command to snapshot your database. Instant disaster recovery and environment cloning.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    description: "Separation of concerns by design. UI, services, types, and prompts — each in its own lane.",
    color: "text-blue-600 dark:text-blue-400",
  },
];

const TABS = [
  { id: "features", label: "Features", description: "Core Architecture" },
  { id: "supabase", label: "Supabase Test", description: "Database Status" },
  { id: "github", label: "GitHub Test", description: "MCP Integration" },
];

export function FeaturesTabs({ profiles, repos, currentRole }: { profiles: any[], repos: any[], currentRole?: string }) {
  const [active, setActive] = useState("features");

  return (
    <div className="w-full">
      {/* Simple TABS UI to match the restored aesthetic */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              active === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "border border-border bg-background text-muted-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "features" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-border bg-background hover:border-primary/30 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {active === "supabase" && (
        <div className="rounded-2xl border border-border bg-background p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Database className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Backend Status</h3>
                <p className="text-muted-foreground text-sm">Live snapshot of your centralized data cluster.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              CONNECTED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="md:col-span-3 p-6 rounded-xl border border-border bg-secondary/20">
               <div className="flex gap-4">
                 <Shield className="w-5 h-5 text-primary shrink-0 mt-1" />
                 <div>
                   <p className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">Security Check</p>
                   <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                     Only **ADMIN** users can modify data. Your current account role is <span className="text-primary font-bold px-2 py-0.5 rounded-md bg-primary/10 uppercase text-[10px]">{currentRole || "GUEST"}</span>.
                   </p>
                   {currentRole !== "admin" && (
                     <p className="text-xs italic text-muted-foreground">Ask your agent to promote this account to admin to enable editing features.</p>
                   )}
                 </div>
               </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-background flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Signals</p>
              <p className="text-4xl font-black text-foreground">{profiles?.length || 0}</p>
            </div>
          </div>

          {/* Profiles Table */}
          <div className="border border-border rounded-xl overflow-hidden bg-background">
            <div className="bg-secondary/30 px-6 py-3 border-b border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Database Profiles</p>
            </div>
            {profiles && profiles.length > 0 ? (
              <div className="divide-y divide-border">
                {profiles.map((p, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                       <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                         {(p.full_name || "U")[0].toUpperCase()}
                       </div>
                       <span className="font-bold text-foreground">{p.full_name || "Anonymous"}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-border text-muted-foreground">
                      {p.role || "user"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground">No records detected.</div>
            )}
          </div>
        </div>
      )}

      {active === "github" && (
        <div className="rounded-2xl border border-border bg-background p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <GitBranch className="w-7 h-7 text-violet-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">GitHub Integration</h3>
                <p className="text-muted-foreground text-sm">Validating MCP connectivity with your remote repositories.</p>
              </div>
            </div>
            <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline">
               Manage Access
            </a>
          </div>

          {repos && repos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.slice(0, 4).map((repo, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-all flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-violet-500">Repository</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2">{repo.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {repo.description || "No description provided."}
                  </p>
                  <a href={repo.html_url || "#"} className="mt-auto text-[10px] font-black uppercase text-primary hover:underline inline-flex items-center gap-1">
                    Check Status <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center border border-dashed border-border rounded-xl">
               <GitBranch className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
               <p className="text-muted-foreground text-sm font-medium">Verify your `GITHUB_TOKEN` in `.env.local` to enable fetching repositories.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
