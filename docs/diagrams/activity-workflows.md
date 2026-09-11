# 🔄 Activity & Workflow Diagrams

This document contains key workflow and activity diagrams illustrating core operations in **DannFlow**.

---

## 1. User Authentication & Profile Bootstrapping Workflow

```mermaid
flowchart TD
    A["👤 User initiates Auth (OAuth/Email)"] --> B["⚡ Supabase Auth processes credentials"]
    B -->|Success| C["Postgres Auth Trigger (`on_auth_user_created`)"]
    B -->|Failure| D["❌ Return Auth Error to Client"]

    C --> E["Insert into `public.profiles` table"]
    E --> F["Generate JWT Session Cookie"]
    F --> G["Next.js Server Middleware validates Session"]
    G --> H["Render Protected App View"]
```

---

## 2. Masterplan Task & Documentation Lifecycle Workflow

```mermaid
flowchart TD
    Start["📋 User requests Feature / Task"] --> SearchPlan["🔍 Agent checks MASTERPLAN.md & GitHub Project"]

    SearchPlan --> TaskExists{"Task exists in Masterplan?"}
    TaskExists -- No --> WarnUser["⚠️ Warn user & add task to MASTERPLAN.md"]
    WarnUser --> MoveInProgress
    TaskExists -- Yes --> MoveInProgress["📌 Move task to 'In progress' on GitHub Board"]

    MoveInProgress --> EditCode["💻 Implement changes in Service Layer & UI"]
    EditCode --> RunTests["🧪 Run lint & typechecks (`npm run review`)"]

    RunTests --> TaskComplete{"Is this the last task in Phase?"}
    TaskComplete -- Yes --> DocTask["📚 Execute [PX.DOC] Finalize Documentation & Diagrams"]
    TaskComplete -- No --> UpdateDocs["📝 Update affected docs/diagrams if services/types changed"]

    DocTask --> CloseTask["✅ Run `/close-task` (Move card to Done & mark checked)"]
    UpdateDocs --> CloseTask
    CloseTask --> Commit["🎉 Commit with Conventional Commit message"]
```

---

## 3. Database Migration & Type Sync Workflow

```mermaid
flowchart TD
    A["✏️ Developer edits schema / SQL in `supabase/migrations/`"] --> B["🚀 Run `npm run db:migrate`"]
    B --> C["Supabase CLI pushes SQL to remote PostgreSQL DB"]
    C --> D["⚡ Run `npm run db:types`"]
    D --> E["Supabase CLI generates TypeScript definitions"]
    E --> F["🔄 Refresh `src/types/supabase.ts`"]
    F --> G["🔒 Service Layer (`src/services/`) consumes strict types"]
```
