"use client";

import React from "react";
import {
  Calendar,
  FileSpreadsheet,
  Hammer,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type UnderConstructionModule = "schedule" | "bir" | "generic";

interface UnderConstructionTabProps {
  module: UnderConstructionModule;
  onNavigateAiSecretary?: () => void;
}

const MODULE_DETAILS: Record<
  UnderConstructionModule,
  {
    title: string;
    subtitle: string;
    milestone: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: { title: string; desc: string }[];
  }
> = {
  schedule: {
    title: "Scheduling & Calendar Engine",
    subtitle:
      "Automated appointment booking, availability management, and calendar sync",
    milestone: "Phase 4 Milestone",
    description:
      "We are building a unified booking engine with clash detection, real-time availability slots, and Google Calendar two-way synchronization.",
    icon: Calendar,
    features: [
      {
        title: "Intelligent Clash Detection",
        desc: "Strict conflict prevention respecting Philippine holiday calendars and provider operating hours.",
      },
      {
        title: "Two-Way Google Calendar Sync",
        desc: "Seamless synchronization with your personal or firm Google Calendar accounts.",
      },
      {
        title: "AI Secretary Scheduling Tool",
        desc: "Clients and staff can book directly via conversational chat with our AI Secretary.",
      },
      {
        title: "Multi-Tenant Availability Buffers",
        desc: "Custom travel and preparation buffers between client consultations.",
      },
    ],
  },
  bir: {
    title: "BIR Tax Compliance Engine",
    subtitle:
      "Philippine Bureau of Internal Revenue tax calculations, forms, and filing ledgers",
    milestone: "Phase 6 Milestone",
    description:
      "A localized tax compliance engine built natively into JuanStack, designed to automate 2551Q, 1701Q, and 2307 withholding certificates for Philippine businesses.",
    icon: FileSpreadsheet,
    features: [
      {
        title: "Quarterly Tax Return Generation",
        desc: "Automated computation and draft filing for BIR Form 2551Q and Form 1701Q.",
      },
      {
        title: "Creditable Withholding Tax (2307)",
        desc: "Ledger tracking for client withholding certificates and deduction applications.",
      },
      {
        title: "Tax Deadline Alerts",
        desc: "Never miss a BIR statutory deadline with automated dashboard notifications.",
      },
      {
        title: "Audit-Ready Book of Accounts",
        desc: "Exportable compliance ledgers complying with standard Philippine accounting standards.",
      },
    ],
  },
  generic: {
    title: "Module Under Construction",
    subtitle: "This module is actively being engineered",
    milestone: "Upcoming Milestone",
    description:
      "This section of the platform is currently under active development as part of the JuanStack roadmap.",
    icon: Hammer,
    features: [
      {
        title: "Active Engineering",
        desc: "Core models and services are being integrated with tenant isolation.",
      },
      {
        title: "Safe Fallback",
        desc: "Preventing broken workflows while features are being deployed.",
      },
    ],
  },
};

export function UnderConstructionTab({
  module,
  onNavigateAiSecretary,
}: UnderConstructionTabProps) {
  const config = MODULE_DETAILS[module] || MODULE_DETAILS.generic;
  const Icon = config.icon;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
          <Clock className="h-3.5 w-3.5 animate-pulse" />
          <span>Under Active Construction • {config.milestone}</span>
        </div>

        {/* Main Icon & Title */}
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border shadow-md text-primary">
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {config.title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Feature Teasers Grid */}
        <div className="grid gap-3 sm:grid-cols-2 text-left pt-2">
          {config.features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-1.5 transition-colors hover:border-border hover:bg-card/70"
            >
              <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{feature.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="rounded-xl border border-primary/15 bg-gradient-to-b from-primary/5 to-transparent p-5 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Need assistance right now?</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You can use the AI Secretary to query your existing records or test
            interactive scheduling commands while this interface is finalized.
          </p>
          {onNavigateAiSecretary && (
            <div className="pt-1">
              <Button
                variant="default"
                size="sm"
                onClick={onNavigateAiSecretary}
                className="gap-2"
              >
                <span>Open AI Secretary</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
