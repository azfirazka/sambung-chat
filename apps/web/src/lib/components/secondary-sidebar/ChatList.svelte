<script lang="ts">
  import { onMount } from 'svelte';
  import ChatListHeader from './chat-list/ChatListHeader.svelte';
  import ChatListFilters from './chat-list/ChatListFilters.svelte';
  import ChatListFilterDialog from './chat-list/ChatListFilterDialog.svelte';
  import ChatListLoadingState from './chat-list/ChatListLoadingState.svelte';
  import ChatListErrorState from './chat-list/ChatListErrorState.svelte';
  import ChatEmptyState from './ChatEmptyState.svelte';
  import PinnedChatsSection from './chat-list/PinnedChatsSection.svelte';
  import FolderChatsSection from './chat-list/FolderChatsSection.svelte';
  import NoFolderChatsSection from './chat-list/NoFolderChatsSection.svelte';
  import { useChatListData } from './chat-list/useChatListData.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  interface Props {
    currentChatId?: string;
  }

  let { currentChatId }: Props = $props();

  // Use composable for all data management
  const data = useChatListData();

  // Subscribe to stores - use $ for auto-subscription in Svelte 5
  const exporting = data.exporting;
  const searchQuery = data.searchQuery;
  const folders = data.folders;
  const selectedFolderId = data.selectedFolderId;
  const showPinnedOnly = data.showPinnedOnly;
  const hasActiveFilters = data.hasActiveFilters;
  const error = data.error;
  const loading = data.loading;
  const searching = data.searching;
  const chats = data.chats;
  const groupedChats = data.groupedChats;
  const collapsedFolders = data.collapsedFolders;
  const renamingFolderId = data.renamingFolderId;
  const folderRenameValue = data.folderRenameValue;
  const availableProviders = data.availableProviders;
  const availableModels = data.availableModels;
  const selectedProviders = data.selectedProviders;
  const selectedModelIds = data.selectedModelIds;
  const dateFrom = data.dateFrom;
  const dateTo = data.dateTo;
  const hasAnyFilters = data.hasAnyFilters;

  // Initial load
  onMount(() => {
    data.loadChats();
    data.loadFolders();
    data.loadModels();
  });

  // Local UI state for filter dialog
  let showFilterDialog = $state(false);

  function handleOpenAdvancedFilters() {
    showFilterDialog = true;
  }

  function handleFolderRenameValueChange(value: string) {
    data.folderRenameValue.set(value);
  }
</script>

<div class="flex h-full flex-col">
  <!-- Header -->
  <Sidebar.Header class="border-b p-4">
    <ChatListHeader
      title="Chats"
      exporting={$exporting}
      onCreateNewChat={data.createNewChat}
      onExportAll={data.handleExportAll}
    />

    <ChatListFilters
      searchQuery={$searchQuery}
      folders={$folders}
      selectedFolderId={$selectedFolderId}
      showPinnedOnly={$showPinnedOnly}
      hasActiveFilters={$hasActiveFilters}
      onSearchChange={data.handleSearchChange}
      onSearchKeydown={data.handleSearchKeydown}
      onFolderChange={data.handleFolderSelect}
      onPinnedChange={data.handlePinnedToggle}
      onOpenAdvancedFilters={handleOpenAdvancedFilters}
    />
  </Sidebar.Header>

  <!-- Content -->
  <Sidebar.Content class="flex-1 overflow-hidden">
    {#if $error}
      <ChatListErrorState error={$error} onRetry={data.loadChats} />
    {:else if $loading || $searching}
      <ChatListLoadingState loading={$loading} searching={$searching} />
    {:else if $chats.length === 0}
      <ChatEmptyState onNewChat={data.createNewChat} />
    {:else}
      <div class="h-full max-h-[50vh] overflow-y-auto">
        <div class="px-2">
          <PinnedChatsSection
            pinnedChats={$groupedChats.pinnedChats}
            {currentChatId}
            searchQuery={$searchQuery}
            folders={$folders}
            onSelectChat={data.selectChat}
            onDeleteChat={data.deleteChat}
            onRenameChat={data.renameChat}
            onTogglePin={data.togglePin}
            onMoveToFolder={data.moveChatToFolder}
            onCreateFolder={data.createFolder}
          />

          <FolderChatsSection
            folderGroups={$groupedChats.folderGroups}
            {currentChatId}
            searchQuery={$searchQuery}
            folders={$folders}
            collapsedFolders={$collapsedFolders}
            renamingFolderId={$renamingFolderId}
            folderRenameValue={$folderRenameValue}
            onSelectChat={data.selectChat}
            onDeleteChat={data.deleteChat}
            onRenameChat={data.renameChat}
            onTogglePin={data.togglePin}
            onMoveToFolder={data.moveChatToFolder}
            onCreateFolder={data.createFolder}
            onToggleFolder={data.toggleFolder}
            onStartFolderRename={data.startFolderRename}
            onSaveFolderRename={data.saveFolderRename}
            onCancelFolderRename={data.cancelFolderRename}
            onDeleteFolder={data.deleteFolder}
            onFolderKeydown={data.handleFolderKeydown}
            onFolderRenameValueChange={handleFolderRenameValueChange}
          />

          <NoFolderChatsSection
            noFolderChats={$groupedChats.noFolderChats}
            {currentChatId}
            searchQuery={$searchQuery}
            folders={$folders}
            onSelectChat={data.selectChat}
            onDeleteChat={data.deleteChat}
            onRenameChat={data.renameChat}
            onTogglePin={data.togglePin}
            onMoveToFolder={data.moveChatToFolder}
            onCreateFolder={data.createFolder}
          />
        </div>
      </div>
    {/if}
  </Sidebar.Content>
</div>

<!-- Filter Dialog -->
<ChatListFilterDialog
  show={showFilterDialog}
  providers={$availableProviders}
  models={$availableModels}
  selectedProviders={$selectedProviders}
  selectedModelIds={$selectedModelIds}
  dateFrom={$dateFrom}
  dateTo={$dateTo}
  onProvidersChange={data.handleProvidersChange}
  onModelsChange={data.handleModelsChange}
  onDateChange={data.handleDateChange}
  onClearAll={data.handleClearAllFilters}
  hasAnyFilters={$hasAnyFilters}
/>
