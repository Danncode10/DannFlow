"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, User as UserIcon, Shield } from "lucide-react";
import { getProfile } from "@/services/users";
import { ProfileForm } from "@/components/profile-form";
import { SecurityForm } from "@/components/security-form";
import { useState } from "react";

const SECTIONS = [
  { id: "profile",  label: "Profile",      icon: UserIcon },
  { id: "security", label: "Security",     icon: Shield },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

export function SettingsTab() {
  const [section, setSection] = useState<SectionId>("profile");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profiles-db"],
    queryFn: getProfile,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Account and security preferences.
        </p>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              section === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin inline" />
        ) : section === "profile" ? (
          <ProfileForm profile={profile} />
        ) : section === "security" ? (
          <SecurityForm />
        ) : null}
      </div>
    </div>
  );
}
