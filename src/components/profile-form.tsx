"use client";

import { useState } from "react";
import { updateProfile } from "@/services/users";
import { User, Calendar, CircleUser, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    age: profile?.age || "",
    birthday: profile?.birthday || "",
    gender: profile?.gender || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updateProfile({
        ...formData,
        age: formData.age ? parseInt(formData.age as string) : undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mt-1 font-semibold italic">Manage your account identity and personal details.</p>
        </div>
        <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'} className="uppercase tracking-widest px-3 py-1">
           {profile?.role || 'User'}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Age</label>
            <div className="relative group">
              <CircleUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="25"
                className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Birthday</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full bg-secondary/50 border border-border rounded-xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border mt-8 flex items-center justify-between gap-4">
           <p className="text-[10px] text-muted-foreground font-semibold italic">Syncing with Supabase public.profiles cluster</p>
           <button
             type="submit"
             disabled={loading}
             className="min-w-[140px] bg-primary text-primary-foreground py-3 px-6 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : null}
             {loading ? "Saving..." : success ? "Saved!" : "Update Profile"}
           </button>
        </div>
      </form>
    </div>
  );
}
