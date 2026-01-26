<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import SecondarySidebarTrigger from '$lib/components/secondary-sidebar-trigger.svelte';
  import PromptLibrary from '$lib/components/prompt-library.svelte';
  import PromptsCategories from '$lib/components/secondary-sidebar/PromptsCategories.svelte';
  import { onMount } from 'svelte';
  import type { PromptData } from '$lib/components/prompt-library.svelte';
  import { orpc } from '$lib/orpc';
  import { toast } from 'svelte-sonner';

  // Category types
  type CategoryType = 'my-prompts' | 'marketplace' | 'shared';

  // State
  let prompts = $state<PromptData[]>([]);
  let loading = $state(true);
  let submitting = $state(false);
  let selectedCategory = $state<CategoryType>('my-prompts');
  let searchQuery = $state('');

  // Categories config
  const categories: Array<{
    id: string;
    label: string;
    type: 'personal' | 'marketplace' | 'shared';
    count: number;
    defaultOpen: boolean;
  }> = [
    {
      id: 'my-prompts',
      label: 'My Prompts',
      type: 'personal',
      count: 0,
      defaultOpen: true,
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      type: 'marketplace',
      count: 0,
      defaultOpen: false,
    },
    {
      id: 'shared',
      label: 'Shared with me',
      type: 'shared',
      count: 0,
      defaultOpen: false,
    },
  ];

  // Load prompts on mount and when category changes
  onMount(async () => {
    await loadPrompts();
  });

  async function loadPrompts() {
    try {
      loading = true;

      if (selectedCategory === 'marketplace') {
        // Load public prompts from marketplace
        const data = await orpc.prompt.getPublicTemplates({
          limit: 50,
          offset: 0,
          query: searchQuery || undefined,
        });

        // Transform to include author info
        prompts = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          content: p.content,
          variables: p.variables,
          category: p.category,
          isPublic: p.isPublic,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          author: {
            id: p.authorId,
            name: p.authorName || 'Unknown',
          },
        }));
      } else {
        // Load user's own prompts
        const data = await orpc.prompt.getAll();
        prompts = (data || []).map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
      toast.error('Failed to load prompts');
    } finally {
      loading = false;
    }
  }

  async function handleSearch(query: string) {
    searchQuery = query;
    await loadPrompts();
  }

  async function handleCategorySelect(categoryId: string) {
    selectedCategory = categoryId as CategoryType;
    await loadPrompts();
  }

  // Event handlers
  async function handleCreate(data: {
    name: string;
    content: string;
    variables: string[];
    category: string;
    isPublic: boolean;
  }) {
    try {
      submitting = true;
      await orpc.prompt.create({
        ...data,
        category: data.category as
          | 'general'
          | 'coding'
          | 'writing'
          | 'analysis'
          | 'creative'
          | 'business'
          | 'custom',
      });
      await loadPrompts();
      toast.success('Prompt created successfully');
    } catch (error) {
      console.error('Failed to create prompt:', error);
      toast.error('Failed to create prompt');
    } finally {
      submitting = false;
    }
  }

  async function handleUpdate(
    id: string,
    data: {
      name: string;
      content: string;
      variables: string[];
      category: string | null;
      isPublic: boolean;
    }
  ) {
    try {
      submitting = true;
      // Convert null to undefined for API (optional fields)
      const { category, ...rest } = data;
      await orpc.prompt.update({
        id,
        ...rest,
        ...(category !== null && {
          category: category as
            | 'general'
            | 'coding'
            | 'writing'
            | 'analysis'
            | 'creative'
            | 'business'
            | 'custom',
        }),
      });
      await loadPrompts();
      toast.success('Prompt updated successfully');
    } catch (error) {
      console.error('Failed to update prompt:', error);
      toast.error('Failed to update prompt');
    } finally {
      submitting = false;
    }
  }

  async function handleDelete(id: string) {
    try {
      submitting = true;
      await orpc.prompt.delete({ id });
      await loadPrompts();
      toast.success('Prompt deleted successfully');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('Failed to delete prompt');
    } finally {
      submitting = false;
    }
  }

  async function handleCopy(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Prompt content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  }

  async function handleDuplicateFromMarketplace(publicPromptId: string) {
    try {
      submitting = true;
      const duplicated = await orpc.prompt.duplicateFromPublic({
        publicPromptId,
      });

      if (duplicated) {
        toast.success('Prompt duplicated to your library!');
        // Switch to my-prompts to see the duplicated prompt
        selectedCategory = 'my-prompts';
        await loadPrompts();
      }
    } catch (error) {
      console.error('Failed to duplicate prompt:', error);
      toast.error('Failed to duplicate prompt');
    } finally {
      submitting = false;
    }
  }
</script>

<div class="flex h-full">
  <!-- Secondary Sidebar -->
  <Sidebar.Root collapsible="none" class="w-[280px] border-r">
    <PromptsCategories
      {categories}
      {selectedCategory}
      {loading}
      onselect={handleCategorySelect}
      oncreate={() => {
        // Create dialog is handled by PromptLibrary component
      }}
      {searchQuery}
      onsearch={handleSearch}
    />
  </Sidebar.Root>

  <!-- Main Content -->
  <div class="flex flex-1 flex-col overflow-hidden">
    <header class="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
      <SecondarySidebarTrigger class="-ms-1" />
      <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Prompts Library</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      <PromptLibrary
        {prompts}
        {loading}
        {submitting}
        view={selectedCategory}
        oncreate={handleCreate}
        onupdate={handleUpdate}
        ondelete={handleDelete}
        oncopy={handleCopy}
        onduplicate={handleDuplicateFromMarketplace}
      />
    </main>
  </div>
</div>
