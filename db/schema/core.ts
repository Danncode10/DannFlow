import { sql } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { userRole } from "./enums";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId: text("app_id").notNull().default("business-template"),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    website: text("website"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    appSlugUnique: uniqueIndex("organizations_app_id_slug_idx").on(table.appId, table.slug),
  }),
);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  appId: text("app_id").notNull().default("business-template"),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "set null",
  }),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`timezone('utc'::text, now())`),
  role: userRole("role").default("user"),
  fullName: text("full_name"),
  age: integer("age"),
  birthday: date("birthday"),
  gender: text("gender"),
});
