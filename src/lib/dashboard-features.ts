import rolesConfig from "@/config/roles.json";

export type DashboardTabId =
  | "overview"
  | "ai-secretary"
  | "schedule"
  | "bir"
  | "analytics"
  | "blog"
  | "team"
  | "settings"
  | "services"
  | "leads"
  | "bookings";

export type JuanStackRole = "super_admin" | "admin" | "member";

export type FeatureFlag =
  | "always"
  | "pricing"
  | "contactForm"
  | "gallery"
  | "analytics"
  | "testimonials"
  | "teamPage"
  | "admin-only"
  | "blog"
  | string;

export interface TabConfig {
  id: DashboardTabId;
  label: string;
  requiredRole?: JuanStackRole | JuanStackRole[];
  isLegacyStarter?: boolean;
}

export const TAB_CONFIG: TabConfig[] = [
  { id: "overview", label: "Overview" },
  { id: "ai-secretary", label: "AI Secretary" },
  { id: "schedule", label: "Schedule" },
  {
    id: "bir",
    label: "BIR Compliance",
    requiredRole: ["admin", "super_admin"],
  },
  {
    id: "analytics",
    label: "Analytics",
    requiredRole: ["admin", "super_admin"],
  },
  { id: "team", label: "Team", requiredRole: ["admin", "super_admin"] },
  { id: "blog", label: "Blog Management", requiredRole: "super_admin" },
  { id: "settings", label: "Settings" },

  // Legacy Starter Modules (Hidden by default in JuanStack to prevent clutter)
  { id: "services", label: "Services", isLegacyStarter: true },
  { id: "leads", label: "Leads", isLegacyStarter: true },
  { id: "bookings", label: "Bookings", isLegacyStarter: true },
];

/**
 * Normalizes user role string to canonical JuanStack role.
 */
export function normalizeRole(role: string | null | undefined): JuanStackRole {
  if (!role) return "member";
  if (role === "super_admin" || role === "superadmin") return "super_admin";
  if (role === "admin" || role === "owner") return "admin";
  return "member";
}

/**
 * Checks if a specific tab is allowed for a user role according to roles.json
 */
export function isTabAllowedForRole(
  tabId: DashboardTabId,
  roleStr: string | null | undefined = "member",
): boolean {
  const role = normalizeRole(roleStr);
  const roleDef = rolesConfig.roles[role] || rolesConfig.roles.member;
  return roleDef.allowed_tabs.includes(tabId);
}

/**
 * Legacy feature-check helper for backwards compatibility.
 */
export function isFeatureEnabled(
  flag: string,
  role: string | null | undefined = "member",
): boolean {
  if (flag === "admin-only") {
    const canonicalRole = normalizeRole(role);
    return canonicalRole === "admin" || canonicalRole === "super_admin";
  }
  return true;
}

/**
 * Returns the list of enabled dashboard tabs for the current role.
 */
export function getEnabledTabs(
  role: string | null | undefined = "member",
  showLegacyModules = false,
): TabConfig[] {
  return TAB_CONFIG.filter((t) => {
    // Hide legacy starter modules unless explicitly enabled
    if (t.isLegacyStarter && !showLegacyModules) {
      return false;
    }
    return isTabAllowedForRole(t.id, role);
  });
}
