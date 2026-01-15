<script lang="ts">
  import { SignInForm, SignUpForm } from '@sambung-chat/ui';
  import { AuthLayout } from '@sambung-chat/ui';
  import { authClient } from '../../../lib/auth-client';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import type { PageData } from './$types';

  let showSignIn = $state(true);
  let isLoading = $state(false);

  // Props from server load
  interface Props {
    showSSO: boolean;
  }

  let { data }: { data: PageData } = $props();

  // Track session state to wait for it to be established after login
  const sessionQuery = authClient.useSession();

  async function handleSignIn(credentials: { email: string; password: string }) {
    isLoading = true;

    try {
      const result = await authClient.signIn.email(credentials);

      if (result.error) {
        const error = result.error;
        const message =
          typeof error === 'string'
            ? error
            : (error as any)?.message || 'Failed to sign in. Please check your credentials.';

        toast.error(message);
        isLoading = false;
        return;
      }

      toast.success('Welcome back!');

      // Wait for session to be established before navigating
      // This prevents the race condition where navigation happens before cookie is set
      await waitForSession();
      goto('/app/chat');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(message);
      isLoading = false;
    }
  }

  // Wait for session to be established (with timeout)
  async function waitForSession(): Promise<void> {
    const maxWaitTime = 5000; // 5 seconds max wait
    const checkInterval = 100; // Check every 100ms
    let elapsedTime = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        elapsedTime += checkInterval;

        // Check if session is established
        if ($sessionQuery.data?.user) {
          clearInterval(interval);
          resolve();
        } else if (elapsedTime >= maxWaitTime) {
          clearInterval(interval);
          reject(new Error('Session establishment timeout'));
        }
      }, checkInterval);
    });
  }

  async function handleSSO() {
    isLoading = true;

    try {
      const result = await authClient.signIn.oauth2({
        providerId: 'keycloak',
        callbackURL: `${window.location.origin}/app/chat`,
      });

      if (result.error) {
        const error = result.error;
        const message =
          typeof error === 'string'
            ? error
            : (error as any)?.message || 'Failed to sign in with SSO. Please try again.';

        toast.error(message);
        isLoading = false;
      }
      // Note: If successful, the redirect will happen automatically
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(message);
      isLoading = false;
    }
  }

  async function handleSignUp(credentials: { name: string; email: string; password: string }) {
    isLoading = true;

    try {
      const result = await authClient.signUp.email(credentials);

      if (result.error) {
        const error = result.error;
        const message =
          typeof error === 'string'
            ? error
            : (error as any)?.message || 'Failed to create account. Please try again.';

        toast.error(message);
        isLoading = false;
        return;
      }

      toast.success('Account created successfully!');

      // Wait for session to be established before navigating
      await waitForSession();
      goto('/app/chat');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(message);
      isLoading = false;
    }
  }

  function switchToSignUp() {
    showSignIn = false;
  }

  function switchToSignIn() {
    showSignIn = true;
  }
</script>

{#if showSignIn}
  <AuthLayout>
    <div class="w-full max-w-sm space-y-6">
      <!-- shadcn-svelte pattern: title and description -->
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Login</h1>
        <p class="text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>

      <SignInForm
        onSubmit={handleSignIn}
        onSSO={handleSSO}
        {switchToSignUp}
        {isLoading}
        showSSO={data.showSSO}
        showEmailPassword={data.showEmailPassword}
      />
    </div>
  </AuthLayout>
{:else}
  <AuthLayout>
    <div class="w-full max-w-sm space-y-6">
      <!-- shadcn-svelte pattern: title and description -->
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
      </div>

      <SignUpForm onSubmit={handleSignUp} {switchToSignIn} {isLoading} />
    </div>
  </AuthLayout>
{/if}
