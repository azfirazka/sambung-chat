<script lang="ts">
  import { Settings } from '@lucide/svelte';

  // TODO: Load settings from API
  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your profile information',
      icon: 'user',
    },
    {
      id: 'account',
      title: 'Account',
      description: 'Account settings and preferences',
      icon: 'settings',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: 'palette',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: 'bell',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Passwords, sessions, and 2FA',
      icon: 'shield',
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Billing information and plans',
      icon: 'credit-card',
    },
  ];
</script>

<div class="container max-w-4xl mx-auto py-8">
  <div class="flex items-center gap-3 mb-8">
    <div class="p-2 bg-primary/10 rounded-lg">
      <Settings class="w-6 h-6 text-primary" />
    </div>
    <div>
      <h1 class="text-2xl font-semibold">Settings</h1>
      <p class="text-muted-foreground text-sm">Manage your account settings and preferences</p>
    </div>
  </div>

  <div class="grid gap-4">
    {#each settingsSections as section (section.id)}
      <button
        class="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left w-full"
      >
        <div class="p-2 bg-muted rounded-md">
          <span class="text-lg"
            >{section.icon === 'user'
              ? '👤'
              : section.icon === 'settings'
                ? '⚙️'
                : section.icon === 'palette'
                  ? '🎨'
                  : section.icon === 'bell'
                    ? '🔔'
                    : section.icon === 'shield'
                      ? '🛡️'
                      : '💳'}</span
          >
        </div>
        <div class="flex-1">
          <h3 class="font-medium">{section.title}</h3>
          <p class="text-sm text-muted-foreground">{section.description}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-muted-foreground"
        >
          <polyline points="9 18 15 12 9 6" />
          <path d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    {/each}
  </div>
</div>
