"use client";

import { useState } from "react";
import { Lock, Loader2, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/services/auth";
import { toast } from "sonner";

// Consistent input styling — semantic tokens, matches ProfileForm
const inputClass =
  "w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-14 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  autoComplete?: string;
}

function PasswordField({
  label, placeholder, value, onChange, show, onToggle, icon, autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show
            ? <EyeOff className="w-4 h-4" />
            : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password, currentPassword);
      toast.success("Security updated", {
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.message === "Incorrect current password") {
        toast.error("Verification failed", {
          description: "Please enter your current password correctly.",
        });
      } else {
        toast.error("Update failed", {
          description: err.message || "Something went wrong.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto md:max-w-2xl space-y-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
          Security Settings
        </h2>
        <p className="text-sm text-muted-foreground font-semibold italic">
          Manage your account security and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current password */}
        <PasswordField
          label="Current Password"
          placeholder="Required for verification"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          onToggle={() => setShowCurrent(!showCurrent)}
          icon={<KeyRound className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
          autoComplete="current-password"
        />

        {/* Divider */}
        <div className="border-t border-border pt-2" />

        {/* New password */}
        <PasswordField
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
          icon={<Lock className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
          autoComplete="new-password"
        />

        {/* Confirm password */}
        <PasswordField
          label="Confirm New Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          icon={<Lock className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
          autoComplete="new-password"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-2 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {loading ? "Verifying & Updating..." : "Update Password"}
        </button>
      </form>

      {/* Requirements card */}
      <div className="p-4 bg-secondary border border-border rounded-2xl shadow-sm">
        <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground mb-3">
          Password Requirements
        </h4>
        <ul className="text-[10px] text-muted-foreground font-mono space-y-1.5">
          <li>• Minimum 6 characters</li>
          <li>• Must be different from current password</li>
          <li>• Re-authentication required for all changes</li>
        </ul>
      </div>
    </div>
  );
}
