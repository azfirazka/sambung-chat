<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
  } from '$lib/components/ui/field/index.js';
  import { authClient } from '../../../lib/auth-client';
  import { goto } from '$app/navigation';

  let isLoading = $state(false);
  let name = $state('');
  let email = $state('');
  let password = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name || !email || !password || isLoading) return;

    isLoading = true;
    try {
      const result = await authClient.signUp.email({ name, email, password });

      if (result.error) {
        type AuthError = { message?: string };
        const errorMsg = (result.error as AuthError)?.message || 'Unknown error';
        alert('Sign up failed: ' + errorMsg);
        isLoading = false;
        return;
      }

      // Wait for session and redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      goto('/app/chat');
    } catch {
      alert('An unexpected error occurred');
      isLoading = false;
    }
  }

  async function handleSSO() {
    if (isLoading) return;
    isLoading = true;
    try {
      const callbackURL = `${window.location.origin}/app/chat`;
      await authClient.signIn.social({
        provider: 'keycloak',
        callbackURL,
      });
    } catch {
      alert('SSO failed');
      isLoading = false;
    }
  }
</script>

<div class="w-full max-w-sm">
  <Card.Root class="mx-auto w-full">
    <Card.Header>
      <Card.Title class="text-2xl">Create an account</Card.Title>
      <Card.Description>Enter your details to get started</Card.Description>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel for="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              bind:value={name}
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              bind:value={email}
              placeholder="m@example.com"
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel for="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <Button
              type="submit"
              class="w-full"
              disabled={isLoading || !name || !email || !password}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="outline"
              class="w-full"
              onclick={handleSSO}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                class="mr-2 h-4 w-4"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  d="M17 9V7c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2zm-6-2h4v2h-4V7zm6 12H9V11h8v8z"
                  fill="currentColor"
                />
                <path d="M13 14h-2v2h2v-2z" fill="currentColor" />
              </svg>
              {isLoading ? 'Redirecting...' : 'Sign Up with Keycloak'}
            </Button>
            <FieldDescription class="text-center">
              Already have an account? <a href="/login" class="underline">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Card.Content>
  </Card.Root>
</div>
