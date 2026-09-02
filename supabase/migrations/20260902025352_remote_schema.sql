
  create table "public"."test_pull_feature" (
    "id" uuid not null default gen_random_uuid(),
    "message" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."test_pull_feature" enable row level security;

CREATE UNIQUE INDEX test_pull_feature_pkey ON public.test_pull_feature USING btree (id);

alter table "public"."test_pull_feature" add constraint "test_pull_feature_pkey" PRIMARY KEY using index "test_pull_feature_pkey";

grant delete on table "public"."test_pull_feature" to "anon";

grant insert on table "public"."test_pull_feature" to "anon";

grant references on table "public"."test_pull_feature" to "anon";

grant select on table "public"."test_pull_feature" to "anon";

grant trigger on table "public"."test_pull_feature" to "anon";

grant truncate on table "public"."test_pull_feature" to "anon";

grant update on table "public"."test_pull_feature" to "anon";

grant delete on table "public"."test_pull_feature" to "authenticated";

grant insert on table "public"."test_pull_feature" to "authenticated";

grant references on table "public"."test_pull_feature" to "authenticated";

grant select on table "public"."test_pull_feature" to "authenticated";

grant trigger on table "public"."test_pull_feature" to "authenticated";

grant truncate on table "public"."test_pull_feature" to "authenticated";

grant update on table "public"."test_pull_feature" to "authenticated";

grant delete on table "public"."test_pull_feature" to "service_role";

grant insert on table "public"."test_pull_feature" to "service_role";

grant references on table "public"."test_pull_feature" to "service_role";

grant select on table "public"."test_pull_feature" to "service_role";

grant trigger on table "public"."test_pull_feature" to "service_role";

grant truncate on table "public"."test_pull_feature" to "service_role";

grant update on table "public"."test_pull_feature" to "service_role";


