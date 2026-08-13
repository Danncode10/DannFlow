# MASTERPLAN — Not initialized

> Run `/new-project` to describe and initialize this SaaS. Then create a non-draft GitHub Project in Kanban/Board layout with `Backlog`, `Ready`, `In progress`, and `Done` statuses, and run `/masterplan-init`.

---

## **PHASE 0: Initialized by `/masterplan-init`**

Phase 0 is intentionally empty in the DannFlow template. `/masterplan-init` replaces this section with project-specific, command-driven readiness tasks and syncs those cards to the linked GitHub Project.

---

## **PHASE 1+: Future phases**

After Phase 0 is initialized, run `/make-masterplan Phase 1` when you are ready to expand the next phase. Do not add cards for placeholders.

---

....


## **Notes**

- Use ordered task IDs in every phase task: `[P0.1]`, `[P0.2]`, `[P1.1]`, `[P2.1]`.
- If a phase has lettered subphases, keep the letter in the task ID: `[P3A.1]`, `[P3B.1]`.
- Run `/update-masterplan` after editing tasks so the linked GitHub Project stays in sync.

---
