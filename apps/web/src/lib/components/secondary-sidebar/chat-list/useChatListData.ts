import { goto } from '$app/navigation';
import { orpc } from '$lib/orpc';
import { exportAllChats, type ChatsByFolder } from '$lib/utils/chat-export';
import type { Chat, Folder, GroupedChats } from './types.js';
import { groupChatsByFolder } from './utils/chat-grouping.js';
import { writable, derived, get, type Writable, type Readable } from 'svelte/store';

interface Model {
  id: string;
  provider: string;
  modelId: string;
  name: string;
  baseUrl?: string;
  apiKeyId?: string;
  isActive: boolean;
  avatarUrl?: string;
  settings?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

type Provider = 'openai' | 'anthropic' | 'google' | 'groq' | 'ollama' | 'custom';

interface ChatListData {
  // State stores
  chats: Writable<Chat[]>;
  folders: Writable<Folder[]>;
  models: Writable<Model[]>;
  loading: Writable<boolean>;
  searching: Writable<boolean>;
  error: Writable<string | null>;
  searchQuery: Writable<string>;
  selectedFolderId: Writable<string>;
  showPinnedOnly: Writable<boolean>;
  selectedProviders: Writable<Provider[]>;
  selectedModelIds: Writable<string[]>;
  dateFrom: Writable<string>;
  dateTo: Writable<string>;
  collapsedFolders: Writable<Record<string, boolean>>;
  isInitialLoad: Writable<boolean>;
  renamingFolderId: Writable<string | null>;
  folderRenameValue: Writable<string>;
  exporting: Writable<boolean>;
  exportFormat: Writable<'json' | 'md' | 'zip' | 'zip-optimized' | null>;

  // Derived stores
  availableProviders: Readable<Provider[]>;
  availableModels: Readable<Model[]>;
  hasActiveFilters: Readable<boolean>;
  hasAnyFilters: Readable<boolean>;
  groupedChats: Readable<GroupedChats>;

