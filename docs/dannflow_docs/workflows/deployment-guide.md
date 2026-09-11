# Deployment Guide

This guide covers deploying a DannFlow project to production using Vercel (for the frontend/API) and Supabase (for the database).

## 1. Supabase Production Setup

1. Create a new Supabase project in the Supabase Dashboard.
2. Link your local project to the remote project using the Supabase CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
3. Push your migrations to the production database:
   ```bash
   supabase db push
   ```

## 2. Vercel Deployment

1. Connect your GitHub repository to Vercel.
2. Set the Environment Variables in Vercel. You must include at minimum:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**. Vercel will automatically build the Next.js App Router project and provision Serverless Functions for your API routes.

## 3. Post-Deployment Checks

- Verify that users can sign up and authenticate.
- Verify that Row Level Security (RLS) is protecting data.
