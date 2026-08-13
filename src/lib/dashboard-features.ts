export type DashboardTabId =
  | "overview"
  | "services"
  | "leads"
  | "bookings"
  | "blog"
  | "analytics"
  | "settings";

export type FeatureFlag =
  | "always"
  | "pricing"
  | "contactForm"
  | "gallery"
  | "analytics"
  | "testimonials"
  | "teamPage"
  | "blog";

interface TabConfig {
  id: DashboardTabId;
  label: string;
  feature: FeatureFlag;
}

export const TAB_CONFIG: TabConfig[] = [
  { id: "overview",   label: "Overview",   feature: "always" },
  { id: "services",   label: "Services",   feature: "pricing" },
  { id: "leads",      label: "Leads",      feature: "contactForm" },
  { id: "bookings",   label: "Bookings",   feature: "contactForm" },
  { id: "blog",       label: "Blog",       feature: "blog" },
  { id: "analytics",  label: "Analytics",  feature: "analytics" },
  { id: "settings",   label: "Settings",   feature: "always" },
];

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flag === "always" || flag === "pricing" || flag === "contactForm" || flag === "blog";
}

export function getEnabledTabs(): TabConfig[] {
  return TAB_CONFIG.filter((t) => isFeatureEnabled(t.feature));
}
