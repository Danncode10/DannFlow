# 🚀DannFlow (2026 Edition)

Welcome to DannFlow, the ultimate AI-optimized boilerplate for **Next.js**, **Supabase**, and **Vercel**. 

This repository is built for **Vibe Coding**—a methodology where you focus on concepts, prompts, and architecture while the AI handles the implementation.

## ⚡ Quick Start

Run this in your terminal to get the engine started:
```bash
git clone https://github.com/Danncode10/DannFlow .
npm install
npm run dev
```

*Note: Add your environment variables to `.env.local` and run `npm run update-types` to sync your schema. Use `npm run checkpoint` to snapshot your database.*

## 🎨 Branding & Customization

This template is designed to be rebranded in seconds:
- **Global Config**: Modify `src/lib/config.ts` to change the site name, GitHub link, and description.
- **Env Variables**: Set `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_GITHUB_URL` in `.env.local`.
- **Favicon**: Replace `src/app/favicon.ico` with your brand's icon.


## 📚 In-Depth Documentation

We moved all detailed explanations out of the README so you have a clean setup experience. For the specific "Vibe Way", checkout the `docs/` folder:

- [The DannFlow Philosophy](docs/methodology.md) - Learn the "Vibe Coding" philosophy designed for students.
- [The Holy Trinity](docs/the-holy-trinity.md) - Understand the "Eyes, Blueprint, and Action" file structure.
- [MCP Trinity Setup](docs/mcp-setup.md) - Step-by-step guides for powering up the AI.
- [The Time Machine Workflow](docs/backups-and-sync.md) - Learn the crucial loop of changing, syncing, and checkpointing.
- [Production Ready Features](docs/production-features.md) - Details on caching, rate limits, SEO, and **Gmail SMTP workaround for free auth**.

## 🚀 Zero-Cost Setup for Students

If you want to use DannFlow without spinning up a live, paid Supabase instance right away, you can use our built-in SQL backups!

1. Check out the `/supabase/backups/` folder.
2. We supply the latest schema snapshot there (e.g. `schema-MM-DD-YYYY-HH-MM.sql`).
3. Push the backup schema locally using `npx supabase start`.
4. **Email Fix**: No custom domain? Use **Gmail SMTP** in your Supabase dashboard to send unlimited free auth emails even on a `.vercel.app` domain. See the [full guide here](docs/production-features.md#6-email-authentication-gmail-smtp).

---
*Built for speed. Structured for Agents. Optimized for the Vibe.*