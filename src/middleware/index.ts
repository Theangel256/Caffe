import { defineMiddleware } from 'astro/middleware';
import { unsign } from 'cookie-signature';

const RATE_LIMIT_COOKIE = 'rate_limit';
const RATE_LIMIT_WINDOW = 2000; // 2 seconds
const RATE_LIMIT_MAX = 5; // Max requests per window
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-32-char-secret';

export const onRequest = defineMiddleware(async (context, next) => {
  // Rate Limiting
  let rateLimitData = context.cookies.get(RATE_LIMIT_COOKIE)?.json() || { count: 0, last: 0 };
  const now = Date.now();

  if (rateLimitData.last && now - rateLimitData.last < RATE_LIMIT_WINDOW) {
    rateLimitData.count++;
    if (rateLimitData.count > RATE_LIMIT_MAX) {
      return new Response('Too many requests', { status: 429 });
    }
  } else {
    rateLimitData = { count: 1, last: now };
  }

  context.cookies.set(RATE_LIMIT_COOKIE, rateLimitData, {
    path: '/',
    httpOnly: true,
    maxAge: RATE_LIMIT_WINDOW / 1000,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  });

  // Session Management
  const sessionCookie = context.cookies.get('session_data')?.value || '';
  let sessionData = null;
  const unsignedSession = unsign(sessionCookie, SESSION_SECRET);
  if (unsignedSession !== false) {
    try {
      sessionData = JSON.parse(unsignedSession);
      console.log('Session loaded:', sessionData.username); // DEBUG
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

// getSession (opcional, para usar en rutas)
export async function getSession(context: any) {
  const sessionCookie = context.cookies.get('session_data')?.value || '';
  const unsignedSession = unsign(sessionCookie, SESSION_SECRET);
  if (unsignedSession !== false) {
    try {
      return JSON.parse(unsignedSession);
    } catch (e) {
      console.error('Invalid session data:', e);
      return null;
    }
  }
  return null;
}

// Type safety for locals
declare module 'astro' {
  interface Locals {
    user: {
      id: string;
      username: string;
      avatar: string;
      accessToken?: string;
      guilds?: Array<{
        id: string;
        name: string;
        permissions: number;
      }>;
    } | null;
  }
}