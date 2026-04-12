"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { signOut } from "@/services/auth";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";




const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar({ user }: { user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/#home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-card hover:bg-accent active:scale-[0.98] transition-all rounded-full px-1.5 py-1.5 md:pl-1.5 md:pr-4 border border-border shadow-sm group cursor-pointer">
                {/* ── Avatar ── */}
                <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-border shadow-sm transition-transform group-hover:scale-105">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-black text-[10px] md:text-xs">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* ── Identity (Hidden on Mobile) ── */}
                <div className="hidden md:flex items-center gap-2.5 max-w-[150px]">
                  <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors truncate tracking-tight">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 mt-3 rounded-xl shadow-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1 py-1">
                    <p className="text-xs font-black text-foreground uppercase tracking-wider truncate">
                      {user.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="rounded-lg mx-1 my-0.5">
                  <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard?tab=settings")} className="rounded-lg mx-1 my-0.5">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-semibold text-sm">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="rounded-lg mx-1 my-0.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (


            <>
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </a>
              <a
                href="/login"
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
              >
                Get Started
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-border mt-2">
            {user ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-xl border border-white/5">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black uppercase text-foreground truncate">{user.email?.split("@")[0]}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest bg-secondary text-foreground rounded-xl border border-white/5"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Dashboard
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest bg-red-400/10 text-red-400 rounded-xl border border-red-400/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Exit
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="block w-full text-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground"
              >
                Get Started
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
