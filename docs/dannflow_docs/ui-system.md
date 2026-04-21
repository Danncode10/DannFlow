# DannFlow UI System

The DannFlow UI is built on the principles of **Clarity, Contrast, and Context**. It uses a customized Shadcn-inspired design system tailored for AI-native development.

## 🎨 Color Palette (OKLCH)

We use the `oklch` color space in Tailwind 4.0 for more perceptual uniformity and vibrant gradients.

| Variable | Usage | Vibe |
| :--- | :--- | :--- |
| `background` | Page background | Deep neutral (Dark Mode by default) |
| `primary` | Call to actions | High contrast, bold |
| `accent` | Secondary highlights | Subtle interaction feedback |
| `muted` | De-emphasized text | Secondary metadata, labels |
| `border` | Component boundaries | Fine lines, consistent spacing |

To edit the entire theme, simply modify the variables in `src/app/globals.css`.

## 🔤 Typography

- **Headings**: `font-mono` (Geist Mono) - Represents the "Code" and "Logic" side of architecture. Usually italicized for a premium feel.
- **Body**: `font-sans` (Geist Sans / Inter) - Optimized for readability in dashboards and documentation.
- **Monospace**: Used for all system statuses, MCP outputs, and IDs.

## 🧩 Component Philosophy

1.  **Glassmorphism**: Use `backdrop-blur-md` and semi-transparent backgrounds for cards and overlays to create depth.
2.  **Interactive Feedback**: Every interactive element must have a `hover` and `focus-visible` state.
3.  **Standardized Cards**: All data sections are wrapped in `Card` primitives to maintain a clean "grid" layout.

## 📱 Responsiveness

- **Mobile First**: All layouts use `flex-col` by default, expanding to `md:flex-row` or `lg:grid-cols-3` as screen size increases.
- **Identity Bar**: Floats at the top right, collapsing padding on smaller screens.
