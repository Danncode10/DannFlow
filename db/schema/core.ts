import { sql } from "drizzle-orm";
import { boolean, date, index, jsonb, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userRole } from "./enums";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`timezone('utc'::text, now())`),
  role: userRole("role").default("user"),
  fullName: text("full_name"),
  age: integer("age"),
  birthday: date("birthday"),
  gender: text("gender"),
  isActive: boolean("is_active").notNull().default(true),
});

export const teamAuditLogs = pgTable(
  "team_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
    targetProfileId: uuid("target_profile_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
    action: text("action").notNull(),
    previousValues: jsonb("previous_values"),
    nextValues: jsonb("next_values"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("team_audit_logs_target_profile_id_idx").on(table.targetProfileId),
    index("team_audit_logs_created_at_idx").on(table.createdAt),
  ],
);
