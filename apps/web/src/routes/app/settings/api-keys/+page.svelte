<script lang="ts">
  import { onMount } from 'svelte';
  import { orpc } from '$lib/orpc';
  import { page } from '$app/stores';
  import {
    Card,
    CardContent,
  } from '$lib/components/ui/card/index.js';
  import ShieldIcon from '@lucide/svelte/icons/shield';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import { ApiKeyForm, ApiKeyList, type ApiKeyFormData } from '$lib/components/settings/api-keys';

  // Type assertion for apiKey router (temporary workaround until types are regenerated)
  const apiKeyClient = orpc as any & {
    apiKey: {
      getAll: () => Promise<any[]>;
      getById: (input: { id: string }) => Promise<any>;
      create: (input: any) => Promise<any>;
      update: (input: any) => Promise<any>;
      delete: (input: { id: string }) => Promise<void>;
    };
  };

  type ApiKey = {
    id: string;
    provider: string;
    name: string;
    keyLast4: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  let apiKeys = $state<ApiKey[]>([]);
  let loading = $state(false);
  let errorMessage = $state('');
  let showAddDialog = $state(false);
  let showEditDialog = $state(false);
  let submitting = $state(false);
  let editingKey = $state<(ApiKey & { key?: string }) | null>(null);
  let visibleKeys = $state<Record<string, string>>({});

  // Form state
  let formData = $state<ApiKeyFormData>({
    provider: 'openai',
    name: '',
    key: '',
    isActive: true,
  });

  onMount(async () => {
    await loadApiKeys();
  });

  async function loadApiKeys() {
    loading = true;
    errorMessage = '';
    try {
      const result = await apiKeyClient.apiKey.getAll();
      apiKeys = result as ApiKey[];
    } catch (error) {
      errorMessage = 'Failed to load API keys';
    } finally {
      loading = false;
    }
  }

  function openAddDialog() {
    formData = {
      provider: 'openai',
      name: '',
      key: '',
      isActive: true,
    };
    showAddDialog = true;
  }

  async function openEditDialog(id: string) {
    errorMessage = '';
    submitting = true;
    try {
      const result = await apiKeyClient.apiKey.getById({ id });
      editingKey = result as ApiKey & { key?: string };
      formData = {
        provider: editingKey.provider as any,
        name: editingKey.name,
        key: editingKey.key || '',
        isActive: editingKey.isActive,
      };
      showEditDialog = true;
    } catch (error) {
      errorMessage = 'Failed to load API key details';
    } finally {
      submitting = false;
    }
  }

  async function handleCreate(data: ApiKeyFormData) {
    errorMessage = '';
    submitting = true;
    try {
      await apiKeyClient.apiKey.create({
        provider: data.provider,
        name: data.name,
        key: data.key,
      });
      showAddDialog = false;
      await loadApiKeys();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to create API key';
    } finally {
      submitting = false;
    }
  }

  async function handleUpdate(data: ApiKeyFormData) {
    if (!editingKey) return;

    errorMessage = '';
    submitting = true;
    try {
      await apiKeyClient.apiKey.update({
        id: editingKey.id,
        provider: data.provider,
        name: data.name,
        key: data.key || undefined,
        isActive: data.isActive,
      });
      showEditDialog = false;
      editingKey = null;
      await loadApiKeys();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to update API key';
    } finally {
      submitting = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    errorMessage = '';
    try {
      await apiKeyClient.apiKey.delete({ id });
      await loadApiKeys();
    } catch (error) {
      errorMessage = 'Failed to delete API key';
    }
  }

  async function toggleKeyVisibility(id: string) {
    if (visibleKeys[id]) {
      delete visibleKeys[id];
    } else {
      try {
        const result = await apiKeyClient.apiKey.getById({ id });
        visibleKeys[id] = (result as any).key;
      } catch (error) {
        errorMessage = 'Failed to retrieve API key';
      }
    }
    visibleKeys = { ...visibleKeys };
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      errorMessage = 'Failed to copy to clipboard';
    }
  }
</script>

<header class="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
  <Sidebar.Trigger class="-ms-1" />
  <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/app/settings">Settings</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>API Keys</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
</header>

<div class="flex h-[calc(100vh-61px)]">
  <!-- Settings Navigation Sidebar -->
  <aside class="w-64 border-r bg-muted/10 p-4">
    <nav class="space-y-1">
      <a
        href="/app/settings"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground {$page.url.pathname ===
        '/app/settings'
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground'}"
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
          class="lucide lucide-cpu"
          ><rect x="4" y="4" width="16" height="16" rx="2" /><rect
            x="9"
            y="9"
            width="6"
            height="6" /><path
            d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path
            d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path
            d="M9 2v2" /><path d="M9 20v2" /></svg
        >
        AI Models
      </a>
      <a
        href="/app/settings/api-keys"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground {$page.url.pathname ===
        '/app/settings/api-keys'
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground'}"
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
          class="lucide lucide-key"
          ><path
            d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle
            cx="16.5"
            cy="7.5"
            r=".5"
            fill="currentColor" /></svg
        >
        API Keys
      </a>
    </nav>
  </aside>

  <!-- Settings Content -->
  <main class="flex-1 overflow-auto p-6">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8">
        <h1 class="text-foreground mb-2 text-3xl font-bold">API Keys</h1>
        <p class="text-muted-foreground">
          Manage your API keys for different AI providers. Keys are encrypted and stored securely.
        </p>
      </div>

      <ApiKeyList
        {apiKeys}
        {loading}
        {errorMessage}
        {visibleKeys}
        onadd={openAddDialog}
        onedit={openEditDialog}
        ondelete={handleDelete}
        ontogglevisibility={toggleKeyVisibility}
        oncopy={copyToClipboard}
      />

      <div class="mt-8 rounded-lg border p-4">
        <div class="flex gap-3">
          <ShieldIcon class="text-primary size-5 shrink-0" />
          <div>
            <h4 class="text-foreground text-sm font-semibold">Security Information</h4>
            <p class="text-muted-foreground text-sm">
              Your API keys are encrypted at rest using AES-256-GCM encryption. Keys are never
              exposed in logs or error messages. Each user can only access their own keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- Add API Key Dialog -->
{#if showAddDialog}
  <div
    class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    tabindex="-1"
    aria-labelledby="add-dialog-title"
    onclick={(e) => {
      if (e.target === e.currentTarget) showAddDialog = false;
    }}
  >
    <div
      class="bg-background max-h-[90vh] w-full max-w-lg overflow-hidden rounded-lg border shadow-lg"
    >
      <div class="border-b p-6">
        <h2 id="add-dialog-title" class="text-foreground text-xl font-semibold">
          Add New API Key
        </h2>
      </div>
      <div class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
        <ApiKeyForm
          bind:data={formData}
          submitting={submitting}
          onsubmit={handleCreate}
          oncancel={() => (showAddDialog = false)}
        />
      </div>
    </div>
  </div>
{/if}

<!-- Edit API Key Dialog -->
{#if showEditDialog && editingKey}
  <div
    class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    tabindex="-1"
    aria-labelledby="edit-dialog-title"
    onclick={(e) => {
      if (e.target === e.currentTarget) showEditDialog = false;
    }}
  >
    <div
      class="bg-background max-h-[90vh] w-full max-w-lg overflow-hidden rounded-lg border shadow-lg"
    >
      <div class="border-b p-6">
        <h2 id="edit-dialog-title" class="text-foreground text-xl font-semibold">
          Edit API Key
        </h2>
      </div>
      <div class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
        <ApiKeyForm
          bind:data={formData}
          isEdit={true}
          submitting={submitting}
          onsubmit={handleUpdate}
          oncancel={() => (showEditDialog = false)}
        />
      </div>
    </div>
  </div>
{/if}
