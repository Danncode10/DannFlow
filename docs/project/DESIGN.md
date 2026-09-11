# Visual UI/UX Design System

**Project Name:** [Your Project Name] (Built on DannFlow)
**Date:** [YYYY-MM-DD]

> **⚠️ REPOSITORY MODE RULE:**
>
> - If you are in the `DannFlow` template repository, **DO NOT** add specific product styling, client colors, or custom fonts here. Keep this file as the generic baseline.
> - If you are in a **Project Mode** repository (built from DannFlow), you **MUST** update this file to reflect your specific application's design system.

---

## 1. DannFlow Baseline Design Rules (Strict)

This project strictly adheres to the DannFlow "Vibe Coding" aesthetic and standards. These must not be violated:

- **Mobile-First:** Every component must be fully responsive, starting at 375px. No horizontal scroll.
- **Touch Targets:** All interactive elements (buttons, inputs, links) must be at minimum 48px tall.
- **Visual Hierarchy:** Use font-size, weight, and spacing intentionally. Headings must feel like headings.
- **Form UX:** Labels go ABOVE inputs, never as placeholder-only. Inputs must have visible focus rings using `ring-ring`.
- **Spacing Rhythm:** Use consistent spacing scale (p-4, p-6, gap-4, gap-6). Never cram elements together.
- **Feedback States:** Every button must have a loading state. Every input must have an error state. Use `text-destructive` for errors.
- **Empty States:** Never leave a blank screen. Use a centered icon + message for empty or loading states.
- **Card Pattern:** Wrap all form pages in `<Card>` with `<CardHeader>`, `<CardContent>`, `<CardFooter>` from Shadcn.
- **Multi-step Forms:** Use a visible step indicator (e.g., "Step 2 of 3") with a progress bar using `bg-primary`.

## 2. Component & Token Standards

- **Semantic Tokens Only:** Use ONLY Shadcn/Tailwind semantic tokens (e.g., `bg-background`, `bg-card`, `text-foreground`). Hardcoding hex codes, rgba, or generic color names (like red, white) is strictly forbidden.
- **Backgrounds:** `bg-background`, `bg-card`, `bg-muted`
- **Text:** `text-foreground`, `text-muted-foreground`, `text-primary`
- **Borders:** `border`, `border-border`, `border-input`
- **Buttons:** Always use Shadcn `<Button variant="default">` or `variant="outline"` — never raw `<button>`.

## 3. Project-Specific Theme & Branding

_(Define your project's unique brand identity here. e.g., Primary colors configured in CSS, specific font families injected via Next.js.)_

- **Font Family:** [e.g., Inter, Geist]
- **Primary Color Identity:** [e.g., Slate, Zinc, Custom HSL]
- **Logo/Assets:** [Paths to specific SVGs]
