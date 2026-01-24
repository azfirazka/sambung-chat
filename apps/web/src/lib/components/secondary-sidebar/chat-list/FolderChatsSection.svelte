<script lang="ts">
  import FolderItem from './FolderItem.svelte';

  // Types
  interface MatchingMessage {
    id: string;
    chatId: string;
    role: string;
    content: string;
    createdAt: Date;
  }

  interface Chat {
    id: string;
    title: string;
    modelId: string;
    pinned: boolean;
    folderId: string | null;
    createdAt: Date;
    updatedAt: Date;
    matchingMessages?: MatchingMessage[];
  }

  interface Folder {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
  }

  interface FolderGroup {
    folder: Folder;
    chats: Chat[];
  }

  interface Props {
    folderGroups: FolderGroup[];
    currentChatId: string | undefined;
    searchQuery: string;
    folders: Folder[];
    collapsedFolders: Record<string, boolean>;
    renamingFolderId: string | null;
    folderRenameValue: string;
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
    onRenameChat: (chatId: string, newTitle: string) => void;
    onTogglePin: (chatId: string) => void;
    onMoveToFolder: (chatId: string, folderId: string | null) => void;
    onCreateFolder: (chatId: string) => void;
    onToggleFolder: (folderId: string) => void;
    onStartFolderRename: (folderId: string, folderName: string) => void;
    onSaveFolderRename: () => void;
    onCancelFolderRename: () => void;
    onDeleteFolder: (folderId: string, folderName: string) => void;
    onFolderKeydown: (e: KeyboardEvent) => void;
    onFolderRenameValueChange: (value: string) => void;
  }

  let {
    folderGroups,
    currentChatId,
    searchQuery,
    folders,
    collapsedFolders,
    renamingFolderId,
    folderRenameValue,
    onSelectChat,
    onDeleteChat,
    onRenameChat,
    onTogglePin,
    onMoveToFolder,
    onCreateFolder,
    onToggleFolder,
    onStartFolderRename,
    onSaveFolderRename,
    onCancelFolderRename,
    onDeleteFolder,
    onFolderKeydown,
    onFolderRenameValueChange
  }: Props = $props();

  function isFolderCollapsed(folderId: string): boolean {
    return collapsedFolders[folderId] ?? true;
  }
</script>

{#each folderGroups as { folder, chats: folderChats } (folder.id)}
  {#if folderChats.length > 0}
    <FolderItem
      {folder}
      folderChats={folderChats}
      isCollapsed={isFolderCollapsed(folder.id)}
      isRenaming={renamingFolderId === folder.id}
      renameValue={folderRenameValue}
      {currentChatId}
      {searchQuery}
      {folders}
      onToggle={() => onToggleFolder(folder.id)}
      onStartRename={() => onStartFolderRename(folder.id, folder.name)}
      onSaveRename={onSaveFolderRename}
      onCancelRename={onCancelFolderRename}
      onDelete={() => onDeleteFolder(folder.id, folder.name)}
      {onFolderKeydown}
      onFolderRenameValueChange={onFolderRenameValueChange}
      {onSelectChat}
      {onDeleteChat}
      {onRenameChat}
      {onTogglePin}
      {onMoveToFolder}
      {onCreateFolder}
    />
  {/if}
{/each}
