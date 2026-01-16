<script lang="ts">
  import LoginForm from '$lib/components/login-form.svelte';
  import { authClient } from '../../../lib/auth-client';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  const sessionQuery = authClient.useSession();

  $effect(() => {
    if (mounted && !$sessionQuery.isPending && $sessionQuery.data?.user) {
      const redirectTo = new URLSearchParams($page.url.search).get('redirect') || '/app/chat';
      goto(redirectTo);
    }
  });

  async function handleSignIn(credentials: { email: string; password: string }) {
    try {
      const result = await authClient.signIn.email(credentials);

      if (result.error) {
        alert('Login failed: ' + (result.error as any)?.message || 'Unknown error');
        return;
      }

      // Wait for session and redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      goto('/app/chat');
    } catch (err) {
      alert('An unexpected error occurred');
    }
  }

  async function handleSSO() {
    try {
      const callbackURL = `${$page.url.origin}/app/chat`;
      await authClient.signIn.social({
        provider: 'keycloak',
        callbackURL,
      });
    } catch (err) {
      alert('SSO failed');
    }
  }
</script>

<div class="w-full max-w-sm">
  <LoginForm onSignIn={handleSignIn} onSSO={handleSSO} />
</div>
