import { redirect } from '@sveltejs/kit';
import { auth } from '@sambung-chat/auth';

export const load = async ({ url, cookies, request }) => {
  // Get session cookie from request
  const sessionCookie = request.headers.get('cookie') || '';

  // Verify session using Better Auth server instance
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: sessionCookie,
    }),
  });

  // Redirect to login if no session
  if (!session?.user) {
    const redirectTo = url.pathname;
    redirect(302, `/login?redirect=${encodeURIComponent(redirectTo)}`);
  }

  return {
    session: {
      user: session.user,
      session: session.session,
    },
  };
};
