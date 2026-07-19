# Redis Rate Limiting for Production Paths

Use a durable Redis-backed limiter for expensive or sensitive production routes. This is especially important on serverless hosts such as Vercel, where requests may run on different instances and an in-memory counter only protects one process.

## When To Use This Pattern

Use Redis rate limiting for:

- AI chat, summarization, or other paid API routes.
- Authentication-adjacent server actions such as profile updates, invite flows, or password reset requests.
- Any endpoint where abuse could create cost, spam, or availability problems.

Avoid relying on process-local `Map` counters in production. They reset on deploy, disappear when an instance shuts down, and do not share state across multiple instances.

## Recommended Provider

Upstash Redis works well for DannFlow projects because it provides a REST API that fits serverless runtimes.

Create a Redis database in Upstash, then add these server-only environment variables:

```bash
UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
```

Do not prefix these with `NEXT_PUBLIC_`. The token must stay server-side.

## Setup Checklist

1. Open Upstash Console and create a Redis database.
2. Choose the region closest to the app's users.
3. Use the Free plan while validating the implementation, if the usage fits the free limits.
4. Copy the REST URL and REST token from the database connection panel.
5. Add both values to `.env.local`.
6. Add both values to the deployment platform, such as Vercel environment variables.
7. Restart the local dev server or redeploy the app.

## Implementation Shape

Keep the limiter in a shared server-only helper, usually under `src/lib/ratelimit.ts` or the project's equivalent server utility folder.

Recommended behavior:

- Use route-specific prefixes so unrelated actions do not share one bucket.
- Return `429 Too Many Requests` when a caller exceeds the limit.
- Include a `Retry-After` header when possible.
- In local development, allow a clearly logged bypass when Redis env vars are missing.
- In production, fail closed if Redis is missing or unreachable on expensive/sensitive paths.

DannFlow's template helper exports:

- `verifyRateLimit(identifier, namespace)` for server actions and route handlers.
- `isDurableRateLimitConfigured()` for setup checks and diagnostics.

Use the `namespace` argument to isolate different workflows:

```ts
const { success, retryAfter } = await verifyRateLimit(user.id, "profile-update");
```

Example limits:

- AI messages: 10 requests per user per minute.
- Sensitive actions: 5 requests per user per 10 seconds.

## Verification

Run automated checks first:

```bash
pnpm exec tsc --noEmit
pnpm build
```

Then test the limiter directly with a burst against a throwaway key. A passing test should allow the configured number of requests and block the next one.

For browser verification, send repeated authenticated requests to the protected API route. The expected result is at least one `429` response with a clear retry message.

## Production Notes

Before closing the task or contributing the pattern upstream:

- Confirm the deployment has `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Confirm no Redis token appears in client-side code or logs.
- Confirm the rate-limit route still authenticates before using a user-scoped key.
- Confirm provider analytics or command metrics show Redis activity during testing.

## Upstream Contribution Notes

When contributing this pattern to DannFlow, keep the guidance generic. Do not include app names, real Redis URLs, tokens, user IDs, or project-specific API route names unless they are clearly marked as examples.
