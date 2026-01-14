<script lang="ts">
  import * as Sidebar from '../../ui/sidebar';
  import { Button } from '../../ui/button';
  import { ScrollArea } from '../../ui/scroll-area';
  import { cn } from '../../../utils';
  import { MessageSquare, Folder, Plus } from '@lucide/svelte';

  export interface ChatListProps {
    workspaceType?: 'personal' | 'team';
    chats?: Array<{
      id: string;
      title: string;
      updatedAt: string;
    }>;
    folders?: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    onNewChat?: () => void;
    onSelectChat?: (chatId: string) => void;
    currentChatId?: string;
    class?: string;
  }

  let {
    workspaceType = 'personal',
    chats = [],
    folders = [],
    onNewChat,
    onSelectChat,
    currentChatId,
    class: className,
  }: ChatListProps = $props();

  const title = $derived(workspaceType === 'team' ? 'Team Chats' : 'Recent Chats');
  const buttonLabel = $derived(workspaceType === 'team' ? 'New Team Chat' : 'New Chat');
</script>

<Sidebar.Content class={cn('gap-0', className)}>
  <!-- New Chat Button -->
  <div class="p-4">
    <Button variant="default" class="w-full justify-start gap-2" onclick={onNewChat}>
      <Plus class="w-4 h-4" />
      <span>{buttonLabel}</span>
    </Button>
  </div>

  <Sidebar.Separator />

  <!-- Recent Chats -->
  <Sidebar.Group>
    <Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
    <Sidebar.GroupContent>
      <Sidebar.Menu>
        {#if chats.length === 0}
          <div class="px-4 py-8 text-center">
            <MessageSquare class="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
            <p class="text-sm text-muted-foreground">No chats yet</p>
            <p class="text-xs text-muted-foreground mt-1">
              Start a new conversation to get started
            </p>
          </div>
        {:else}
          <ScrollArea class="h-[calc(100vh-180px)]">
            {#each chats as chat (chat.id)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  isActive={currentChatId === chat.id}
                  onclick={() => onSelectChat?.(chat.id)}
                >
                  <MessageSquare class="w-4 h-4" />
                  <span class="truncate flex-1 text-left">{chat.title}</span>
                  <span class="text-xs text-muted-foreground ml-auto">
                    {chat.updatedAt}
                  </span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </ScrollArea>
        {/if}
      </Sidebar.Menu>
    </Sidebar.GroupContent>
  </Sidebar.Group>

  {#if folders.length > 0}
    <Sidebar.Separator />

    <!-- Folders -->
    <Sidebar.Group>
      <Sidebar.GroupLabel>Folders</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each folders as folder (folder.id)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Folder class="w-4 h-4" />
                <span>{folder.name}</span>
                <span class="ml-auto text-xs text-muted-foreground">
                  {folder.count}
                </span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  {/if}
</Sidebar.Content>
