"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Terminal, Database, Shield, Zap } from "lucide-react";
import { siteConfig } from "@/lib/config";

interface HeroProps {
  isAuthed: boolean;
}

export function Hero({ isAuthed }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-background pt-12 pb-32 md:pt-20 md:pb-44"
    >
      {/* Static dot grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-50"
      />

      {/* Single static ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-medium text-foreground/80 uppercase tracking-[0.18em]">
            AI-native starter · v1.0
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] leading-[0.95] text-foreground"
        >
          Ship your next{" "}
          <span className="gradient-text-primary italic font-medium">
            big idea
          </span>
          <br />
          in record time
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl text-[17px] text-muted-foreground leading-relaxed"
        >
          {siteConfig.name} is the AI-native starter for websites, management
          systems, and startup MVPs. Stop building boilerplate — start shipping.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {/* Primary CTA with nested icon circle */}
          <a
            href={isAuthed ? "/dashboard" : "/login"}
            className="group flex items-center gap-2 pl-6 pr-2 py-2 text-sm font-medium rounded-full bg-foreground text-background active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_4px_20px_rgba(124,92,255,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_24px_rgba(124,92,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Get started free
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 group-hover:bg-background/20 group-hover:translate-x-0.5 group-hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>

          {/* Secondary CTA — no backdrop-blur (perf) */}
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-full border border-white/[0.08] bg-white/[0.02] text-foreground/90 hover:bg-white/[0.05] hover:border-white/[0.12] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] inner-highlight"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            Star on GitHub
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-[12px] text-muted-foreground/70 font-mono uppercase tracking-[0.2em]"
        >
          Trusted by solo devs · startup teams · agencies
        </motion.p>

        {/* Floating product preview — double-bezel terminal/dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 mx-auto max-w-5xl"
        >
          {/* Outer bezel */}
          <div className="relative p-1.5 rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.06] shadow-[0_24px_80px_-20px_rgba(124,92,255,0.3),0_0_0_1px_rgba(255,255,255,0.04)]">
            {/* Inner core */}
            <div className="relative rounded-[calc(2rem-0.375rem)] bg-card overflow-hidden border border-white/[0.04] inner-highlight">
              {/* Top bar — fake window chrome */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-background/40">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.04]">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {siteConfig.name}.app/dashboard
                  </span>
                </div>
                <div className="w-12" />
              </div>

              {/* Fake dashboard grid */}
              <div className="grid grid-cols-12 gap-3 p-5">
                {/* Sidebar */}
                <div className="col-span-3 space-y-2">
                  {[Terminal, Database, Shield, Zap].map((Icon, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] ${
                        i === 0
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon className="h-3 w-3" strokeWidth={1.5} />
                      <span className="font-medium">
                        {["Overview", "Database", "Auth", "API"][i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="col-span-9 space-y-3">
                  {/* Stat row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Requests", val: "12.4k", delta: "+24%" },
                      { label: "Users", val: "1,247", delta: "+8.2%" },
                      { label: "Uptime", val: "99.9%", delta: "30d" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                          {s.label}
                        </p>
                        <p className="mt-1.5 text-base font-semibold text-foreground tabular-nums">
                          {s.val}
                        </p>
                        <p className="mt-0.5 text-[9px] text-emerald-400 font-mono">
                          {s.delta}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart — static bars, no animation (perf) */}
                  <div className="relative h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden p-3">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Activity
                    </p>
                    <div className="flex items-end justify-between h-16 gap-1">
                      {[40, 60, 35, 75, 55, 85, 70, 90, 65, 80, 50, 95].map(
                        (h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary/80"
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Activity row */}
                  <div className="space-y-1.5">
                    {[
                      { user: "lester@dann.co", action: "Created project" },
                      { user: "maria@studio.io", action: "Updated schema" },
                      { user: "alex@kit.dev", action: "Deployed v1.2.0" },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-[#5B3FE0] flex items-center justify-center">
                            <span className="text-[8px] font-bold text-primary-foreground">
                              {row.user[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-foreground">
                              {row.user}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                              {row.action}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          just now
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
