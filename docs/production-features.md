# 🚀 Production Features

This project isn't just a prototype shell; it is fully engineered for high scalability, real-time feedback, and secure server-side interactions. Here is an overview of the included enterprise-grade features that validate this boilerplate as production-ready:

### 1. TanStack Query (Caching & Speed)
- Client-side cache memory prevents redundant server fetch streams on component and tab navigation.
- **Optimistic UI:** State updates implement eager mutations, guaranteeing instantaneous UX responses on user forms while the system syncs to Supabase natively in the background.

### 2. Cursor-based Pagination
- Automated cursor mapping slices database requests effectively, utilizing `useInfiniteQuery`.
- Intersection Observers are bound exactly to the `BentoSkeleton` architecture natively, handling bulk API thresholds beautifully as users reach edge parameters.

### 3. Upstash Redis Rate Limiting
- A globally imported `verifyRateLimit(identfier)` function locks vulnerable Next.js Server Actions automatically (see `/src/lib/ratelimit.ts`).
- Secure logic provides fallback failsafes protecting the pipeline during local development while blocking API abuse directly via sliding-window mathematics.

### 4. Interactive Feedback (Sonner Toasts)
- Clean, non-intrusive `toast.success` and `toast.error` popup protocols ensure smooth error capture on any mutation constraints rather than trapping logs blindly in backend consoles.

### 5. Native SEO Implementations
- Automated `sitemap.ts` and `robots.ts` indexing endpoints.
- Extensive OpenGraph metadata and structured Twitter schema maps connected right to `siteConfig` inside your layouts.

### 6. Email Authentication (Gmail SMTP)
When deploying on a free `*.vercel.app` domain, email providers like Resend often block outgoing mail to prevent spam. For a 100% free solution that allows up to 500 emails/day, use **Gmail SMTP**.

#### Setup Steps:
1.  **Google App Password**: 
    - Enable **2-Step Verification** in your Google Account.
    - Generate an [App Password](https://myaccount.google.com/apppasswords) and save the 16-character code.
2.  **Supabase SMTP**: 
    - Enable Custom SMTP in **Auth > Notifications > Email**.
    - Host: `smtp.gmail.com` | Port: `465`
    - User/Pass: Your Gmail & the 16-character App Password.
3.  **Redirects**: 
    - Set your **Site URL** and **Redirect URLs** (e.g., `/auth/callback`) in Supabase to your live Vercel link to ensure confirmation links work.
