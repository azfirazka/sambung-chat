import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const user = event.locals.user;
  const session = event.locals.session;

  // Debug logging
  console.log('[APP LAYOUT] User:', user?.email || 'NOT LOGGED IN');
  console.log('[APP LAYOUT] Session:', session ? 'EXISTS' : 'NONE');

  if (!user) {
    console.log('[APP LAYOUT] Redirecting to /login (no user)');
    redirect(302, '/login');
  }

  return {
    user,
    session,
  };
};
