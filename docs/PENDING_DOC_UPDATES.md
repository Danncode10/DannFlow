<!-- Ledger cleared. Log new pending documentation updates here. -->

## [Installer & Onboarding] Clean Git Slate, Starter README & Piped Input Fix
- **Files changed:** `install.sh`
- **Description:**
  - Fixed stdin detection (`[ -r /dev/tty ]`) so piped installs via `curl -sSL ... | bash` interactively prompt for project name and project repo URL instead of silently falling back to `my-app`.
  - Replaced template Git history retention with clean-slate initialization (`rm -rf .git && git init -b main`). Sets `upstream` to `DannFlow` (fetch-only, push disabled) and optional `origin` to the project repository without inheriting 100+ template commits or causing false upstream push errors.
  - Generates a clean starter `README.md` directing users to edit `PROJECT_CONTEXT.md` and run `/masterplan-init`.
  - Made Ruflo installation non-blocking via `npm run setup:ruflo` to prevent installer hangs.
- **Affected Documentation to Update:** `docs/dannflow_docs/setup/setup-flow.md`, `README.md`.
