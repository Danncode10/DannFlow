import { sql } from "drizzle-orm";
import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
});
