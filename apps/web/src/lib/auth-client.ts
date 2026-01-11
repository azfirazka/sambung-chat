import { PUBLIC_SERVER_URL } from '$env/dynamic/public';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
  baseURL: PUBLIC_SERVER_URL,
});
