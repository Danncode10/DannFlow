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

    class AiChatService {
        +createOrGetChat(chatId, title)
        +listUserChats(page, limit)
        +saveChatMessage(chatId, role, parts)
        +deleteUserChat(chatId)
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
    class OrganizationsTable {
        +uuid id PK
        +uuid owner_id FK
        +text name
        +timestamptz created_at
    }

    class AiChatsTable {
        +text id PK
        +uuid organization_id FK
        +uuid user_id FK
        +text title
        +timestamptz updated_at
    }

    class AiMessagesTable {
        +text id PK
        +text chat_id FK
        +text role
        +jsonb parts
    }

    class ProfilesTable {
        +uuid id PK
        +timestamp updated_at
        +text username
        +text full_name
    }

    class AuthUsersTable {
        +uuid id PK
        +string email
        +timestamp created_at
    }

    %% Relationships
    NextJS_AppPage --> AuthService : invokes
    NextJS_AppPage --> ProfileService : invokes
    NextJS_AppPage --> AiChatService : invokes
    AuthService ..|> ServiceLayerBoundary
    ProfileService ..|> ServiceLayerBoundary
    AiChatService ..|> ServiceLayerBoundary

    ProfileService --> SupabaseTypes : uses strict types
    AuthService --> SupabaseTypes : uses strict types
    AiChatService --> SupabaseTypes : uses strict types

    SupabaseTypes --> OrganizationsTable : maps schema
    SupabaseTypes --> AiChatsTable : maps schema
    SupabaseTypes --> AiMessagesTable : maps schema
    SupabaseTypes --> ProfilesTable : maps schema
    SupabaseTypes --> AuthUsersTable : maps schema

    AuthUsersTable "1" -- "1" ProfilesTable : triggers on insert
    AuthUsersTable "1" -- "1" OrganizationsTable : triggers on insert
    OrganizationsTable "1" -- "*" AiChatsTable : tenant boundary
    AiChatsTable "1" -- "*" AiMessagesTable : cascade delete
```

---

## Architectural Guidelines

1. **UI Layer Isolation**: Next.js pages and Shadcn components inside `src/app/` and `src/components/` must **never** call `supabase.from(...)` directly.
2. **Service Layer Responsibility**: All CRUD operations, tenant isolation checks, and business rules belong exclusively in `src/services/`.
3. **Type Contracts**: Functions in `src/services/` import data types strictly from `src/types/supabase.ts` (auto-generated via `npm run db:types`).
