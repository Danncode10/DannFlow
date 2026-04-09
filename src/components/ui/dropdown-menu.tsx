"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * A highly simplified, framer-motion based Dropdown Menu
 * that mimics the Shadcn appearance.
 */

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === "DropdownMenuTrigger") {
          return React.cloneElement(child as any, { onClick: () => setOpen(!open) })
        }
        if (React.isValidElement(child) && (child.type as any).displayName === "DropdownMenuContent") {
          return (
            <AnimatePresence>
              {open && React.cloneElement(child as any, { setOpen })}
            </AnimatePresence>
          )
        }
        return child
      })}
    </div>
  )
}

export function DropdownMenuTrigger({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={cn("focus:outline-none", className)}>
      {children}
    </button>
  )
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export function DropdownMenuContent({ 
  children, 
  setOpen, 
  className 
}: { 
  children: React.ReactNode, 
  setOpen?: (open: boolean) => void,
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={cn(
        "absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-card text-card-foreground shadow-lg z-50 overflow-hidden",
        className
      )}
    >
      <div className="py-1" onClick={() => setOpen?.(false)}>
        {children}
      </div>
    </motion.div>
  )
}
DropdownMenuContent.displayName = "DropdownMenuContent"

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode, 
  onClick?: () => void,
  className?: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border my-1", className)} />
}


export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{children}</div>
}
