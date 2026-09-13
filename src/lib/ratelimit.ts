import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW = "10 s";
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isRedisConfigured = Boolean(
  REDIS_URL &&
  REDIS_TOKEN &&
  !REDIS_URL.includes("your-upstash") &&
  !REDIS_URL.includes("placeholder")
);

export type RateLimitCheck = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
  pending?: Promise<unknown>;
  reason?: "redis_not_configured" | "upstash_error";
};

const redis = isRedisConfigured
  ? new Redis({
      url: REDIS_URL!,
      token: REDIS_TOKEN!,
    })
  : null;

const defaultLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DEFAULT_LIMIT, DEFAULT_WINDOW),
      analytics: true,
      prefix: "dannflow:ratelimit",
    })
  : null;

const inMemoryStore = new Map<string, { count: number; reset: number }>();

function inMemoryRateLimit(key: string, limit = DEFAULT_LIMIT, windowSec = 10): RateLimitCheck {
  const now = Date.now();
  const entry = inMemoryStore.get(key);
  if (!entry || now > entry.reset) {
    inMemoryStore.set(key, { count: 1, reset: now + windowSec * 1000 });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowSec * 1000,
      retryAfter: 0,
    };
  }
  if (entry.count < limit) {
    entry.count++;
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: entry.reset,
      retryAfter: 0,
    };
  }
  return {
    success: false,
    limit,
    remaining: 0,
    reset: entry.reset,
    retryAfter: Math.max(1, Math.ceil((entry.reset - now) / 1000)),
  };
}

function retryAfterFromReset(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

/**
 * Universal rate limiter for server actions and route handlers.
 * Use a namespace so unrelated actions do not share the same bucket.
 */
export async function verifyRateLimit(
  identifier: string,
  namespace = "default"
): Promise<RateLimitCheck> {
  const key = `${namespace}:${identifier}`;

  if (!defaultLimiter) {
    return inMemoryRateLimit(key);
  }

  try {
    const result = await defaultLimiter.limit(key);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: retryAfterFromReset(result.reset),
      pending: result.pending,
    };
  } catch (error) {
    console.warn("Upstash Redis rate limiter failed, falling back to in-memory limiter:", error);
    return inMemoryRateLimit(key);
  }
}

export function isDurableRateLimitConfigured(): boolean {
  return isRedisConfigured;
}
