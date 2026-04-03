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
  Activity,
  Code2,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "Supabase Integration",
    description: "Auth, database, and real-time built in. Type-safe queries powered by auto-generated TypeScript definitions.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Auth & RLS Ready",
    description: "Login, signup, and role-based access out of the box. Row Level Security policies baked into every service.",
    color: "text-blue-600",
    bg: "bg-blue-50",
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

const TABS = [
  { id: "features", label: "Features", icon: Zap },
  { id: "supabase", label: "Supabase Live", icon: Database },
  { id: "github", label: "GitHub MCP", icon: Code2 },
];

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function FeaturesTabs({ profiles, repos, currentRole }: { profiles: any[], repos: any[], currentRole?: string }) {
  const [active, setActive] = useState("features");

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* ── Modern Tabs Control ── */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200 shadow-sm backdrop-blur-md">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${
                  isActive ? "text-primary" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-active"
                    className="absolute inset-0 bg-white rounded-xl shadow-lg border border-slate-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <TabIcon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content View ── */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {active === "features" && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
                  >
                    <div className={`h-12 w-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-[15px] font-medium opacity-80">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}

          {active === "supabase" && (
            <motion.div
              key="supabase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[3rem] border border-slate-100 bg-white p-10 lg:p-14 shadow-2xl overflow-hidden shadow-blue-500/5"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                    <Database className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Supabase Orbit</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Integration</span>
                    </div>
                  </div>
                </div>
                <div className="glass px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Active User Role</span>
                  <span className="text-lg font-black text-blue-600 uppercase tracking-tight">{currentRole || "User"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-3 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex gap-6">
                  <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-2">Live Row-Level Security Access</p>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      Your identity is validated by Supabase Auth and governed by RLS policies. 
                      Only an <strong className="text-blue-600">ADMIN</strong> can promote users or modify system configurations.
                    </p>
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                  <Users className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Total Users</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tight">{profiles?.length || 0}</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-3xl overflow-hidden">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Profile Information</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Account Status</span>
                </div>
                {profiles && profiles.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {profiles.map((p, i) => (
                      <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">
                            {(p.full_name || "U")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{p.full_name || "Anonymous"}</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-tight font-mono">{p.email || p.id?.slice(0, 16)}</span>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          p.role === 'admin' 
                            ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}>
                          {p.role || "User"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center text-slate-400 italic">No records detected in this cluster.</div>
                )}
              </div>
            </motion.div>
          )}

          {active === "github" && (
            <motion.div
              key="github"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[3rem] border border-slate-100 bg-white p-10 lg:p-14 shadow-2xl shadow-indigo-500/5"
            >
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white">
                    <GithubLogo className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight italic">GitHub MCP</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Source Control Intelligence</p>
                  </div>
                </div>
                <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="flex items-center gap-2 group px-6 py-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-all font-bold text-[10px] tracking-widest uppercase">
                  <span>Manage Access</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>
              </div>

              {repos && repos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {repos.slice(0, 4).map((repo, i) => (
                    <div key={i} className="group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full relative">
                      <div className="flex items-center justify-between mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                          <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-50 px-4 py-1.5 rounded-full">Remote Signal</span>
                      </div>
                      
                      <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{repo.name}</h4>
                      <p className="text-slate-600 leading-relaxed h-12 line-clamp-2 italic font-medium opacity-80 mb-10">
                        {repo.description || "No project manifest description available."}
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                        <a href={repo.html_url || "#"} className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                          Source Code <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-24 text-center flex flex-col items-center border border-dashed border-slate-200 rounded-[3rem] bg-slate-50 opacity-60">
                   <GitBranch className="w-12 h-12 mb-6 text-slate-300" />
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Source Connections Active</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
