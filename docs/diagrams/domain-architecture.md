# 🏗️ Domain & Service Architecture Diagram

This diagram maps the structural relationships between Next.js UI Components, the **Service Layer** (`src/services/`), TypeScript Definitions (`src/types/`), and Supabase Backend Entities.

---

## Mermaid Domain Architecture Diagram

```mermaid
classDiagram
    %% UI Components Layer
    class NextJS_AppPage {
        +ServerComponent page.tsx
        +ClientComponent form.tsx
        +renders UI via Shadcn
    }

    %% Service Layer (Business Logic + DB Access)
    class AuthService {
        +getUserSession()
        +signOut()
    }

    class ProfileService {
        +getProfile(userId: string)
        +updateProfile(userId: string, data: ProfileUpdate)
    }

    class ServiceLayerBoundary {
        <<Interface>>
        +All DB queries isolated here
        +No direct DB calls from UI
    }

    %% Type Layer
    class SupabaseTypes {
        <<Generated>>
        +Database schema interface
        +Tables, Enums, Functions
    }

    %% Backend Entities (Supabase PostgreSQL)
    class ProfilesTable {
        +uuid id PK
        +timestamp updated_at
        +text username
        +text full_name
        +text avatar_url
        +text website
    }

    class AuthUsersTable {
        +uuid id PK
        +string email
        +timestamp created_at
    }

    %% Relationships
    NextJS_AppPage --> AuthService : invokes
    NextJS_AppPage --> ProfileService : invokes
    AuthService ..|> ServiceLayerBoundary
    ProfileService ..|> ServiceLayerBoundary

    ProfileService --> SupabaseTypes : uses strict types
    AuthService --> SupabaseTypes : uses strict types

    SupabaseTypes --> ProfilesTable : maps schema
    SupabaseTypes --> AuthUsersTable : maps schema
    AuthUsersTable "1" -- "1" ProfilesTable : triggers on insert
```

---

## Architectural Guidelines

1. **UI Layer Isolation**: Next.js pages and Shadcn components inside `src/app/` and `src/components/` must **never** call `supabase.from(...)` directly.
2. **Service Layer Responsibility**: All CRUD operations, tenant isolation checks, and business rules belong exclusively in `src/services/`.
3. **Type Contracts**: Functions in `src/services/` import data types strictly from `src/types/supabase.ts` (auto-generated via `npm run db:types`).
