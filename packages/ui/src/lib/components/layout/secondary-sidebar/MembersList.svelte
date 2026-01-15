<script lang="ts">
  import * as Sidebar from '../../ui/sidebar';
  import { ScrollArea } from '../../ui/scroll-area';
  import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
  import { cn } from '../../../utils';
  import { Users, Crown, Shield } from '@lucide/svelte';

  export interface Member {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    role?: 'owner' | 'admin' | 'member';
    isOnline?: boolean;
  }

  export interface MembersListProps {
    members?: Member[];
    onSelectMember?: (memberId: string) => void;
    currentMemberId?: string;
    class?: string;
  }

  let {
    members = [],
    onSelectMember,
    currentMemberId,
    class: className,
  }: MembersListProps = $props();

  const onlineCount = $derived(members.filter((m) => m.isOnline).length);
</script>

<Sidebar.Content class={cn('gap-0', className)}>
  <!-- Members Header -->
  <div class="p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Users class="w-4 h-4 text-muted-foreground" />
        <span class="text-sm font-medium">Team Members</span>
      </div>
      <span class="text-xs text-muted-foreground">{members.length}</span>
    </div>
  </div>

  <Sidebar.Separator />

  <!-- Members List -->
  <Sidebar.Group>
    <Sidebar.GroupContent>
      <Sidebar.Menu>
        {#if members.length === 0}
          <div class="px-4 py-8 text-center">
            <Users class="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
            <p class="text-sm text-muted-foreground">No members yet</p>
            <p class="text-xs text-muted-foreground mt-1">Invite team members to collaborate</p>
          </div>
        {:else}
          <ScrollArea class="h-[calc(100vh-140px)]">
            {#each members as member (member.id)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  isActive={currentMemberId === member.id}
                  onclick={() => onSelectMember?.(member.id)}
                >
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar class="h-6 w-6">
                      {#if member.avatar}
                        <AvatarImage src={member.avatar} alt={member.name} />
                      {/if}
                      <AvatarFallback>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span class="truncate">{member.name}</span>

                    <!-- Role Badge -->
                    {#if member.role === 'owner'}
                      <Crown class="w-3 h-3 text-yellow-500 ml-auto" />
                    {:else if member.role === 'admin'}
                      <Shield class="w-3 h-3 text-blue-500 ml-auto" />
                    {/if}

                    <!-- Online Indicator -->
                    {#if member.isOnline}
                      <span class="h-2 w-2 rounded-full bg-green-500 ml-auto" title="Online"></span>
                    {/if}
                  </div>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </ScrollArea>
        {/if}
      </Sidebar.Menu>
    </Sidebar.GroupContent>
  </Sidebar.Group>

  <!-- Online Status -->
  {#if onlineCount > 0}
    <div class="p-4 border-t border-border">
      <p class="text-xs text-muted-foreground text-center">
        {onlineCount}
        {onlineCount === 1 ? 'member' : 'members'} online
      </p>
    </div>
  {/if}
</Sidebar.Content>
