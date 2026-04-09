# The "DannFlow" Philosophy: Vibe Coding for Students

DannFlow is a "Vibe Coding" architecture designed to make AI-native development professional, predictable, and 100% free for students.

- **The Developer (Architect)**: You provide the vision, the "vibe," and the logic steering.
- **The AI (Builder)**: Uses "Eyes" (MCPs) to see your database, code history, and design.
- **The Workflow**: We build "Live" in the cloud. We don't guess; we sync.

## 🛠 Project Customization

To swap the branding for a new project:
1. **Site Secrets**: Update `.env.local` with your new `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_GITHUB_URL`.
2. **Central Config**: The system uses `src/lib/config.ts` as a single source of truth. All components (Navbar, Footer, Hero) pull from here.
3. **Icons**: Replace `src/app/favicon.ico` with your new brand asset.

