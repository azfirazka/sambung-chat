import { auth } from '@sambung-chat/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Debug: Log cookies received
  const cookieHeader = event.request.headers.get('cookie');
  console.log('[HOOKS] Cookies:', cookieHeader || 'NONE');
  if (cookieHeader) {
    const hasSessionToken = cookieHeader.includes('sambungchat-auth.session_token');
    console.log('[HOOKS] Has sambungchat-auth.session_token:', hasSessionToken ? 'YES' : 'NO');
  }

  // Fetch current session from Better Auth
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  // Debug logging
  const path = event.url.pathname;
  console.log('[HOOKS] Path:', path);
  console.log('[HOOKS] Session:', session ? 'EXISTS' : 'NONE');
  if (session?.user) {
    console.log('[HOOKS] User:', session.user.email);
  }

  // Make session and user available on server
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }
  // Don't set to null - let the defaults handle it

  return svelteKitHandler({ event, resolve, auth, building });
};
