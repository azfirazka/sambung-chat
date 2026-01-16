import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;

  // If user is already authenticated, redirect to app
  if (locals.user) {
    redirect(302, '/app/chat');
  }

  return {};
};
