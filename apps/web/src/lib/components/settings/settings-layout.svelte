<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import SecondarySidebarTrigger from '$lib/components/secondary-sidebar-trigger.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs/index.js';
  import type { Snippet } from 'svelte';

  /**
   * Settings Layout Component
   *
   * This is a reference implementation showing the pattern for settings pages
   * with tabbed navigation. Currently, the Appearance Settings page implements
   * this pattern directly rather than using this component.
   *
   * For a new settings page, you can either:
   * 1. Copy the pattern from apps/web/src/routes/app/settings/appearance/+page.svelte
   * 2. Use this component as a layout wrapper (future enhancement)
   *
   * The pattern consists of:
   * - Header with breadcrumb navigation
   * - Page title and description
   * - Tabbed navigation (Tabs, TabsList, TabsTrigger)
   * - Tab content areas (TabsContent)
   * - Card-based sections for organization
   *
   * @example
   * See apps/web/src/routes/app/settings/appearance/+page.svelte for a working example
   */
</script>

<!--
  SETTINGS LAYOUT PATTERN

  This component documents the standard layout pattern for settings pages.
  Copy this structure for new settings pages:

  1. HEADER SECTION:
     <header class="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
       <SecondarySidebarTrigger class="-ms-1" />
       <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
       <Breadcrumb.Root>
         <Breadcrumb.List>
           <Breadcrumb.Item>
             <Breadcrumb.Link href="/app/settings">Settings</Breadcrumb.Link>
           </Breadcrumb.Item>
           <Breadcrumb.Separator />
           <Breadcrumb.Item>
             <Breadcrumb.Page>Your Page Name</Breadcrumb.Page>
           </Breadcrumb.Item>
         </Breadcrumb.List>
       </Breadcrumb.Root>
     </header>

  2. MAIN CONTENT SECTION:
     <div class="flex h-[calc(100vh-61px)]">
       <main class="flex-1 overflow-auto p-6">
         <div class="mx-auto max-w-5xl">
           <div class="mb-8">
             <h1 class="text-foreground mb-2 text-3xl font-bold">Page Title</h1>
             <p class="text-muted-foreground">Page description</p>
           </div>

           <!-- Tabs and content here -->

         </div>
       </main>
     </div>

  3. TABS PATTERN:
     <Tabs bind:value={activeTab}>
       <TabsList>
         <TabsTrigger value="tab1">
           <Icon class="size-4" />
           <span class="ml-2">Tab 1</span>
         </TabsTrigger>
         <!-- More tabs... -->
       </TabsList>

       <TabsContent value="tab1">
         <!-- Tab content here -->
       </TabsContent>
     </Tabs>

  For a complete working example, see:
  apps/web/src/routes/app/settings/appearance/+page.svelte
-->

<div class="flex items-center justify-center p-12">
  <div class="text-center">
    <p class="text-muted-foreground text-lg">
      Settings Layout Pattern Reference
    </p>
    <p class="text-muted-foreground mb-4 text-sm">
      See component source code for documentation
    </p>
    <code class="bg-muted rounded px-2 py-1 text-xs">
      apps/web/src/routes/app/settings/appearance/+page.svelte
    </code>
  </div>
</div>
