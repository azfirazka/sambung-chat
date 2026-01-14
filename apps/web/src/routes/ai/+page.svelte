<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';
  import { fade } from 'svelte/transition';

  // Use PUBLIC_API_URL for AI endpoint (backend)
  const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

  let input = $state('');
  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: `${PUBLIC_API_URL}/ai`,
    }),
  });

  let messagesContainer: HTMLDivElement | null = $state(null);

  // Smooth auto-scroll with better UX
  $effect(() => {
    if (chat.messages.length > 0 && messagesContainer) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesContainer?.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    chat.sendMessage({ text });
    input = '';
  }

  // Check if last message is from assistant and still streaming
  function isStreaming() {
    const lastMessage = chat.messages[chat.messages.length - 1];
    return (
      lastMessage?.role === 'assistant' &&
      lastMessage.parts.some((p: any) => p.type === 'text' && !p.text)
    );
  }
</script>

<div class="mx-auto grid h-full w-full max-w-3xl grid-rows-[1fr_auto] overflow-hidden p-4">
  <div bind:this={messagesContainer} class="mb-4 space-y-4 overflow-y-auto pb-4 scroll-smooth">
    {#if chat.messages.length === 0}
      <div in:fade={{ duration: 600 }} class="mt-8 text-center text-muted-foreground">
        <div class="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mx-auto mb-2 text-primary"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Start a conversation</h2>
        <p class="text-sm">Ask me anything to get started!</p>
      </div>
    {/if}

    {#each chat.messages as message (message.id)}
      {@const isLast = message === chat.messages[chat.messages.length - 1]}
      {@const isStreaming = message.role === 'assistant' && isLast}

      <div
        in:fade={{ duration: 300 }}
        class="flex w-full {message.role === 'user' ? 'justify-end' : 'justify-start'}"
      >
        <div
          class="group max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base transition-all duration-200 hover:shadow-lg"
          class:ml-auto={message.role === 'user'}
          class:bg-primary={message.role === 'user'}
          class:bg-muted={message.role === 'assistant'}
          class:rounded-tr-sm={message.role === 'user'}
          class:rounded-tl-sm={message.role === 'assistant'}
        >
          <p
            class="mb-1.5 text-xs font-medium opacity-70"
            class:text-primary-foreground={message.role === 'user'}
            class:text-muted-foreground={message.role === 'assistant'}
          >
            {message.role === 'user' ? 'You' : 'AI Assistant'}
            {#if isStreaming}
              <span class="ml-2 inline-flex items-center gap-1">
                <span class="animate-pulse">●</span>
                <span class="animate-pulse" style="animation-delay: 0.2s">●</span>
                <span class="animate-pulse" style="animation-delay: 0.4s">●</span>
              </span>
            {/if}
          </p>

          <div
            class="prose prose-sm dark:prose-invert max-w-none"
            class:prose-p:text-primary-foreground={message.role === 'user'}
            class:prose-p:text-foreground={message.role === 'assistant'}
          >
            {#each message.parts as part, partIndex (partIndex)}
              {#if part.type === 'text'}
                <div class="whitespace-pre-wrap break-words leading-relaxed">
                  {part.text}
                  {#if isStreaming && !part.text}
                    <span class="inline-block w-2 h-4 ml-1 bg-current animate-pulse opacity-50" />
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <form
    onsubmit={handleSubmit}
    class="w-full flex items-end gap-2 pt-3 border-t border-border bg-background p-2"
  >
    <div class="flex-1 relative">
      <input
        name="prompt"
        bind:value={input}
        placeholder="Type your message..."
        class="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all duration-200"
        autocomplete="off"
        disabled={isStreaming()}
        onkeydown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none"
      >
        {#if isStreaming()}
          <span class="flex items-center gap-1">
            <span class="animate-spin">⋯</span>
          </span>
        {:else}
          <kbd class="hidden sm:inline-block">⏎</kbd>
        {/if}
      </div>
    </div>

    <button
      type="submit"
      disabled={!input.trim() || isStreaming()}
      class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Send message"
    >
      {#if isStreaming()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-transform duration-200"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      {/if}
    </button>
  </form>
</div>

<style>
  /* Smooth scroll behavior */
  :global(.scroll-smooth) {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar for webkit browsers */
  :global(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: hsl(var(--color-border) / 0.5);
    border-radius: 3px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background: hsl(var(--color-border));
  }
</style>
