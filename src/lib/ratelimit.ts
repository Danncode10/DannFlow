import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasKeys = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis only if keys are present to prevent crashes during local setup
const redis = hasKeys
  ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
  : null;

// Standard Vibe Limit: 5 requests every 10 seconds per identifier
const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true,
  })
  : null;

/**
 * Universal Rate Limiter for Server Actions.
 * Drop `await verifyRateLimit(user.id)` at the top of any sensitive action.
 */
export async function verifyRateLimit(identifier: string) {
  if (!ratelimit) {
    console.warn("⚠️ Rate limiter bypassed: Missing Upstash Redis ENV keys.");
    return { success: true }; // Fail open for local dev without keys
  }

  return await ratelimit.limit(identifier);
}
