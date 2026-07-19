import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW = "10 s";
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isRedisConfigured = Boolean(REDIS_URL && REDIS_TOKEN);
const isProduction = process.env.NODE_ENV === "production";

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

function retryAfterFromReset(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

function unavailableResult(
  reason: RateLimitCheck["reason"],
  limit = DEFAULT_LIMIT
): RateLimitCheck {
  return {
    success: false,
    limit,
    remaining: 0,
    reset: Date.now() + 60 * 1000,
    retryAfter: 60,
    reason,
  };
}

function localBypassResult(limit = DEFAULT_LIMIT): RateLimitCheck {
  return {
    success: true,
    limit,
    remaining: limit,
    reset: Date.now(),
    retryAfter: 0,
    reason: "redis_not_configured",
  };
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
    if (!isProduction) {
      console.warn("Rate limiter bypassed in local development: missing Upstash Redis env vars.");
      return localBypassResult();
    }

    console.error("Rate limiter unavailable in production: missing Upstash Redis env vars.");
    return unavailableResult("redis_not_configured");
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
    console.error("Rate limiter failed:", error);

    if (!isProduction) {
      return localBypassResult();
    }

    return unavailableResult("upstash_error");
  }
}

export function isDurableRateLimitConfigured(): boolean {
  return isRedisConfigured;
}
