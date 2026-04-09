"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 ring-1 ring-white/5 shadow-inner shadow-white/10", 
      className
    )}>
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt, className }: { src: string, alt?: string, className?: string }) {
  return <img src={src} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} />
}

export function AvatarFallback({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary via-blue-500 to-accent text-white font-mono font-black text-sm uppercase tracking-tighter", 
      className
    )}>
      {children}
    </div>
  )
}

