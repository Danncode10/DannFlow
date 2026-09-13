# Role-Based Access Control (RBAC) & Dashboard Architecture

> **Audience**: Frontend Developers, Product Managers, and Security Engineers  
> **Source Code**: `src/config/roles.json`, `src/lib/dashboard-features.ts`, `src/components/dashboard-shell.tsx`, `src/components/dashboard/tabs/under-construction-tab.tsx`

This document outlines the Role-Based Access Control (RBAC) system and modular dashboard navigation architecture in JuanStack.

---

## 1. Canonical Roles Specification (`src/config/roles.json`)

JuanStack establishes `src/config/roles.json` as the single source of truth for all role definitions and allowed tabs across the platform.

```json
{
  "roles": {
    "super_admin": {
      "name": "Super Admin",
      "description": "Platform administrator with full global control and platform blog management",
      "allowed_tabs": [
        "overview",
        "ai-secretary",
        "schedule",
        "bir",
        "analytics",
        "blog",
        "team",
        "settings"
      ]
    },
    "admin": {
      "name": "Organization Owner / Admin",
      "description": "Tenant administrator managing organization settings, team members, BIR compliance, and operations",
      "allowed_tabs": [
        "overview",
        "ai-secretary",
        "schedule",
        "bir",
        "analytics",
        "team",
        "settings"
      ]
    },
    "member": {
      "name": "Team Member",
      "description": "Staff member handling daily consultations, client records, and AI Secretary workflows",
      "allowed_tabs": ["overview", "ai-secretary", "schedule", "settings"]
    }
  },
  "default_role": "member"
}
```

---

## 2. Role Permissions & Access Matrix

| Dashboard Tab       | `member` (Staff) | `admin` (Owner) | `super_admin` (Platform) | Purpose                                                      |
| :------------------ | :--------------: | :-------------: | :----------------------: | :----------------------------------------------------------- |
| **Overview**        |        ✅        |       ✅        |            ✅            | Daily KPI summary and operational alerts                     |
| **AI Secretary**    |        ✅        |       ✅        |            ✅            | Real-time chat with autonomous tools & DB queries            |
| **Schedule**        |        ✅        |       ✅        |            ✅            | Availability management & calendar booking (Phase 4)         |
| **BIR Compliance**  |        ❌        |       ✅        |            ✅            | Tax return generation (2551Q, 1701Q) & 2307 ledger (Phase 6) |
| **Analytics**       |        ❌        |       ✅        |            ✅            | Organization revenue & client conversion metrics (Phase 5)   |
| **Team Management** |        ❌        |       ✅        |            ✅            | Invite staff members, assign roles, manage tenant seats      |
| **Blog Management** |        ❌        |       ❌        |            ✅            | Platform-level marketing articles and announcements          |
| **Settings**        |        ✅        |       ✅        |            ✅            | Personal profile & notification preferences                  |

---

## 3. Legacy Module Gating Strategy

DannFlow originated with generic starter-kit modules (`leads`, `bookings`, `services`). In JuanStack:

- **`bookings`** is superseded by the Phase 4 **Scheduling Core Engine**.
- **`leads`** is superseded by vertical-specific client records (e.g. `Client` for law, `Pet Owner` for veterinary).
- **`services`** is superseded by vertical pricing and catalog configurations.

To prevent sidebar clutter while preserving database compatibility, `src/lib/dashboard-features.ts` marks these legacy tabs with `isLegacyStarter: true` and hides them from the default JuanStack navigation.

---

## 4. Under-Construction Previews (`UnderConstructionTab`)

To prevent broken links, 404 errors, or developer confusion while upcoming roadmap phases are being finalized:

- When a user navigates to `?tab=schedule` or `?tab=bir`, the application renders [`UnderConstructionTab`](file:///Users/lesterdannlopez/Desktop/Dann_Folder/MyProjects/Work/Dannflow/src/components/dashboard/tabs/under-construction-tab.tsx).
- Displays animated roadmap badges, milestone details (e.g., "Phase 4 Milestone"), and upcoming feature highlights.
- Provides a direct CTA button navigating the user to the active **AI Secretary**, allowing them to interact with their data via chat while the visual dashboard is being finalized.
