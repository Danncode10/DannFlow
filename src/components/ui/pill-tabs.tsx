"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface PillTabsProps {
  items: PillTabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({ items, active, onChange, className }: PillTabsProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <div 
        className={cn(
          "flex p-1.5 rounded-full bg-secondary border border-border shadow-inner backdrop-blur-md relative overflow-x-auto no-scrollbar max-w-full",
          className
        )}
      >
        {items.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = active === tab.id;
          const isHovered = hovered === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHovered(tab.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "text-primary scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pill-active"
                  className="absolute inset-0 bg-card rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] z-0"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}
              {isHovered && !isActive && (
                <motion.div
                  layoutId="pill-hover"
                  className="absolute inset-0 bg-primary/10 rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <TabIcon
                  className={`w-4 h-4 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  } transition-colors duration-300`}
                />
                <span className="tracking-tighter font-medium text-sm md:text-sm uppercase tracking-widest">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-normal transition-all duration-500 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "bg-border text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
