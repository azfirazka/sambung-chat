import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { url, locals } = event;

  // Use event.locals.user (already populated by hooks.server.ts)
  if (locals.user) {
    const redirectTo = url.searchParams.get('redirect') || '/app/chat';
    redirect(302, redirectTo);
  }

  // Check which authentication methods are enabled
  const isSSOEnabled = process.env.PUBLIC_KEYCLOAK_ENABLED === 'true';
  const isEmailPasswordEnabled =
    process.env.PUBLIC_EMAIL_PASSWORD_ENABLED !== 'false' &&
    process.env.EMAIL_PASSWORD_ENABLED !== 'false';

  return {
    showSSO: isSSOEnabled,
    showEmailPassword: isEmailPasswordEnabled,
  };
};
