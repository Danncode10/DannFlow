"use client";

import { motion } from "framer-motion";
import { GitBranch, Sparkles, Rocket } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: GitBranch,
    title: "Clone & configure",
    description:
      "Fork the repo, drop your Supabase credentials into .env.local, and you're live in under two minutes.",
    snippet: "git clone dannflow && npm i",
    accent: "from-primary/30 via-primary/5 to-transparent",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Describe your vision",
    description:
      "Use feature prompts in src/prompts/features/. Your AI reads schema, types, and services automatically.",
    snippet: "/new-feature lead-capture",
    accent: "from-amber-500/30 via-amber-500/5 to-transparent",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Ship & scale",
    description:
      "Deploy to Vercel with one click. Checkpoint system means you can always roll back safely.",
    snippet: "vercel deploy --prod",
    accent: "from-emerald-500/30 via-emerald-500/5 to-transparent",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-background isolate overflow-hidden border-t border-white/[0.04]"
    >
      {/* Vertical center rule */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[10px] font-medium text-foreground/70 uppercase tracking-[0.2em]">
            How it works
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-semibold text-foreground tracking-[-0.02em]">
            Three steps to your <span className="gradient-text-primary italic font-medium">next project</span>
          </h2>
        </motion.div>

        {/* Staircase cascade */}
        <div className="space-y-20 md:space-y-24">
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  !isEven ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Text side */}
                <div className={isEven ? "lg:text-right lg:pr-8" : "lg:pl-8"}>
                  <div
                    className={`inline-flex items-center gap-3 mb-5 ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
                      Step
                    </span>
                    <span className="text-[10px] font-mono text-primary">
                      / {step.step}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-foreground tracking-[-0.02em] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md inline-block">
                    {step.description}
                  </p>
                </div>

                {/* Visual side — double-bezel terminal card */}
                <div className="relative">
                  {/* Glow behind card */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${step.accent} blur-3xl opacity-60`}
                  />

                  {/* Outer bezel */}
                  <div className="relative p-1.5 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.06] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]">
                    {/* Inner core */}
                    <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden inner-highlight">
                      {/* Chrome */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-background/40">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.04] border border-white/[0.06]">
                            <Icon
                              className="h-3.5 w-3.5 text-foreground/80"
                              strokeWidth={1.5}
                            />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                            terminal
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground/60">
                          ~ / project
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-6 font-mono text-[13px] space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">→</span>
                          <span className="text-foreground/90">{step.snippet}</span>
                          <span
                            className="inline-block h-3.5 w-[6px] bg-primary"
                          />
                        </div>
                        <div className="text-muted-foreground/60 text-[11px] pl-4">
                          <span className="text-emerald-400">✓</span> ready in 1.4s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
