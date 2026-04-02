import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const handler = NextAuth(authOptions);

// Wrap POST to add rate limiting on sign-in attempts
async function rateLimitedPost(req: NextRequest, ctx: any) {
  const rateLimitResponse = rateLimit(`auth:${getClientIp(req)}`, { limit: 10, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;
  return handler(req, ctx);
}

export { handler as GET, rateLimitedPost as POST };
