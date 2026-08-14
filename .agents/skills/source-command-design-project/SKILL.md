---
name: "source-command-design-project"
description: "Apply approved product theme and copy to an existing template without altering its structure, interactions, or protected hero media."
---

# /design-project — template adaptation only

Use this skill when the user runs `design-project`. It is a **theme and copy pass**, never a redesign.

## Absolute preservation contract

Keep every existing page, section, component, section order, route, navigation item, component hierarchy, client/server boundary, layout, responsive behavior, interaction, animation, and data flow exactly as it is.

Do not delete, replace, rewrite, move, merge, scaffold, add, remove, or reorder components or sections. Do not replace a visual concept or preview with a new one. Do not change an existing section into a different content type. Palette approval authorizes theme and copy changes only; it never authorizes layout, motion, media, or structure changes.

## Hero-media freeze — absolute

`/design-project` has no authority over hero media. Never edit, delete, replace, move, optimize, rename, regenerate, re-encode, add, or change the use of:

- `public/hero-poster.avif`
- `public/hero-background.mp4`
- `public/hero-background.webm`

Also preserve every media-related detail in `src/components/landing/hero.tsx`: imports, markup, source selection, fallback behavior, poster, playback, hooks, helpers, props, CSS classes, and the typewriter behavior. The dedicated later hero-media task is the only task allowed to change those assets or that behavior.

## Workflow

1. Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `src/app/globals.css`, the existing landing components, and the navigation.
2. Inspect before proposing. Identify the existing semantic tokens and the exact text content that can be changed in place.
3. Propose a color direction and copy scope. State exactly: **"theme/copy-only; hierarchy, media, layout, and interactions preserved."**
4. Wait for explicit approval before editing.
5. After approval, change only:
   - existing semantic color tokens in `src/app/globals.css`; and
   - existing product-facing text within the current components' existing text slots.
6. Verify the existing media, typewriter, sections, and interactions remain present. Run relevant lint/type checks and report any pre-existing failures separately.

## Hard rules

- Do not use placeholder copy; ask when a real business fact is required.
- Use semantic tokens and preserve existing accessibility and responsive behavior.
- Never commit automatically.