  // Methods
  loadChats: () => Promise<void>;
  loadFolders: () => Promise<void>;
  loadModels: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  togglePin: (chatId: string) => Promise<void>;
  createFolder: (chatId: string) => Promise<void>;
  moveChatToFolder: (chatId: string, folderId: string | null) => Promise<void>;
  toggleFolder: (folderId: string) => void;
  startFolderRename: (folderId: string, folderName: string) => void;
  saveFolderRename: () => Promise<void>;
  cancelFolderRename: () => void;
  handleFolderKeydown: (e: KeyboardEvent) => void;
  deleteFolder: (folderId: string, folderName: string) => Promise<void>;
  handleExportAll: (format: 'json' | 'md' | 'zip') => Promise<void>;
  handleSearchChange: (query: string) => void;
  handleSearchKeydown: (e: KeyboardEvent) => void;
  handleFolderSelect: (folderId: string) => void;
  handlePinnedToggle: (checked: boolean) => void;
  handleProvidersChange: () => void;
  handleModelsChange: () => void;
  handleDateChange: () => void;
  handleClearAllFilters: () => void;
}

export function useChatListData(): ChatListData {
  // State stores
  const chats = writable<Chat[]>([]);
  const folders = writable<Folder[]>([]);
  const models = writable<Model[]>([]);
  const loading = writable<boolean>(true);
  const searching = writable<boolean>(false);
  const error = writable<string | null>(null);
  const searchQuery = writable<string>('');
  const selectedFolderId = writable<string>('');
  const showPinnedOnly = writable<boolean>(false);
  const selectedProviders = writable<Provider[]>([]);
  const selectedModelIds = writable<string[]>([]);
  const dateFrom = writable<string>('');
  const dateTo = writable<string>('');
  const collapsedFolders = writable<Record<string, boolean>>({});
  const isInitialLoad = writable<boolean>(true);
  const renamingFolderId = writable<string | null>(null);
  const folderRenameValue = writable<string>('');
  const exporting = writable<boolean>(false);
  const exportFormat = writable<'json' | 'md' | 'zip' | 'zip-optimized' | null>(null);

  // Derived stores
  const availableProviders = derived(models, ($models) => {
    const providers = $models.map((m) => m.provider);
    const uniqueProviders = providers.reduce<string[]>((unique, provider) => {
      if (!unique.includes(provider)) {
        unique.push(provider);
      }
      return unique;
    }, []);
    return uniqueProviders.sort() as Provider[];
  });

  const availableModels = derived([models, selectedProviders], ([$models, $selectedProviders]) => {
    if ($selectedProviders.length === 0) {
      return $models.sort((a, b) => a.name.localeCompare(b.name));
    }
    return $models
      .filter((m) => $selectedProviders.includes(m.provider as Provider))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const hasActiveFilters = derived(
    [isInitialLoad, selectedProviders, selectedModelIds, dateFrom, dateTo],
    ([$isInitialLoad, $selectedProviders, $selectedModelIds, $dateFrom, $dateTo]) => {
      return (
        !$isInitialLoad &&
        ($selectedProviders.length > 0 ||
          $selectedModelIds.length > 0 ||
          $dateFrom !== '' ||
          $dateTo !== '')
      );
    }
  );

  const hasAnyFilters = derived(
    [
      isInitialLoad,
      searchQuery,
      selectedFolderId,
      showPinnedOnly,
      selectedProviders,
      selectedModelIds,
      dateFrom,
      dateTo,
    ],
    ([
      $isInitialLoad,
      $searchQuery,
      $selectedFolderId,
      $showPinnedOnly,
      $selectedProviders,
      $selectedModelIds,
      $dateFrom,
      $dateTo,
    ]) => {
      return (
        !$isInitialLoad &&
        ($searchQuery !== '' ||
          $selectedFolderId !== '' ||
          $showPinnedOnly ||
          $selectedProviders.length > 0 ||
          $selectedModelIds.length > 0 ||
          $dateFrom !== '' ||
          $dateTo !== '')
      );
    }
  );

  const groupedChats = derived([chats, folders], ([$chats, $folders]) => {
    return groupChatsByFolder($chats, $folders);
  });

  // Load chats with search & filters
  async function loadChats() {
    const $isInitialLoad = get(isInitialLoad);
    if ($isInitialLoad) {
      loading.set(true);
    } else {
      searching.set(true);
    }
    error.set(null);

    try {
      const $searchQuery = get(searchQuery);
      const $selectedFolderId = get(selectedFolderId);
      const $showPinnedOnly = get(showPinnedOnly);
      const $selectedProviders = get(selectedProviders);
      const $selectedModelIds = get(selectedModelIds);
      const $dateFrom = get(dateFrom);
      const $dateTo = get(dateTo);

      const result = await orpc.chat.search({
        query: $searchQuery || undefined,
        searchInMessages: $searchQuery ? true : undefined,
        folderId: $selectedFolderId || undefined,
        pinnedOnly: $showPinnedOnly || undefined,
        providers: $selectedProviders.length > 0 ? $selectedProviders : undefined,
        modelIds: $selectedModelIds.length > 0 ? $selectedModelIds : undefined,
        dateFrom: $dateFrom || undefined,
        dateTo: $dateTo || undefined,
      });
      chats.set(result || []);
    } catch (err) {
      console.error('Failed to load chats:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        error.set('Network error - check if server is running');
      } else {
        error.set(err instanceof Error ? err.message : 'Failed to load chats');
      }
    } finally {
      loading.set(false);
      searching.set(false);
      isInitialLoad.set(false);
    }
  }

  // Load folders
  async function loadFolders() {
    try {
      const result = await orpc.folder.getAll();
      folders.set((result as Folder[]) || []);
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  }

  // Load models
  async function loadModels() {
    try {
      const result = await orpc.model.getAll();
      models.set((result as Model[]) || []);
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  }

  // Handle search on Enter key
  function handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      loadChats();
    }
  }

  // Handle chat selection
  async function selectChat(chatId: string) {
    await goto(`/app/chat/${chatId}`);
  }

  // Handle new chat
  async function createNewChat() {
    try {
      await goto('/app/chat');
    } catch (err) {
      console.error('Failed to navigate to new chat:', err);
    }
  }

  // Handle chat deletion
  async function deleteChat(chatId: string) {
    const $chats = get(chats);
    const chat = $chats.find((c) => c.id === chatId);
    if (!chat) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${chat.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await orpc.chat.delete({ id: chatId });
      chats.update((current) => current.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }

  // Handle chat rename
  async function renameChat(chatId: string, newTitle: string) {
    try {
      await orpc.chat.update({ id: chatId, title: newTitle });
      chats.update((current) =>
        current.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
      );
    } catch (err) {
      console.error('Failed to rename chat:', err);
    }
  }

  // Handle pin toggle
  async function togglePin(chatId: string) {
    try {
      const updated = await orpc.chat.togglePin({ id: chatId });
      chats.update((current) =>
        current.map((c) => (c.id === chatId ? { ...c, pinned: updated.pinned } : c))
      );
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  }

  // Handle folder creation
  async function createFolder(chatId: string) {
    const folderName = prompt('Enter folder name:');
    if (!folderName || !folderName.trim()) return;

    try {
      const newFolder = await orpc.folder.create({
        name: folderName.trim(),
      });

      await orpc.chat.updateFolder({ id: chatId, folderId: newFolder.id });

      chats.update((current) =>
        current.map((c) => (c.id === chatId ? { ...c, folderId: newFolder.id } : c))
      );

      await loadFolders();
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('Failed to create folder. Please try again.');
    }
  }

  // Handle moving chat to folder
  async function moveChatToFolder(chatId: string, folderId: string | null) {
    try {
      await orpc.chat.updateFolder({ id: chatId, folderId });
      chats.update((current) => current.map((c) => (c.id === chatId ? { ...c, folderId } : c)));
    } catch (err) {
      console.error('Failed to move chat to folder:', err);
    }
  }

  // Toggle folder collapsed state
  function toggleFolder(folderId: string) {
    collapsedFolders.update((current) => ({
      ...current,
      [folderId]: !current[folderId],
    }));
  }

  // Handle folder rename
  function startFolderRename(folderId: string, folderName: string) {
    renamingFolderId.set(folderId);
    folderRenameValue.set(folderName);
  }

  async function saveFolderRename() {
    const $renamingFolderId = get(renamingFolderId);
    const $folderRenameValue = get(folderRenameValue);

    if (!$renamingFolderId || !$folderRenameValue.trim()) {
      renamingFolderId.set(null);
      folderRenameValue.set('');
      return;
    }

    try {
      await orpc.folder.update({ id: $renamingFolderId, name: $folderRenameValue.trim() });
      folders.update((current) =>
        current.map((f) =>
          f.id === $renamingFolderId ? { ...f, name: $folderRenameValue.trim() } : f
        )
      );
      renamingFolderId.set(null);
      folderRenameValue.set('');
    } catch (err) {
      console.error('Failed to rename folder:', err);
      alert('Failed to rename folder. Please try again.');
    }
  }

  function cancelFolderRename() {
    renamingFolderId.set(null);
    folderRenameValue.set('');
  }

  function handleFolderKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      saveFolderRename();
    } else if (e.key === 'Escape') {
      cancelFolderRename();
    }
  }

  // Handle folder delete
  async function deleteFolder(folderId: string, folderName: string) {
    const confirmed = confirm(
      `Are you sure you want to delete folder "${folderName}"?\n\nAll chats in this folder will be moved to "No Folder".`
    );

    if (!confirmed) return;

    try {
      await orpc.folder.delete({ id: folderId });
      chats.update((current) =>
        current.map((c) => (c.folderId === folderId ? { ...c, folderId: null } : c))
      );
      folders.update((current) => current.filter((f) => f.id !== folderId));
    } catch (err) {
      console.error('Failed to delete folder:', err);
      alert('Failed to delete folder. Please try again.');
    }
  }

  // Handle export all chats
  async function handleExportAll(format: 'json' | 'md' | 'zip') {
    const $exporting = get(exporting);
    if ($exporting) return;

    exporting.set(true);
    exportFormat.set(format);

    try {
      const chatsByFolder = await orpc.chat.getChatsByFolder();

      const finalFormat = format === 'zip' ? ('zip-optimized' as const) : format;
      exportFormat.set(finalFormat);

      const result = await exportAllChats(chatsByFolder as ChatsByFolder, finalFormat, {
        onProgress: () => {},
        onError: (chat, error) => {
          console.warn(`Failed to export chat "${chat.title}":`, error);
          return true;
        },
      });

      if (result.success) {
        alert(`Successfully exported ${result.exported} chat(s)!`);
      } else {
        alert(
          `Export completed with warnings:\n` +
            `✓ Exported: ${result.exported} chat(s)\n` +
            `✗ Failed: ${result.failed} chat(s)\n\n` +
            `Check console for details.`
        );
      }
    } catch (err) {
      console.error('Failed to export chats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to export chats: ${errorMessage}\n\nPlease try again.`);
    } finally {
      exporting.set(false);
      exportFormat.set(null);
    }
  }

  // Filter change handlers
  function handleSearchChange(query: string) {
    searchQuery.set(query);
  }

  function handleFolderSelect(folderId: string) {
    selectedFolderId.set(folderId);
    const $isInitialLoad = get(isInitialLoad);
    if (!$isInitialLoad) {
      loadChats();
    }
  }

  function handlePinnedToggle(checked: boolean) {
    showPinnedOnly.set(checked);
    const $isInitialLoad = get(isInitialLoad);
    if (!$isInitialLoad) {
      loadChats();
    }
  }

  function handleProvidersChange() {
    const $isInitialLoad = get(isInitialLoad);
    if (!$isInitialLoad) {
      selectedModelIds.set([]);
      loadChats();
    }
  }

  function handleModelsChange() {
    const $isInitialLoad = get(isInitialLoad);
    if (!$isInitialLoad) {
      loadChats();
    }
  }

  function handleDateChange() {
    const $isInitialLoad = get(isInitialLoad);
    if (!$isInitialLoad) {
      loadChats();
    }
  }

  function handleClearAllFilters() {
    searchQuery.set('');
    selectedFolderId.set('');
    showPinnedOnly.set(false);
    selectedProviders.set([]);
    selectedModelIds.set([]);
    dateFrom.set('');
    dateTo.set('');
    loadChats();
  }

  return {
    // State
    chats,
    folders,
    models,
    loading,
    searching,
    error,
    searchQuery,
    selectedFolderId,
    showPinnedOnly,
    selectedProviders,
    selectedModelIds,
    dateFrom,
    dateTo,
    collapsedFolders,
    renamingFolderId,
    folderRenameValue,
    exporting,
    exportFormat,
    isInitialLoad,

    // Derived
    availableProviders,
    availableModels,
    hasActiveFilters,
    hasAnyFilters,
    groupedChats,

    // Methods - Data Fetching
    loadChats,
    loadFolders,
    loadModels,

    // Methods - Chat Operations
    selectChat,
    createNewChat,
    deleteChat,
    renameChat,
    togglePin,

    // Methods - Folder Operations
    createFolder,
    moveChatToFolder,
    toggleFolder,
    startFolderRename,
    saveFolderRename,
    cancelFolderRename,
    handleFolderKeydown,
    deleteFolder,

    // Methods - Export
    handleExportAll,

    // Methods - Filter Operations
    handleSearchChange,
    handleSearchKeydown,
    handleFolderSelect,
    handlePinnedToggle,
    handleProvidersChange,
    handleModelsChange,
    handleDateChange,
    handleClearAllFilters,
  };
}
