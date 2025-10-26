import { defineMiddleware } from 'astro/middleware';
import { parse, serialize } from 'cookie';
import { sign, unsign } from 'cookie-signature';

const RATE_LIMIT_COOKIE = 'rate_limit';
const RATE_LIMIT_WINDOW = 2000; // 2 seconds
const RATE_LIMIT_MAX = 5; // Max requests per window
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-32-char-secret'; // Fallback for dev

export const onRequest = defineMiddleware(async (context, next) => {
  // Rate Limiting
  const cookieHeader = context.request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  let rateLimitData = cookies[RATE_LIMIT_COOKIE] ? JSON.parse(cookies[RATE_LIMIT_COOKIE]) : { count: 0, last: 0 };
  const now = Date.now();

  if (rateLimitData.last && now - rateLimitData.last < RATE_LIMIT_WINDOW) {
    rateLimitData.count++;
    if (rateLimitData.count > RATE_LIMIT_MAX) {
      return new Response('Too many requests', { status: 429 });
    }
  } else {
    rateLimitData = { count: 1, last: now };
  }

  const signedRateLimit = serialize(RATE_LIMIT_COOKIE, JSON.stringify(rateLimitData), {
    path: '/',
    httpOnly: true,
    maxAge: RATE_LIMIT_WINDOW / 1000,
    sameSite: 'lax',
    ...(process.env.NODE_ENV === 'production' && { secure: true, domain: new URL(process.env.PUBLIC_URL).hostname }),
  });
  context.response?.headers?.append('Set-Cookie', signedRateLimit);

  // Session Management
  const sessionCookie = cookies.session_data || '';
  let sessionData = null;
  const unsignedSession = unsign(sessionCookie, SESSION_SECRET);
  if (unsignedSession !== false) {
    try {
      sessionData = JSON.parse(unsignedSession);
    } catch (e) {
      console.error('Invalid session data:', e);
    }
  }
  context.locals.user = sessionData;

  if (context.url.pathname.startsWith('/dashboard') && !context.locals.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/api/signin' },
    });
  }

  const response = await next();

  // Error Handling
  if (response.status >= 500) {
    console.error('🚨 Global Error:', context.error || 'Unknown error');
    if (context.request.headers.get('accept')?.includes('application/json')) {
      return new Response(
        JSON.stringify({ message: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response('Internal Server Error', { status: 500 });
  }

  return response;
});

// Type safety for locals
declare module 'astro' {
  interface Locals {
    user: {
      id: string;
      username: string;
      avatar: string;
      guilds?: Array<{
        id: string;
        name: string;
        permissions: number;
      }>;
      accessToken?: string;
    } | null;
  }
}