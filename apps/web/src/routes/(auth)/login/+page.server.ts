import { redirect } from '@sveltejs/kit';
import { auth } from '@sambung-chat/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies, request }) => {
  // === DIAGNOSTIC LOGGING: Phase 1 - Root Cause Investigation ===
  console.log('[LOGIN PAGE] === Page load start ===');

  // Get session cookie from request
  const sessionCookie = request.headers.get('cookie') || '';

  // Verify session using Better Auth server instance
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: sessionCookie,
    }),
  });

  // Redirect to app if already authenticated
  if (session?.user) {
    const redirectTo = new URLSearchParams(url.search).get('redirect') || '/app/chat';
    console.log('[LOGIN PAGE] User already authenticated, redirecting to:', redirectTo);
    redirect(302, redirectTo);
  }

  // Check which authentication methods are enabled
  // Read directly from process.env which is available in SSR
  const isSSOEnabled = process.env.PUBLIC_KEYCLOAK_ENABLED === 'true';
  console.log('[LOGIN PAGE] PUBLIC_KEYCLOAK_ENABLED:', process.env.PUBLIC_KEYCLOAK_ENABLED);
  console.log('[LOGIN PAGE] isSSOEnabled:', isSSOEnabled);

  // Check both PUBLIC_ and non-PUBLIC_ variants for flexibility
  const isEmailPasswordEnabled =
    process.env.PUBLIC_EMAIL_PASSWORD_ENABLED !== 'false' &&
    process.env.EMAIL_PASSWORD_ENABLED !== 'false';
  console.log(
    '[LOGIN PAGE] PUBLIC_EMAIL_PASSWORD_ENABLED:',
    process.env.PUBLIC_EMAIL_PASSWORD_ENABLED
  );
  console.log('[LOGIN PAGE] EMAIL_PASSWORD_ENABLED:', process.env.EMAIL_PASSWORD_ENABLED);
  console.log('[LOGIN PAGE] isEmailPasswordEnabled:', isEmailPasswordEnabled);

  console.log('[LOGIN PAGE] Returning data:', {
    showSSO: isSSOEnabled,
    showEmailPassword: isEmailPasswordEnabled,
  });

  return {
    showSSO: isSSOEnabled,
    showEmailPassword: isEmailPasswordEnabled,
  };
};
