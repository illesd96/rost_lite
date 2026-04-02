import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

/**
 * Simple in-memory rate limiter for API routes.
 * Returns null if under limit, or a 429 NextResponse if exceeded.
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): NextResponse | null {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.windowSeconds * 1000,
    });
    return null;
  }

  entry.count++;

  if (entry.count > options.limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

  return null;
}

/**
 * Extract a client identifier from request headers.
 * Uses x-forwarded-for (common behind proxies/Vercel), falls back to x-real-ip.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
