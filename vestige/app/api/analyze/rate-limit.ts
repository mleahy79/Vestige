// In-memory, per-instance rate limiter. Vercel/Node can run this route as
// multiple concurrent instances, so this caps abuse within a single warm
// instance rather than globally across the deployment — good enough at
// current traffic levels, but swap for a shared store (e.g. Upstash Redis)
// before this needs to hold up under real concurrent load.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

const hits = new Map<string, { count: number; windowStart: number }>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  for (const [k, entry] of hits) {
    if (now - entry.windowStart >= WINDOW_MS) hits.delete(k);
  }

  const entry = hits.get(key);
  if (!entry) {
    hits.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
