// Generated from the DannFlow single-project schema. Do not edit manually.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Timestamp = string;

type Profile = { id: string; email: string | null; created_at: Timestamp; role: "admin" | "user" | null; full_name: string | null; age: number | null; birthday: string | null; gender: string | null; is_active: boolean };
type TeamAuditLog = { id: string; actor_id: string; target_profile_id: string; action: string; previous_values: Json | null; next_values: Json | null; created_at: Timestamp };
type Lead = { id: string; name: string; email: string; phone: string | null; message: string | null; service_interest: string | null; source: string; status: string; notes: string | null; created_at: Timestamp; updated_at: Timestamp };
type Service = { id: string; name: string; slug: string; description: string | null; short_desc: string | null; category: string | null; price_from: number | null; price_to: number | null; price_label: string | null; duration_minutes: number | null; is_featured: boolean | null; is_published: boolean | null; display_order: number | null; icon: string | null; image_url: string | null; created_at: Timestamp; updated_at: Timestamp };
type Booking = { id: string; customer_name: string; customer_email: string; customer_phone: string | null; service_id: string | null; service_name: string; package: string | null; vehicle_type: string | null; vehicle_make: string | null; vehicle_model: string | null; vehicle_year: string | null; notes: string | null; preferred_date: string | null; preferred_time: string | null; confirmed_date: string | null; confirmed_time: string | null; status: string; price_quoted: number | null; price_paid: number | null; payment_status: string; source: string; lead_id: string | null; created_at: Timestamp; updated_at: Timestamp };
type AnalyticsEvent = { id: string; event_type: string; page_path: string | null; referrer: string | null; user_agent: string | null; ip_hash: string | null; session_id: string | null; properties: Json; created_at: Timestamp };
type GalleryItem = { id: string; title: string | null; caption: string | null; image_url: string; before_image_url: string | null; service_tag: string | null; display_order: number; is_published: boolean; created_at: Timestamp; updated_at: Timestamp };
type Notification = { id: string; type: string; title: string; body: string | null; link: string | null; is_read: boolean; metadata: Json; created_at: Timestamp };
type AuditLog = { id: string; actor_id: string | null; actor_email: string | null; action: string; resource_type: string; resource_id: string | null; old_data: Json | null; new_data: Json | null; diff: Json | null; ip_address: string | null; user_agent: string | null; created_at: Timestamp };
type BlogPost = { id: string; title: string; slug: string; excerpt: string | null; content: string; cover_image_url: string | null; seo_title: string | null; seo_description: string | null; is_published: boolean; published_at: Timestamp | null; created_at: Timestamp; updated_at: Timestamp };

export type Database = { public: { Tables: {
  profiles: Table<Profile, Partial<Profile> & { id: string }>;
  leads: Table<Lead, Partial<Lead> & { name: string; email: string }>;
  services: Table<Service, Partial<Service> & { name: string; slug: string }>;
  bookings: Table<Booking, Partial<Booking> & { customer_name: string; customer_email: string; service_name: string }>;
  analytics_events: Table<AnalyticsEvent, Partial<AnalyticsEvent> & { event_type: string }>;
  gallery_items: Table<GalleryItem, Partial<GalleryItem> & { image_url: string }>;
  notifications: Table<Notification, Partial<Notification> & { type: string; title: string }>;
  audit_logs: Table<AuditLog, Partial<AuditLog> & { action: string; resource_type: string }>;
  blog_posts: Table<BlogPost, Partial<BlogPost> & { title: string; slug: string; content: string }>;
  team_audit_logs: Table<TeamAuditLog, Partial<TeamAuditLog> & { actor_id: string; target_profile_id: string; action: string }>;
}; Views: Record<string, never>; Functions: Record<string, never>; Enums: { user_role: "admin" | "user" }; CompositeTypes: Record<string, never> } };

export type Tables<TableName extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][TableName]["Row"];
export type TablesInsert<TableName extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][TableName]["Insert"];
export type TablesUpdate<TableName extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][TableName]["Update"];
