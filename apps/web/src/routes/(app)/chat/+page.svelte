<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
</script>

<Sidebar.Inset>
  <header class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
    <Sidebar.Trigger class="-ms-1" />
    <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Chat</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  </header>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <div class="flex h-full flex-col items-center justify-center text-center">
      <h1 class="mb-2 text-2xl font-bold">Welcome to SambungChat</h1>
      <p class="text-muted-foreground">
        Start a new conversation or select an existing chat from the sidebar.
      </p>
    </div>
  </div>
</Sidebar.Inset>
