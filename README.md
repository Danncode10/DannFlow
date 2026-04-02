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

## 📚 In-Depth Documentation

We moved all detailed explanations out of the README so you have a clean setup experience. For the specific "Vibe Way", checkout the `docs/` folder:

- [The DannFlow Philosophy](docs/methodology.md) - Learn the "Vibe Coding" philosophy designed for students.
- [The Holy Trinity](docs/the-holy-trinity.md) - Understand the "Eyes, Blueprint, and Action" file structure.
- [MCP Trinity Setup](docs/mcp-setup.md) - Step-by-step guides for powering up the AI.
- [The Time Machine Workflow](docs/backups-and-sync.md) - Learn the crucial loop of changing, syncing, and checkpointing.

## 🚀 Zero-Cost Setup for Students

If you want to use DannFlow without spinning up a live, paid Supabase instance right away, you can use our built-in SQL backups!

1. Check out the `/supabase/backups/` folder.
2. We supply the latest schema snapshot there (e.g. `schema-MM-DD-YYYY-HH-MM.sql` or `current-schema.sql`).
3. You can run this file directly in your local Supabase instance using `npx supabase start` and push the backup schema locally.
4. You get full type-safety and local DB logic without spending a dime.

---
*Built for speed. Structured for Agents. Optimized for the Vibe.*