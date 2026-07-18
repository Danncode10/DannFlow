---
name: "source-command-no-conflict"
description: "Audit repo for conflicts between documentation and actual code — technology versions, features, commands, RLS, semantic tokens, folder structure. Use --fix to auto-remediate."
---

# source-command-no-conflict

Use this skill when the user asks to run the migrated source command `no-conflict`.

## Command Template

Scan the codebase and documentation to identify conflicts: mismatched technology versions, missing/obsolete features, undocumented commands, RLS gaps, hardcoded colors, and folder structure inconsistencies. 

Use `--fix` to automatically remediate conflicts (after confirmation):
- Replace hardcoded colors with semantic tokens in auth pages
- Update README with missing env vars documentation
- Fix version mismatches (e.g., Next.js 15+ → 16+)
- Add missing folders to project structure docs
- Clean up outdated references

Without `--fix`, reports findings only (read-only audit).

## Procedure

1. **Technology version audit** — Compare declared versions in `package.json` against claims in `README.md`:
   - Next.js, React, Supabase, Tailwind CSS, Node.js
   - Note any version mismatches (e.g., README says "Tailwind v4" but package.json has v3)

2. **Features audit** — Check `README.md` "What's Included" section against actual `src/` structure:
   - Does `src/app/login/` exist for the claimed "Auth" feature?
   - Does `src/app/forgot-password/` exist?
   - Does `src/components/profile-form.tsx` exist?
   - Does `src/services/` exist with ≥3 service files?

3. **Commands audit** — Verify all slash commands in `.Codex/commands/*.md` are:
   - Listed in `docs/dannflow_docs/Codex-workflow.md` 
   - Have proper description + argument-hint
   - Are exposed by `./guide.sh commands`

4. **Environment variables audit** — Compare `README.md` "Environment Variables" section against:
   - Actual keys used in code (`src/lib/config.ts`, `src/utils/supabase/*.ts`)
   - Keys defined in `.env.example`
   - Undocumented env vars in code

5. **Config audit** — Verify `src/lib/config.ts` matches README's "Personalize It" section:
   - Does `siteConfig.name` exist and match the setup instructions?
   - Does `creatorRepos` array exist?
   - Are defaults documented in README?

6. **Folder structure audit** — Check README's "Project Structure" section against actual folders:
   - Are all mentioned folders present (`src/app/`, `src/components/`, `src/services/`, etc.)?
   - Are any extra top-level folders missing from the documentation?

7. **RLS enforcement audit** — Per AGENTS.md guardrail:
   - Grep `src/services/**` for Supabase queries
   - Verify each contains `.eq('id', userId)` or equivalent ownership filter
   - Flag any public queries correctly documented as such

8. **Semantic tokens audit** — Per AGENTS.md guardrail:
   - Scan `src/components/**` for hardcoded hex colors, `rgba()`, or color names like `white`, `black`, `gray-*`
   - Report any hardcoded colors as violations of semantic-token-only rule
   - Check `src/app/globals.css` — are all `@theme` variables defined?

9. **Guardrails audit** — Check AGENTS.md against:
   - Are non-negotiable rules (RLS, semantic tokens, service layer, no `any`) enforced in code?
   - Are there any violations in recent commits?

10. **Generate report** — output formatted summary grouped by conflict type

## Output format

```
🔍 Conflict Audit Report

Technology Versions
  ✅ Next.js: 15+ (package.json: 15.x, README: "Next.js 15+") — MATCH
  ❌ Tailwind CSS: v4 claimed (package.json: ^4.0, README: "Tailwind v4") — VERSION MISMATCH
  ⚠️ Node.js: README silent, package.json "engines": "18.x" — UNDOCUMENTED

Features
  ✅ Auth (Login/Signup) — src/app/login/ exists
  ❌ Forgot Password — README claims src/app/forgot-password/, not found
  ⚠️ Version Control Tab — mentions GitHub repos, creatorRepos in src/lib/config.ts exists but README example unclear

Commands
  ✅ All 16 commands documented in Codex-workflow.md
  ⚠️ /sync-commands missing from README.md feature list (optional)

Environment Variables
  ✅ README list matches .env.example
  ⚠️ Undocumented in README: UPSTASH_REDIS_REST_URL (used in src/lib/rate-limit.ts)

Config
  ✅ siteConfig matches setup instructions
  ⚠️ creatorRepos array exists but README "Personalize It" section silent on how to update

Folder Structure
  ✅ All folders in README match src/ layout
  ⚠️ docs/dannflow_docs/ exists but not mentioned in "Project Structure" section

RLS Enforcement
  ✅ 12/12 queries in src/services/ include ownership filter
  ⚠️ src/services/public-endpoints.ts (if exists) should be flagged separately

Semantic Tokens
  ❌ src/components/button.tsx line 42: hardcoded color #2563eb — VIOLATION
  ❌ src/components/card.tsx line 15: className="bg-white" — VIOLATION (use bg-background)

Guardrails
  ✅ No `any` types found in src/
  ✅ All business logic in src/services/, not components
  ❌ src/components/form.tsx uses .eq() directly — violates service-layer rule

Summary
  ✅ 8 checks passed
  ⚠️ 5 warnings (documentation gaps, undocumented features)
  ❌ 5 violations (actual conflicts between docs and code)

Recommended fixes
  1. Update README "What's Included" → remove or add src/app/forgot-password/
  2. Fix hardcoded colors in src/components/button.tsx, src/components/card.tsx
  3. Move .eq() logic from src/components/form.tsx to src/services/
  4. Add Node.js version to README "Environment Variables" section
```

## Auto-Fix Mode (`--fix`)

When `--fix` is passed, automatically remediate:

1. **Semantic tokens in auth pages** — Replace hardcoded colors with semantic tokens:
   - `bg-[#0a0a0a]` → `bg-background`
   - `#6C47FF` (primary) → use `bg-primary`, `text-primary`
   - inline `rgba()` colors → move to CSS variables or use Tailwind semantic tokens
   - Direct: edit src/app/login/page.tsx, src/app/forgot-password/page.tsx, src/app/reset-password/page.tsx, src/app/page.tsx

2. **README environment variables** — Add missing Upstash vars to "Environment Variables" section:
   ```env
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

3. **README version mismatch** — Update Next.js claim from "15+" to "16+"

4. **Folder documentation** — Add missing folders to "Project Structure":
   - Add `src/hooks/` reference OR remove from README if directory doesn't exist
   - Document `docs/dannflow_docs/` and `supabase/backups/`

5. **Ask for confirmation** before writing any files — show exact changes to be made

## Constraints

- `--fix` always asks for confirmation before modifying files
- Show file paths and line ranges for all changes
- If `--verbose` passed with `--fix`, include before/after diffs
- Report only (no `--fix`) — never modify files
- Treat missing documentation as ⚠️ warning, not ❌ violation
- Treat code-vs-docs mismatches as ❌ violation (actual conflicts)
- RLS and semantic tokens violations are critical — highlight prominently
- Flag but do not fail on version patch differences (e.g., 15.0 vs 15.1 is OK, but 15 vs 14 is NOT)
