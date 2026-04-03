"use client";

import { useState } from "react";
import {
  Database,
  GitBranch,
  Shield,
  Zap,
  Terminal,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ─── Features data lives here (client-side only) ───────────────────────────
const FEATURES = [
  {
    icon: Database,
    title: "Supabase Integration",
    description: "Auth, database, and real-time built in. Type-safe queries powered by auto-generated TypeScript definitions.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Auth & RLS Ready",
    description: "Login, signup, and role-based access out of the box. Row Level Security policies baked into every service.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitBranch,
    title: "Git-First Workflow",
    description: "Structured for clean commits, branch strategies, and AI-assisted code reviews via GitHub MCP.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "AI-Native Architecture",
    description: "Built for Vibe Coding. Describe what you want, and your AI builds it using your typed services and schema.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Terminal,
    title: "Checkpoint System",
    description: "One command to snapshot your database. Instant disaster recovery and environment cloning.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    description: "Separation of concerns by design. UI, services, types, and prompts — each in its own lane.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

const TABS = [
  { id: "features", label: "Features" },
  { id: "supabase", label: "Supabase Test" },
  { id: "github", label: "GitHub Test" },
];

// ─── Types ──────────────────────────────────────────────────────────────────
interface Profile {
  id?: string;
  full_name?: string;
  email?: string;
  role?: string;
}

interface Repo {
  id?: number | string;
  name: string;
  description?: string;
  private?: boolean;
  html_url?: string;
  url?: string;
}

interface FeatureTabsProps {
  profiles: Profile[];
  repos: Repo[];
  currentRole?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────
export function FeaturesTabs({ profiles, repos, currentRole }: FeatureTabsProps) {
  const [active, setActive] = useState("features");

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-md">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                active === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Features Panel ── */}
      {active === "features" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title || `feat-${i}`}
                className="group rounded-2xl border border-border bg-background p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-5`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Supabase Panel ── */}
      {active === "supabase" && (
        <Card className="bg-background border-border max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Database className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Supabase Live Connection</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Showing live rows from your actual database.
                </p>
              </div>
            </div>

            {/* Role Banner */}
            <div className="rounded-xl p-5 mb-8 border-l-4 border-l-primary bg-primary/5 border border-border">
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                Current Role:{" "}
                <span className="uppercase text-primary font-bold tracking-wider">
                  {currentRole || "GUEST"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Only an <strong className="text-primary">ADMIN</strong> can modify this data.
                To promote your account, tell your AI agent:{" "}
                <em className="text-foreground font-medium">
                  &ldquo;Promote my account to admin in Supabase&rdquo;
                </em>{" "}
                — or edit your role directly in the Supabase dashboard.
              </p>
            </div>

            {/* User List */}
            <h4 className="font-semibold text-foreground mb-4">
              Database Users ({profiles?.length ?? 0})
            </h4>
            {profiles && profiles.length > 0 ? (
              <div className="grid gap-3">
                {profiles.map((p, i) => (
                  <div
                    key={p.id ?? `profile-${i}`}
                    className="flex justify-between items-center bg-card p-4 rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {(p.full_name ?? "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{p.full_name ?? "Unknown User"}</p>
                        <p className="text-xs text-muted-foreground">{p.email ?? "No email"}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                        p.role === "admin"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-secondary text-secondary-foreground border border-border"
                      }`}
                    >
                      {p.role ?? "user"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-dashed border-border bg-secondary/20">
                <Database className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No profiles found in the database.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── GitHub Panel ── */}
      {active === "github" && (
        <Card className="bg-background border-border max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-violet-500/10 rounded-xl">
                <GitBranch className="w-8 h-8 text-violet-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">GitHub MCP Connection</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Showing your first 5 repositories to verify the GitHub MCP is connected.
                </p>
              </div>
            </div>

            {repos && repos.length > 0 ? (
              <div className="grid gap-4">
                {repos.slice(0, 5).map((repo, i) => (
                  <div
                    key={repo.id ?? `repo-${i}`}
                    className="group flex justify-between items-center bg-card p-5 rounded-xl border border-border hover:border-violet-500/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground flex items-center gap-2 text-sm">
                        {repo.name}
                        {repo.private && (
                          <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            Private
                          </span>
                        )}
                      </p>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    {(repo.html_url ?? repo.url) && (
                      <a
                        href={repo.html_url ?? repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-violet-500 hover:text-violet-600 px-4 py-2 rounded-lg bg-violet-500/10 shrink-0 ml-4"
                      >
                        View →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-dashed border-border bg-secondary/20">
                <GitBranch className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No repositories found or GitHub MCP not connected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
