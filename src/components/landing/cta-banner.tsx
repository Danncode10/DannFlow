"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

interface CtaBannerProps {
  isAuthed: boolean;
}

export function CtaBanner({ isAuthed }: CtaBannerProps) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.04] bg-background">
      {/* Animated mesh gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1200px] rounded-full bg-primary/15 blur-[160px] animate-pulse-glow" />
        <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#5B3FE0]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-[#9F7BFF]/10 blur-[120px]" />
      </div>
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-40"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl px-3 py-1 text-[10px] font-medium text-foreground/70 uppercase tracking-[0.2em]">
            Ready when you are
          </span>

          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground tracking-[-0.03em] leading-[1]">
            Ready to build <br />
            <span className="gradient-text-primary italic font-medium">
              something great?
            </span>
          </h2>
          <p className="mt-6 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Join builders using {siteConfig.name} to ship websites, apps, and
            startup MVPs faster.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={isAuthed ? "/dashboard" : "/login"}
              className="group flex items-center gap-2 pl-6 pr-2 py-2 text-sm font-medium rounded-full bg-foreground text-background active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_4px_20px_rgba(124,92,255,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(124,92,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Start building
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 group-hover:bg-background/20 group-hover:translate-x-0.5 group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <a
              href="#pricing"
              className="px-6 py-3 text-sm font-medium rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl text-foreground/90 hover:bg-white/[0.05] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] inner-highlight"
            >
              See pricing
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
