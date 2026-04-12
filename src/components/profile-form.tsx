"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "@/services/users";
import { User, Calendar, CircleUser, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Reusable input class — semantic tokens only, consistent height
const inputClass =
  "w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

export function ProfileForm({ profile }: { profile: any }) {
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    age: profile?.age || "",
    birthday: profile?.birthday || "",
    gender: profile?.gender || "",
  });

  // Auto-calculate age from birthday
  useEffect(() => {
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age >= 0 && formData.age !== String(age)) {
        setFormData(prev => ({ ...prev, age: String(age) }));
      }
    }
  }, [formData.birthday]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) =>
      updateProfile({
        ...data,
        age: data.age ? parseInt(data.age as string) : undefined,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profiles-db"] });
      const previousProfiles = queryClient.getQueryData(["profiles-db"]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { previousProfiles };
    },
    onError: (err: any, _newProfile, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(["profiles-db"], context.previousProfiles);
      }
      toast.error(err.message || "Failed to mutate node. Rate limit exceeded.");
    },
    onSuccess: () => {
      toast.success("Profile Node successfully updated in cluster!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles-db"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto md:max-w-2xl">
      {/* ── Header — stacks on mobile, row on sm+ ── */}
      <div className="flex flex-col gap-3 mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-tight">
            Profile Settings
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-semibold italic">
            Manage your identity and personal details.
          </p>
        </div>
        <Badge
          variant={profile?.role === "admin" ? "default" : "secondary"}
          className="self-start sm:self-auto uppercase tracking-widest px-3 py-1 text-[10px] font-black shrink-0"
        >
          {profile?.role || "User"}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              Age
            </label>
            <div className="relative group">
              <CircleUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="25"
                className={inputClass}
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              Birthday
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full bg-secondary border border-border rounded-2xl py-4 px-5 text-sm font-semibold text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

        </div>

        {/* ── Footer / Submit ── */}
        <div className="pt-6 border-t border-border mt-4 flex flex-col gap-4">
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
            Syncing with Supabase public.profiles
          </p>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-sm shadow-primary/20"
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              <><CheckCircle2 className="w-5 h-5" /> Saved</>
            ) : (
              <><CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Save Node State</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
