<script lang="ts">
  import { Users, UserPlus, Shield } from '@lucide/svelte';
  import { ButtonRoot } from '@sambung-chat/ui';
  import { cn } from '@sambung-chat/ui';

  // TODO: Load members from API
  const members = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      avatar: '',
      status: 'online',
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      avatar: '',
      status: 'offline',
      joinedAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'member',
      avatar: '',
      status: 'online',
      joinedAt: '2024-03-10',
    },
  ];

  const roleColors = {
    owner: 'bg-yellow-500/10 text-yellow-500',
    admin: 'bg-blue-500/10 text-blue-500',
    member: 'bg-gray-500/10 text-gray-500',
  };
</script>

<div class="container max-w-6xl mx-auto py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-primary/10 rounded-lg">
        <Users class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-2xl font-semibold">Team Members</h1>
        <p class="text-muted-foreground text-sm">Manage your team members and permissions</p>
      </div>
    </div>
    <ButtonRoot>
      <UserPlus class="w-4 h-4 mr-2" />
      Invite Member
    </ButtonRoot>
  </div>

  <!-- Members List -->
  <div class="bg-card border border-border rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Member</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
            <th class="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each members as member (member.id)}
            <tr class="border-t border-border">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-primary">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium">{member.name}</div>
                    <div class="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    roleColors[member.role as keyof typeof roleColors]
                  )}
                >
                  <Shield class="w-3 h-3 mr-1" />
                  {member.role}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div
                    class={cn(
                      'w-2 h-2 rounded-full',
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  ></div>
                  <span class="text-sm">{member.status}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">
                {new Date(member.joinedAt).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  aria-label="View actions"
                >
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
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Empty State -->
  {#if members.length === 0}
    <div class="text-center py-12">
      <Users class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-2">No members yet</h3>
      <p class="text-muted-foreground mb-4">Invite team members to collaborate</p>
      <ButtonRoot>
        <UserPlus class="w-4 h-4 mr-2" />
        Invite First Member
      </ButtonRoot>
    </div>
  {/if}
</div>
