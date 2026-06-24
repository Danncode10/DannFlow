import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { organizations } from "./core";

const appId = text("app_id").notNull().default("business-template");
const createdAt = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    serviceInterest: text("service_interest"),
    source: text("source").notNull().default("contact-form"),
    status: text("status").notNull().default("new"),
    notes: text("notes"),
    createdAt,
    updatedAt,
  },
  (table) => ({
    appIdIdx: index("idx_leads_app_id").on(table.appId),
    organizationIdIdx: index("idx_leads_organization_id").on(table.organizationId),
    statusIdx: index("idx_leads_status").on(table.status),
    createdAtIdx: index("idx_leads_created_at").on(table.createdAt),
  }),
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    shortDesc: text("short_desc"),
    category: text("category"),
    priceFrom: numeric("price_from", { precision: 10, scale: 2 }),
    priceTo: numeric("price_to", { precision: 10, scale: 2 }),
    priceLabel: text("price_label"),
    durationMinutes: integer("duration_minutes"),
    isFeatured: boolean("is_featured").default(false),
    isPublished: boolean("is_published").default(true),
    displayOrder: integer("display_order").default(0),
    icon: text("icon"),
    imageUrl: text("image_url"),
    createdAt,
    updatedAt,
  },
  (table) => ({
    appSlugUnique: uniqueIndex("services_app_id_slug_idx").on(table.appId, table.slug),
    appIdIdx: index("idx_services_app_id").on(table.appId),
    organizationIdIdx: index("idx_services_organization_id").on(table.organizationId),
    isPublishedIdx: index("idx_services_is_published").on(table.isPublished),
  }),
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone"),
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
    serviceName: text("service_name").notNull(),
    package: text("package"),
    vehicleType: text("vehicle_type"),
    vehicleMake: text("vehicle_make"),
    vehicleModel: text("vehicle_model"),
    vehicleYear: text("vehicle_year"),
    notes: text("notes"),
    preferredDate: date("preferred_date"),
    preferredTime: text("preferred_time"),
    confirmedDate: date("confirmed_date"),
    confirmedTime: text("confirmed_time"),
    status: text("status").notNull().default("pending"),
    priceQuoted: numeric("price_quoted", { precision: 10, scale: 2 }),
    pricePaid: numeric("price_paid", { precision: 10, scale: 2 }),
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    source: text("source").notNull().default("website"),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => ({
    appIdIdx: index("idx_bookings_app_id").on(table.appId),
    organizationIdIdx: index("idx_bookings_organization_id").on(table.organizationId),
    statusIdx: index("idx_bookings_status").on(table.status),
  }),
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    pagePath: text("page_path"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    sessionId: text("session_id"),
    properties: jsonb("properties").notNull().default(sql`'{}'::jsonb`),
    createdAt,
  },
  (table) => ({
    appIdIdx: index("idx_analytics_app_id").on(table.appId),
    organizationIdIdx: index("idx_analytics_organization_id").on(table.organizationId),
    eventTypeIdx: index("idx_analytics_event_type").on(table.eventType),
    createdAtIdx: index("idx_analytics_created_at").on(table.createdAt),
  }),
);

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title"),
    caption: text("caption"),
    imageUrl: text("image_url").notNull(),
    beforeImageUrl: text("before_image_url"),
    serviceTag: text("service_tag"),
    displayOrder: integer("display_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => ({
    appIdIdx: index("idx_gallery_app_id").on(table.appId),
    organizationIdIdx: index("idx_gallery_organization_id").on(table.organizationId),
  }),
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    link: text("link"),
    isRead: boolean("is_read").notNull().default(false),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt,
  },
  (table) => ({
    appIdIdx: index("idx_notifications_app_id").on(table.appId),
    organizationIdIdx: index("idx_notifications_organization_id").on(table.organizationId),
    isReadIdx: index("idx_notifications_is_read").on(table.isRead),
  }),
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appId,
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id"),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id"),
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    diff: jsonb("diff"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt,
  },
  (table) => ({
    appIdIdx: index("idx_audit_logs_app_id").on(table.appId),
    organizationIdIdx: index("idx_audit_logs_organization_id").on(table.organizationId),
    actionIdx: index("idx_audit_logs_action").on(table.action),
    createdAtIdx: index("idx_audit_logs_created_at").on(table.createdAt),
  }),
);
