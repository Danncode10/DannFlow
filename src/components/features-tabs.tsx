"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  GitBranch,
  Shield,
  Zap,
  Terminal,
  Layers,
  ExternalLink,
  ChevronRight,
  Code,
  Lock,
} from "lucide-react";



/**
 * Modern Dashboard System
 * Designed to be robust even in complex environments.
 */
const FEATURES = [
  {
    icon: Database,
    title: "Supabase Integration",
    description: "Auth, database, and real-time built in. Type-safe queries powered by auto-generated TypeScript definitions.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Auth & RLS Ready",
    description: "Login, signup, and role-based access out of the box. Row Level Security policies baked into every service.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: GitBranch,
    title: "Git-First Workflow",
    description: "Structured for clean commits, branch strategies, and AI-assisted code reviews via GitHub MCP.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Zap,
    title: "AI-Native Architecture",
    description: "Built for Vibe Coding. Describe what you want, and your AI builds it using your typed services and schema.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Terminal,
    title: "Checkpoint System",
    description: "One command to snapshot your database. Instant disaster recovery and environment cloning.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    description: "Separation of concerns by design. UI, services, types, and prompts — each in its own lane.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const GITHUB_PER_PAGE = 5;

function GithubRepoPaginated({ repos }: { repos: any[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(repos.length / GITHUB_PER_PAGE);
  const pageRepos = repos.slice(page * GITHUB_PER_PAGE, (page + 1) * GITHUB_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Creator attribution */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-secondary border border-border">
        <GitBranch className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
          Repositories of <span className="text-foreground font-black">Danncode10</span>, the creator of DannFlow.
          To show <span className="text-foreground font-black">your own repos</span>, edit{" "}
          <code className="bg-border px-1.5 py-0.5 rounded text-[10px]">src/lib/config.ts</code> → <code className="bg-border px-1.5 py-0.5 rounded text-[10px]">creatorRepos</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {pageRepos.map((repo: any, i: number) => (
          <a key={i} href={repo.url} target="_blank" rel="noreferrer" className="block group">
            <div className="group p-6 md:p-8 rounded-3xl md:rounded-5xl border border-border bg-card hover:border-primary/20 transition-all duration-300 flex flex-col h-full relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5">
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                  <GitBranch className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Repository</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors uppercase truncate">
                {repo.name}
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed font-semibold italic opacity-80 line-clamp-2">
                {repo.description || "No project manifest description available."}
              </p>
              <div className="mt-auto pt-5 border-t border-border flex items-center justify-between mt-5">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Access Code <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* [‹] 1 2 3 4 [›] */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-black"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-[12px] font-black transition-all border ${
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
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-black"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export function FeaturesTabs({
  profiles,
  repos,
  currentRole,
}: {
  profiles: any[];
  repos: any[];
  currentRole?: string;
}) {


  const [active, setActive] = useState("features");
  const [hovered, setHovered] = useState<string | null>(null);

  const TABS_CONFIG = [
    { id: "features", label: "Features", icon: Zap, count: FEATURES.length },
    {
      id: "supabase",
      label: "Supabase Live",
      icon: Database,
      count: profiles?.length || 0,
    },
    {
      id: "github",
      label: "GitHub MCP",
      icon: GitHubIcon,
      count: repos?.length || 0,
    },
  ];



  return (
    <div className="w-full">
      {/* ── Tabs Navigation ── */}
      <div className="flex justify-center mb-8 md:mb-16">
        <div className="flex p-1.5 rounded-full bg-secondary border border-border shadow-inner backdrop-blur-md relative overflow-x-auto no-scrollbar max-w-[calc(100vw-2rem)]">
          {TABS_CONFIG.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = active === tab.id;
            const isHovered = hovered === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                onMouseEnter={() => setHovered(tab.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isActive
                  ? "text-primary scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="modern-pill"
                    className="absolute inset-0 bg-card rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05),0_10px_20px_-5px_rgba(0,0,0,0.5)] z-0"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />

                )}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hover-pill"
                    className="absolute inset-0 bg-primary/10 rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <TabIcon
                    className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"
                      } transition-colors duration-300`}
                  />
                  {tab.label}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-normal transition-all duration-500 ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-border text-muted-foreground"
                      }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[500px] relative px-4">
        <AnimatePresence mode="wait">
          {/* Section: Features Grid */}
          {active === "features" && (
            <motion.div
              key="features-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className={`group bg-card p-6 md:p-10 rounded-3xl md:rounded-5xl border border-border shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] hover:border-primary/20 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] transition-all duration-500 relative overflow-hidden h-full flex flex-col ${i === 0 || i === 5 ? "lg:col-span-2" : ""
                    }`}
                >
                  <div
                    className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight leading-none uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed font-semibold italic opacity-90">
                    {feature.description}
                  </p>

                  {/* Premium Accents */}
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Section: Supabase Dashboard */}
          {active === "supabase" && (
            <motion.div
              key="supabase-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl md:rounded-5xl border border-border bg-card p-6 md:p-10 lg:p-14 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-10 mb-10 md:mb-12">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
                    <Database className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight uppercase italic leading-none">Supabase Orbit</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Satellite Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full lg:w-auto">
                  <div className="bg-secondary border border-border rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 flex flex-col flex-1 lg:min-w-[140px]">
                    <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Your Identity</span>
                    <span className="text-lg md:text-xl font-bold text-primary tracking-tight flex items-center gap-2 capitalize">

                      <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {currentRole || "User"}
                    </span>
                  </div>
                  <div className="bg-foreground border border-foreground rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 flex flex-col flex-1 lg:min-w-[140px] text-background">
                    <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Total Nodes</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight">{profiles?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-8 md:mb-10 flex gap-4 md:gap-6 items-start">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-base md:text-lg font-bold text-foreground mb-1 md:mb-2 tracking-tight uppercase">Row-Level Security Guard</h4>
                  <p className="text-muted-foreground text-[14px] md:text-[15px] leading-relaxed font-medium">
                    Your identity is encrypted by Supabase Auth and governed by strict RLS policies.
                    Only <strong className="text-primary">ADMIN</strong> role can edit data in this cluster.
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-3xl overflow-hidden bg-secondary/30">
                <div className="bg-secondary px-8 py-4 border-b border-border flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Profile Information</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Status</span>
                </div>

                {profiles && profiles.length > 0 ? (
                  <div className="divide-y divide-border bg-card">
                    {profiles.map((p, i) => (
                      <div key={i} className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between hover:bg-secondary transition-colors group gap-4">
                        <div className="flex items-center gap-3 md:gap-6 min-w-0">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-secondary text-primary flex items-center justify-center font-black text-base md:text-lg border border-border shrink-0">
                            {(p.full_name || "U")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm md:text-base font-bold text-foreground mb-0.5 md:mb-1 tracking-tight truncate">{p.full_name || "Anonymous identity"}</span>
                            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground font-mono tracking-tight opacity-70 italic truncate">{p.email || p.id?.slice(0, 24)}</span>
                          </div>
                        </div>
                        <span className={`px-2 md:px-4 py-1 rounded md:rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${p.role === 'admin' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card text-muted-foreground border-border'
                          }`}>
                          {p.role || "Standard"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center flex flex-col items-center justify-center grayscale opacity-40 bg-card">
                    <Database className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-bold text-muted-foreground italic">No nodes detected in cluster.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Section: GitHub Hub */}
          {active === "github" && (
            <motion.div
              key="github-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl md:rounded-5xl border border-border bg-card p-6 md:p-10 lg:p-14 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 md:mb-12">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-foreground rounded-xl md:rounded-2xl flex items-center justify-center text-background shadow-xl shrink-0">
                    <GitHubIcon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight uppercase italic leading-none">GitHub Hub</h3>
                    <span className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1.5 block">MCP Integration Core</span>
                  </div>
                </div>
                <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-secondary border border-border hover:bg-card transition-all text-[10px] md:text-xs font-black uppercase tracking-widest text-foreground hover:shadow-md w-full md:w-auto justify-center">
                  Deploy Connection <ExternalLink className="w-3 h-3 text-primary" />
                </a>
              </div>

              {repos && repos.length > 0 ? (
                <GithubRepoPaginated repos={repos} />
              ) : (
                <div className="p-32 text-center flex flex-col items-center border border-dashed border-border rounded-5xl bg-secondary/30 grayscale opacity-40">
                  <Code className="w-12 h-12 mb-6 text-muted-foreground" />
                  <p className="text-base font-bold text-muted-foreground italic">Initializing Manifests...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

