import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client if environment variables are provided
export const redis = url && token ? new Redis({ url, token }) : null;

// Rate limiter: 10 requests per minute for unauthenticated / guest users
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'muwasa:ratelimit',
    })
  : null;

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number }> {
  if (!ratelimit) {
    // If Redis is not yet configured, allow request (dev/offline mode)
    return { success: true };
  }
  const result = await ratelimit.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
  };
}
