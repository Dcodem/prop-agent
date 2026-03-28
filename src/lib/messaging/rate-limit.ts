const MAX_MESSAGES_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store for development. Replace with Upstash Redis in production.
const store = new Map<string, RateLimitEntry>();

function getKey(sender: string, orgId: string): string {
  return `${orgId}:${sender}`;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  sender: string,
  orgId: string
): Promise<RateLimitResult> {
  const key = getKey(sender, orgId);
  const now = Date.now();
  const entry = store.get(key);

  // New window or expired window
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_MESSAGES_PER_HOUR - 1,
      resetAt: new Date(now + WINDOW_MS),
    };
  }

  // Within window
  if (entry.count >= MAX_MESSAGES_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.windowStart + WINDOW_MS),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_MESSAGES_PER_HOUR - entry.count,
    resetAt: new Date(entry.windowStart + WINDOW_MS),
  };
}

/** Reset all rate limits — for testing only. */
export function resetRateLimits(): void {
  store.clear();
}
