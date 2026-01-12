# AI Provider Integration Guide: Adding New Models to SambungChat

**Version:** 1.0
**Last Updated:** 2025-01-11
**Target Audience:** Contributors, Developers, DevOps Engineers
**Difficulty Level:** Intermediate to Advanced

---

## Table of Contents

1. [Introduction and Overview](#1-introduction-and-overview)
2. [Understanding the AI SDK Architecture](#2-understanding-the-ai-sdk-architecture)
3. [Current Implementation Analysis](#3-current-implementation-analysis)
4. [Step-by-Step Integration Guide](#4-step-by-step-integration-guide)
5. [Provider-Specific Configurations](#5-provider-specific-configurations)
6. [Environment Configuration](#6-environment-configuration)
7. [Testing and Validation](#7-testing-and-validation)
8. [Troubleshooting and Common Issues](#8-troubleshooting-and-common-issues)
9. [Advanced Topics](#9-advanced-topics)
10. [Best Practices and Guidelines](#10-best-practices-and-guidelines)
11. [Reference and Resources](#11-reference-and-resources)

---

## 1. Introduction and Overview

### 1.1 Purpose of This Guide

This guide provides comprehensive documentation for integrating new AI providers into SambungChat. As the project aims to support "any AI model," contributors need clear, standardized procedures for adding new providers without reverse-engineering existing code.

#### What This Guide Covers

- **Complete integration workflow** from provider selection to deployment
- **Code examples** for major AI providers (OpenAI, Anthropic, Google, Groq, Ollama, and more)
- **Environment configuration** patterns and best practices
- **Testing procedures** to validate new integrations
- **Troubleshooting common issues** with solutions
- **Advanced patterns** for multi-provider setups and optimization

#### Who Should Use This Guide

This guide is intended for:

- **Contributors** adding new AI provider integrations to SambungChat
- **Developers** extending or modifying existing AI functionality
- **DevOps Engineers** configuring AI provider environments for deployment
- **Technical Leads** evaluating provider options and integration strategies

#### Prerequisites

Before following this guide, you should have:

- **Working knowledge** of TypeScript and Node.js
- **Understanding** of REST APIs and streaming responses
- **Familiarity** with environment variables and configuration management
- **Basic awareness** of AI/LLM concepts (tokens, models, prompts)
- **Access** to the SambungChat codebase

#### Expected Outcomes

After completing this guide, you will be able to:

- ✅ Integrate any AI SDK-supported provider into SambungChat
- ✅ Configure environment variables for multiple providers
- ✅ Implement provider switching and fallback mechanisms
- ✅ Test and validate new integrations
- ✅ Troubleshoot common integration issues
- ✅ Follow best practices for production deployments

---

### 1.2 What Are AI Providers?

#### Definition

In the context of SambungChat, **AI providers** are services that expose large language models (LLMs) through APIs. Each provider offers access to different models with varying capabilities, performance characteristics, and pricing structures.

#### Why Multiple Provider Support Matters

Supporting multiple AI providers provides strategic advantages:

**1. Vendor Independence**
   - Avoid lock-in to a single AI provider
   - Switch providers as the market evolves
   - Negotiate better pricing through competition

**2. Model Diversity**
   - Access different model architectures (GPT, Claude, Gemini, Llama, etc.)
   - Choose specialized models for specific tasks (code, reasoning, speed)
   - Leverage cost-effective models for different use cases

**3. Resilience and Reliability**
   - Implement fallback mechanisms during outages
   - Route traffic based on availability and performance
   - Reduce dependency on single points of failure

**4. Cost Optimization**
   - Route requests to the most cost-effective provider
   - Use cheaper models for simpler tasks
   - Implement smart caching strategies

#### Provider Types

The AI SDK supports four categories of providers:

**1. Official Providers** (14+ providers)
   - Maintained by Vercel and the AI SDK team
   - Full support and regular updates
   - Examples: OpenAI, Anthropic, Google, Groq, Azure OpenAI, Mistral AI, Cohere, Amazon Bedrock, Together AI, Fireworks, xAI, DeepSeek, Perplexity, Replicate

**2. Community Providers** (10+ providers)
   - Community-maintained integrations
   - Varying levels of support
   - Examples: Ollama (⚠️ maintenance issues noted), OpenRouter, Letta, Portkey, Cloudflare Workers AI

**3. OpenAI-Compatible Providers**
   - Standardized API compatibility with OpenAI
   - Can use the built-in `openai` provider with custom base URLs
   - Examples: LM Studio, LocalAI, vLLM, custom self-hosted models

**4. Self-Hosted Providers**
   - Run models directly on your infrastructure
   - No external API dependencies
   - Examples: Built-in AI (WebLLM), Ollama (local)

---

### 1.3 Current Provider Support

#### Currently Implemented Providers

**Google Gemini (gemini-2.5-flash)**
- ✅ **Status:** Production-ready
- ✅ **Location:** `apps/server/src/index.ts`
- ✅ **Environment Variable:** `GOOGLE_GENERATIVE_AI_API_KEY` or `GOOGLE_API_KEY`
- ✅ **Model:** `gemini-2.5-flash`
- ✅ **Use Case:** Primary provider with excellent cost-performance ratio

The current Google Gemini integration demonstrates the standard pattern that should be followed for all new providers:

```typescript
// Provider import
import { google } from "@ai-sdk/google";

// Model creation with middleware
const model = wrapLanguageModel({
  model: google("gemini-2.5-flash"),
  middleware: devToolsMiddleware(),
});

// Streaming text generation
const result = streamText({
  model,
  messages: await convertToModelMessages(uiMessages),
});
```

#### Planned Provider Support

The following providers are planned for integration based on community demand and technical requirements:

**Primary Targets:**
1. **OpenAI** (GPT-4o, GPT-4o-mini)
   - Industry-leading model quality
   - Broad ecosystem support
   - Vision and multimodal capabilities

2. **Anthropic** (Claude 3.5 Sonnet, Opus, Haiku)
   - Superior reasoning capabilities
   - Large context windows
   - Strong safety alignment

3. **Groq** (Llama 3.3, Mixtral, Gemma)
   - Ultra-low latency inference
   - Cost-effective open-source models
   - High-performance serving

4. **Ollama** (Local models)
   - Offline development and testing
   - Privacy-focused local inference
   - No API costs (compute only)

#### Provider Comparison Overview

| Provider | Models | Cost (Input) | Speed | Strength | Use Case |
|----------|---------|--------------|-------|----------|----------|
| **Google Gemini** | gemini-2.5-flash | ~$0.075/M | Fast | Multimodal, cost-effective | General purpose |
| **OpenAI** | gpt-4o, gpt-4o-mini | $0.15-$15/M | Medium | Quality, ecosystem | Complex tasks |
| **Anthropic** | claude-3-5-sonnet | $3-$15/M | Medium | Reasoning, safety | Complex reasoning |
| **Groq** | llama-3.3-70b | ~$0.59/M | Very Fast | Low latency, cost | Real-time chat |
| **Ollama** | Various local models | Free (local) | Variable | Privacy, offline | Development |

**Note:** Prices are approximate and subject to change. See [Provider-Specific Configurations](#5-provider-specific-configurations) for detailed information.

---

### 1.4 The AI SDK Advantage

SambungChat uses **Vercel AI SDK v6.x** as the foundation for AI provider integration. This strategic choice provides significant advantages over custom integrations or direct API calls.

#### Why SambungChat Uses Vercel AI SDK

**1. Provider-Agnostic Architecture**
   - Single, consistent API for all providers
   - No need to learn different provider APIs
   - Easy provider switching with minimal code changes
   - Future-proof as new providers are added

**2. Developer Experience**
   - TypeScript-first design with full type safety
   - Streaming responses built-in
   - Automatic message format conversion
   - Comprehensive error handling
   - Rich middleware ecosystem

**3. Production-Ready Features**
   - Built-in retry logic and error recovery
   - Request/response logging and debugging tools
   - Automatic rate limiting handling
   - Streaming support for real-time chat
   - Model context protocol (MCP) support

**4. Community and Ecosystem**
   - Active maintenance and regular updates
   - 25+ provider integrations out-of-the-box
   - Extensive documentation and examples
   - Strong community support

#### Benefits of Provider-Agnostic Architecture

The AI SDK's provider-agnostic design means:

**Unified Message Format**
```typescript
// Same message format works for ALL providers
const messages = [
  { role: "user", content: "Hello, AI!" }
];
```

**Consistent Streaming Interface**
```typescript
// Same streaming pattern for all providers
const result = await streamText({
  model: provider("model-id"),
  messages,
});
```

**Provider Interchangeability**
```typescript
// Switch providers by changing ONE line
// const model = openai("gpt-4o");
// const model = anthropic("claude-3-5-sonnet");
// const model = google("gemini-2.5-flash");
// const model = groq("llama-3.3-70b");
```

**Frontend Independence**
- Frontend code (`@ai-sdk/svelte` Chat component) remains unchanged
- Provider switching is purely a backend concern
- No UI changes required when adding new providers

#### Key Features of AI SDK v6.x

**1. Enhanced Streaming**
   - Real-time token streaming
   - UI message streams
   - Progressive response rendering
   - Built-in backpressure handling

**2. Advanced Capabilities**
   - **Tool/Function Calling:** Execute actions based on model responses
   - **Agents:** Complex multi-step workflows with autonomous decision-making
   - **Model Context Protocol (MCP):** Standardized context and tool integration
   - **Reranking:** Improve response quality with reranking layers

**3. Developer Tools**
   - **DevTools Middleware:** Detailed request/response inspection
   - **Error Tracing:** Comprehensive error information
   - **Performance Monitoring:** Token usage, latency tracking
   - **Testing Utilities:** Mock providers for unit testing

**4. Security and Reliability**
   - Input validation and sanitization
   - Rate limiting and quota management
   - Automatic retry with exponential backoff
   - Timeout handling

---

### 1.5 Quick Start Summary

This section provides a condensed 5-minute overview of the integration process. For detailed instructions, see [Section 4: Step-by-Step Integration Guide](#4-step-by-step-integration-guide).

#### 5-Minute Integration Overview

**Step 1: Install Provider Package** (1 minute)
```bash
cd apps/server
npm install @ai-sdk/[provider-name]
# Example: npm install @ai-sdk/openai
```

**Step 2: Add Environment Variable** (1 minute)
```bash
# Add to .env or .env.local
PROVIDER_API_KEY=your_api_key_here
# Example: OPENAI_API_KEY=sk-...
```

**Step 3: Update Server Code** (2 minutes)
```typescript
// File: apps/server/src/index.ts

// 1. Import provider
import { openai } from "@ai-sdk/openai"; // Replace with your provider

// 2. Update the model creation
const model = wrapLanguageModel({
  model: openai("gpt-4o"), // Replace with your model ID
  middleware: devToolsMiddleware(),
});

// The rest of the code remains unchanged!
```

**Step 4: Test the Integration** (1 minute)
```bash
# Start the server
cd apps/server && npm run dev

# Test with curl
curl -X POST http://localhost:PORT/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'
```

That's it! The frontend will automatically work with the new provider.

#### Minimal Complete Example

Here's the minimal code needed to integrate a new provider (using OpenAI as an example):

**`apps/server/src/index.ts`**
```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openai } from "@ai-sdk/openai"; // 1. Import provider
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import type { UiMessage } from "ai";

const app = new Hono();

app.use("/*", cors());

app.post("/ai", async (c) => {
  const { messages } = await c.req.json();

  // 2. Create model with new provider
  const model = wrapLanguageModel({
    model: openai("gpt-4o"), // Provider-specific model ID
    middleware: devToolsMiddleware(),
  });

  // 3. Generate response (no changes needed)
  const result = streamText({
    model,
    messages: await convertToModelMessages(messages as UiMessage[]),
  });

  // 4. Return stream (no changes needed)
  return result.toUIMessageStreamResponse();
});

export default app;
```

**`.env`**
```bash
# 5. Add API key to environment
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**That's everything!** No frontend changes required.

#### Links to Detailed Sections

For comprehensive coverage, refer to:

- **[Understanding the AI SDK Architecture](#2-understanding-the-ai-sdk-architecture)** - Deep dive into how the SDK works
- **[Current Implementation Analysis](#3-current-implementation-analysis)** - Walkthrough of existing Google Gemini integration
- **[Step-by-Step Integration Guide](#4-step-by-step-integration-guide)** - Complete, detailed integration instructions
- **[Provider-Specific Configurations](#5-provider-specific-configurations)** - Detailed setup for each major provider
- **[Environment Configuration](#6-environment-configuration)** - Environment variable patterns and validation
- **[Testing and Validation](#7-testing-and-validation)** - Testing procedures and validation checklists
- **[Troubleshooting and Common Issues](#8-troubleshooting-and-common-issues)** - Common problems and solutions

---

---

## 2. Understanding the AI SDK Architecture

> **Note:** This section will be added in Phase 3, Task 3. Please proceed to [Section 3: Current Implementation Analysis](#3-current-implementation-analysis) for detailed analysis of the existing Google Gemini integration.

---

## 3. Current Implementation Analysis

This section provides a comprehensive walkthrough of SambungChat's current Google Gemini integration. Understanding this implementation is crucial before adding new providers, as it establishes the pattern that should be followed for consistency.

### 3.1 Google Gemini Integration Overview

**Current Status:** ✅ Production-ready

**Implementation Details:**
- **Provider:** Google Gemini
- **Model:** `gemini-2.5-flash`
- **Location:** `apps/server/src/index.ts`
- **Frontend:** `apps/web/src/routes/ai/+page.svelte`
- **Environment Variable:** `GOOGLE_GENERATIVE_AI_API_KEY` or `GOOGLE_API_KEY`

**Why Google Gemini?**
- Excellent cost-performance ratio (~$0.075/M input tokens)
- Fast inference speeds
- Strong multimodal capabilities
- Reliable service with good uptime
- Generous free tier for development

The Google Gemini integration serves as the reference implementation for all new AI provider integrations. It demonstrates best practices for:
- Provider package usage
- Model initialization with middleware
- Streaming text generation
- Message conversion
- Frontend integration

---

### 3.2 Server-Side Implementation

**File:** `apps/server/src/index.ts`

The server-side implementation is minimal and follows a clear pattern that can be replicated for any AI provider.

#### 3.2.1 Imports and Dependencies

```typescript
// AI SDK Provider Package
import { google } from "@ai-sdk/google";

// Core AI SDK Functions
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";

// Development Tools
import { devToolsMiddleware } from "@ai-sdk/devtools";

// Web Framework
import { Hono } from "hono";
import { cors } from "hono/cors";
```

**Breakdown:**

| Import | Source | Purpose |
|--------|--------|---------|
| `google` | `@ai-sdk/google` | Provider-specific function to create Google model instances |
| `streamText` | `ai` | Generate streaming text responses |
| `convertToModelMessages` | `ai` | Convert UI message format to provider-specific format |
| `wrapLanguageModel` | `ai` | Add middleware capabilities to language models |
| `devToolsMiddleware` | `@ai-sdk/devtools` | Enable debugging and inspection tools |
| `Hono` | `hono` | Fast web framework for Node.js/Edge |
| `cors` | `hono/cors` | Cross-Origin Resource Sharing middleware |

**Key Pattern:**
Each provider exports a function (e.g., `google()`, `openai()`, `anthropic()`) that creates a language model instance. This is the only provider-specific code you'll need to change when adding new providers.

#### 3.2.2 Endpoint Configuration

```typescript
const app = new Hono();

// CORS Configuration
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// AI Endpoint
app.post("/ai", async (c) => {
  const body = await c.req.json();
  const uiMessages = body.messages || [];

  // Model creation and streaming (see 3.2.3 and 3.2.4)
  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(uiMessages),
  });

  return result.toUIMessageStreamResponse();
});
```

**Endpoint Analysis:**

**Route:** `POST /ai`

**Request Body:**
```typescript
{
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": string | Array<ContentPart>
    }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream with UI message format

**Flow:**
1. Parse JSON request body
2. Extract `messages` array (default to empty array if not provided)
3. Create model instance with middleware
4. Generate streaming response
5. Return UI message stream for frontend consumption

**Security Considerations:**
- CORS is configured to only allow requests from `env.CORS_ORIGIN`
- API key is never exposed to the client (server-side only)
- Input validation through TypeScript types and Zod schemas (in `packages/env`)

#### 3.2.3 Model Creation Pattern

```typescript
const model = wrapLanguageModel({
  model: google("gemini-2.5-flash"),
  middleware: devToolsMiddleware(),
});
```

**Pattern Breakdown:**

**1. Provider Function Call**
```typescript
google("gemini-2.5-flash")
```
- **Function:** `google()` from `@ai-sdk/google`
- **Parameter:** Model ID string (`"gemini-2.5-flash"`)
- **Returns:** Language model instance configured for Google Gemini

**Available Google Models:**
- `gemini-2.5-flash` - Fast, cost-effective (current choice)
- `gemini-2.5-flash-thinking` - With thinking mode
- `gemini-2.0-flash-exp` - Experimental version
- `gemini-pro` - More capable, slower
- `gemini-1.5-pro` - Previous generation

**2. Model Wrapping**
```typescript
wrapLanguageModel({ model, middleware })
```
- **Purpose:** Add middleware capabilities to the language model
- **Benefits:**
  - Enables debugging tools
  - Allows custom middleware injection
  - Maintains provider-agnostic interface
  - Supports future extensibility

**3. DevTools Middleware**
```typescript
devToolsMiddleware()
```
- **Purpose:** Enable AI SDK DevTools for debugging
- **Features:**
  - Request/response inspection
  - Token usage tracking
  - Performance metrics
  - Error tracing

**Why This Pattern?**

| Benefit | Description |
|---------|-------------|
| **Consistency** | Same pattern works for all providers |
| **Debugging** | DevTools middleware essential for development |
| **Extensibility** | Easy to add custom middleware later |
| **Type Safety** | Full TypeScript support throughout |

#### 3.2.4 Streaming Implementation

```typescript
const result = streamText({
  model,
  messages: await convertToModelMessages(uiMessages),
});

return result.toUIMessageStreamResponse();
```

**Streaming Breakdown:**

**1. Message Conversion**
```typescript
await convertToModelMessages(uiMessages)
```
- **Input:** Array of UI messages from frontend
- **Output:** Array of provider-specific model messages
- **Purpose:** Transform frontend message format to backend format
- **Automatic:** Handles different message structures per provider

**UI Message Format (Frontend → Backend):**
```typescript
interface UiMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<{
    type: "text" | "image" | "tool-call" | "tool-result";
    [key: string]: any;
  }>;
}
```

**Model Message Format (Backend → Provider):**
- Provider-specific format
- Automatically generated by `convertToModelMessages()`
- Optimized for each provider's API

**2. Streaming Text Generation**
```typescript
const result = streamText({
  model,
  messages,  // Converted messages
});
```
- **Function:** `streamText()` from AI SDK
- **Returns:** StreamResult object with multiple methods
- **Async:** Generates tokens in real-time

**StreamResult Methods:**
- `textStream` - Async iterable of text chunks
- `fullStream` - Complete stream with metadata
- `toUIMessageStreamResponse()` - HTTP Response for frontend
- `toDataStreamResponse()` - Lower-level data stream

**3. UI Message Stream Response**
```typescript
return result.toUIMessageStreamResponse();
```
- **Returns:** HTTP Response with Server-Sent Events (SSE)
- **Format:** UI message format compatible with frontend
- **Real-time:** Streams tokens as they're generated
- **Automatic:** Handles all streaming complexity

**Response Format:**
```
data: {"type":"text-delta","delta":"Hello"}
data: {"type":"text-delta","delta":" there"}
data: {"type":"text-delta","delta":"!"}
data: [DONE]
```

**Why Streaming?**

| Advantage | Description |
|-----------|-------------|
| **User Experience** | Real-time response generation feels faster |
| **Perceived Latency** | Time to first token (TTFT) is much lower |
| **Cost Feedback** | Users can stop generation if unsatisfied |
| **Large Outputs** | No waiting for complete responses |
| **Natural Chat** | Mimics human conversation patterns |

---

### 3.3 Frontend Implementation

**File:** `apps/web/src/routes/ai/+page.svelte`

The frontend implementation is **provider-agnostic**, meaning it works with any AI provider without changes. This is one of the key benefits of using the AI SDK.

#### 3.3.1 Chat Component Setup

```typescript
import { Chat } from "@ai-sdk/svelte";
import { DefaultChatTransport } from "ai";

// Initialize Chat with transport
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: `${PUBLIC_SERVER_URL}/ai`,
  }),
});
```

**Component Breakdown:**

**1. Chat Component**
- **Source:** `@ai-sdk/svelte`
- **Purpose:** Pre-built chat UI component
- **Features:**
  - Message management
  - Automatic streaming handling
  - Typing indicators
  - Error handling
  - Reactive state management

**2. Transport Layer**
- **Class:** `DefaultChatTransport`
- **Purpose:** Communicate with server `/ai` endpoint
- **Features:**
  - Automatic message formatting
  - Stream handling
  - Error recovery
  - Retry logic

**3. API Endpoint**
```typescript
api: `${PUBLIC_SERVER_URL}/ai`
```
- **Environment Variable:** `PUBLIC_SERVER_URL`
- **Route:** `/ai` (server endpoint)
- **Protocol:** POST with Server-Sent Events (SSE)

**Provider Agnostic Design:**

The frontend doesn't know or care which AI provider is being used:
- ✅ No provider-specific imports
- ✅ No model configuration
- ✅ No API key handling
- ✅ Same interface for all providers

This means you can **change providers on the server without touching frontend code**.

#### 3.3.2 Message Handling and UI

```typescript
// Send message
function handleSubmit(e: Event) {
  e.preventDefault();
  const text = input.trim();
  if (!text) return;
  chat.sendMessage({ text });
  input = "";
}

// Access messages
chat.messages  // Reactive array of messages
```

**Message Structure:**
```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{
    type: "text" | "image" | "tool-call" | "tool-result";
    text?: string;
    [key: string]: any;
  }>;
  createdAt?: Date;
}
```

**UI Rendering (Svelte):**
```svelte
{#each chat.messages as message (message.id)}
  <div class:message-user={message.role === "user"}>
    {#each message.parts as part}
      {#if part.type === "text"}
        {part.text}
      {/if}
    {/each}
  </div>
{/each}
```

**Key Features:**

1. **Automatic Streaming**
   - Messages appear in real-time as tokens are generated
   - No manual stream handling required
   - Automatic scrolling to latest message

2. **Reactive State**
   - `chat.messages` is a Svelte 5 `$state` rune
   - UI updates automatically when messages change
   - No manual state management needed

3. **Error Handling**
   - Automatic retry on failure
   - Error messages displayed in UI
   - Graceful degradation

4. **Type Safety**
   - Full TypeScript support
   - Message parts are typed
   - Compile-time error checking

**Why This Design?**

| Benefit | Description |
|---------|-------------|
| **Zero Provider Lock-in** | Frontend works with any provider |
| **Minimal Code** | ~100 lines for full chat UI |
| **Type Safe** | Full TypeScript support |
| **Reactive** | Automatic updates with Svelte 5 runes |
| **Maintainable** | Clean separation of concerns |

---

### 3.4 Environment Configuration

**Current State:** ⚠️ No AI provider variables in environment schema yet

**File:** `packages/env/src/server.ts`

**Current Environment Schema:**
```typescript
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // ⚠️ No AI provider variables configured yet
  },
});
```

**Current Environment Variables:**

The Google API key is automatically loaded by the AI SDK from one of these environment variables:

1. **Primary:** `GOOGLE_GENERATIVE_AI_API_KEY`
2. **Alternative:** `GOOGLE_API_KEY`

The AI SDK automatically checks for these variables in the environment, so even though they're not in the Zod schema, they still work.

**⚠️ Gap Identified:**

For production use, the environment schema should be updated to:
- Validate AI provider API keys
- Support multiple providers
- Implement provider selection logic
- Add configuration validation

**Planned Update (Phase 5):**
```typescript
export const env = createEnv({
  server: {
    // Existing variables...
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // AI Provider Configuration
    AI_PROVIDER: z.enum(["openai", "anthropic", "google", "groq"]).optional(),

    // API Keys (at least one required)
    OPENAI_API_KEY: z.string().min(1).optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
    GROQ_API_KEY: z.string().min(1).optional(),
  },
});
```

**For Now:**

When adding a new provider, you need to:
1. Add the environment variable to `.env` or `.env.local`
2. The AI SDK will automatically pick it up
3. No schema validation yet (will be added in Phase 5)

**Example `.env.local` for Google Gemini:**
```bash
# AI Provider Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
# Alternative: GOOGLE_API_KEY=your_google_api_key_here
```

---

### 3.5 Key Takeaways for New Providers

Based on the current Google Gemini implementation, here are the key patterns and principles to follow when adding new AI providers:

#### Pattern Consistency

**✅ Always Follow This Pattern:**

```typescript
// 1. Import provider
import { [provider] } from "@ai-sdk/[provider]";

// 2. Import AI SDK functions (same for all providers)
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

// 3. Create model with middleware
const model = wrapLanguageModel({
  model: [provider]("[model-id]"),
  middleware: devToolsMiddleware(),
});

// 4. Generate streaming response
const result = streamText({
  model,
  messages: await convertToModelMessages(uiMessages),
});

// 5. Return UI message stream
return result.toUIMessageStreamResponse();
```

**What Changes:**
- Provider import (line 1)
- Provider function call (line 9)
- Model ID (line 9)
- Environment variable name

**What Stays the Same:**
- `wrapLanguageModel()` pattern
- `devToolsMiddleware()` usage
- `streamText()` implementation
- `convertToModelMessages()` call
- `toUIMessageStreamResponse()` return

#### Frontend Independence

**✅ Zero Frontend Changes Required**

When adding a new provider:
- ❌ Don't touch `apps/web/src/routes/ai/+page.svelte`
- ❌ Don't modify `Chat` component
- ❌ Don't change transport configuration
- ✅ Only update server code in `apps/server/src/index.ts`

The frontend is completely provider-agnostic due to the AI SDK's architecture.

#### Server Changes Are Isolated

**✅ Changes Limited to Endpoint Implementation**

When adding a new provider, you only need to modify:
- Import statements (add provider import)
- Model creation (use provider function instead of `google()`)
- Environment variable (add API key to `.env`)

Everything else in the server remains unchanged.

#### Middleware is Essential

**✅ Always Use `wrapLanguageModel()`**

Don't skip the middleware wrapper:
- Enables DevTools for debugging
- Allows future custom middleware
- Maintains consistency
- Best practice recommended by AI SDK

#### Environment Variables

**✅ Follow Provider-Specific Patterns**

Each provider has its own environment variable name:
- OpenAI: `OPENAI_API_KEY`
- Anthropic: `ANTHROPIC_API_KEY`
- Google: `GOOGLE_GENERATIVE_AI_API_KEY` or `GOOGLE_API_KEY`
- Groq: `GROQ_API_KEY`

Check the provider documentation for the exact variable name.

#### Testing Strategy

**✅ Test incrementally:**

1. **Unit Test:** Verify model creation
   ```typescript
   const model = wrapLanguageModel({
     model: openai("gpt-4o-mini"),
     middleware: devToolsMiddleware(),
   });
   console.log("Model created successfully");
   ```

2. **Integration Test:** Test `/ai` endpoint with curl
   ```bash
   curl -X POST http://localhost:PORT/ai \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello"}]}'
   ```

3. **Frontend Test:** Open chat UI and send a message
   - Verify streaming works
   - Check for errors in browser console
   - Confirm message appears in real-time

#### Error Handling

**✅ The AI SDK handles most errors automatically:**

- Invalid API keys → Authentication error (401)
- Rate limits → Rate limit error (429)
- Network issues → Timeout error
- Invalid model ID → Model not found error

For production, add custom error handling:
```typescript
app.post("/ai", async (c) => {
  try {
    const body = await c.req.json();
    const uiMessages = body.messages || [];

    const model = wrapLanguageModel({
      model: google("gemini-2.5-flash"),
      middleware: devToolsMiddleware(),
    });

    const result = streamText({
      model,
      messages: await convertToModelMessages(uiMessages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI provider error:", error);
    return c.json({ error: "AI service temporarily unavailable" }, 503);
  }
});
```

#### Checklist for New Providers

When adding a new provider, ensure you:

- [ ] Install provider package (`bun add @ai-sdk/[provider]`)
- [ ] Import provider function
- [ ] Add environment variable for API key
- [ ] Update model creation to use provider function
- [ ] Use correct model ID for provider
- [ ] Keep `wrapLanguageModel()` pattern
- [ ] Keep `devToolsMiddleware()` usage
- [ ] Test with curl command
- [ ] Test with frontend chat UI
- [ ] Verify streaming works correctly
- [ ] Check for errors in browser console
- [ ] Verify no frontend changes needed
- [ ] Document the integration

---

### 3.6 Summary

The current Google Gemini implementation demonstrates a clean, maintainable pattern for AI provider integration:

**Strengths:**
- ✅ Minimal code (~10 lines for endpoint)
- ✅ Consistent pattern across providers
- ✅ Full streaming support
- ✅ Type-safe with TypeScript
- ✅ Provider-agnostic frontend
- ✅ Development tools integration

**Key Pattern:**
```typescript
// This 4-line pattern is all you need to change providers
const model = wrapLanguageModel({
  model: [provider]("[model-id]"),
  middleware: devToolsMiddleware(),
});
```

**Next Steps:**
- Proceed to [Section 4: Step-by-Step Integration Guide](#4-step-by-step-integration-guide) for detailed instructions on adding new providers
- See [Section 5: Provider-Specific Configurations](#5-provider-specific-configurations) for setup details for each major provider

---

## 4. Step-by-Step Integration Guide

This section provides detailed, step-by-step instructions for integrating a new AI provider into SambungChat. Each step includes code examples, explanations, and best practices to ensure a successful integration.

### 4.1 Overview of Integration Process

Adding a new AI provider to SambungChat follows a consistent, well-defined process. The entire integration typically takes **15-30 minutes** for a basic setup.

#### High-Level Workflow

```
1. Research & Preparation (5 min)
   ↓
2. Environment Configuration (3 min)
   ↓
3. Server Implementation (5 min)
   ↓
4. Testing (5 min)
   ↓
5. Deployment & Monitoring (ongoing)
```

#### Estimated Time Breakdown

| Step | Task | Time | Complexity |
|------|------|------|------------|
| 4.2 | Research and preparation | 5 minutes | Low |
| 4.3 | Environment configuration | 3 minutes | Low |
| 4.4 | Server implementation | 5 minutes | Low |
| 4.5 | Testing | 5-10 minutes | Medium |
| 4.6 | Deployment and monitoring | Ongoing | Medium |

**Total Initial Setup:** ~18-30 minutes

#### Dependencies Between Steps

- **Step 4.2** must be completed before **Step 4.3** (need API key before configuration)
- **Step 4.3** must be completed before **Step 4.4** (need environment variables before server code)
- **Step 4.4** must be completed before **Step 4.5** (need implementation before testing)
- **Step 4.5** must be completed before **Step 4.6** (need passing tests before deployment)

---

### 4.2 Step 1: Research and Preparation

Before writing any code, gather the necessary information about your chosen AI provider.

#### 4.2.1 Choose Your Provider

Select the AI provider that best fits your use case. Consider the following criteria:

**Provider Selection Criteria:**

| Criteria | Questions to Ask | Importance |
|----------|------------------|------------|
| **Cost** | What's the price per 1M tokens? Are there free tiers? | High |
| **Performance** | What's the latency (time to first token)? Throughput? | High |
| **Quality** | How good are the model's responses? Benchmarks? | High |
| **Use Case** | Does the model specialize in your use case (code, reasoning, chat)? | High |
| **Reliability** | What's the uptime? SLA guarantees? | Medium |
| **Ecosystem** | Is there good documentation? Community support? | Medium |
| **Data Privacy** | Where are the servers? Data retention policies? | Medium |

**Quick Provider Comparison:**

| Provider | Best For | Cost (Input) | Speed | Quality |
|----------|----------|--------------|-------|----------|
| **OpenAI** | General-purpose, complex tasks | $0.15-$15/M | Medium | ⭐⭐⭐⭐⭐ |
| **Anthropic** | Complex reasoning, safety-critical | $3-$15/M | Medium | ⭐⭐⭐⭐⭐ |
| **Google** | Cost-effective, multimodal | ~$0.075/M | Fast | ⭐⭐⭐⭐ |
| **Groq** | Real-time chat, low latency | ~$0.59/M | Very Fast | ⭐⭐⭐⭐ |
| **Ollama** | Offline development, privacy | Free (local) | Variable | ⭐⭐⭐ |

**Decision Framework:**

```
If you need...                    Choose...
─────────────────────────────────────────────────────────────
Highest quality, any cost         → OpenAI (gpt-4o) or Anthropic (claude-3-5-sonnet)
Best cost-performance ratio       → Google (gemini-2.5-flash)
Fastest response time             → Groq (llama-3.3-70b)
Offline/local development         → Ollama
Complex reasoning                 → Anthropic (claude-3-5-sonnet)
Code generation                   → OpenAI (gpt-4o) or Anthropic (claude-3-5-sonnet)
Multimodal (vision, audio)        → OpenAI (gpt-4o) or Google (gemini-2.5-flash)
```

#### 4.2.2 Gather Required Information

Once you've chosen a provider, collect the following information:

**Essential Information:**

1. **Provider Package Name**
   - Official providers follow the pattern: `@ai-sdk/[provider]`
   - Example: `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/groq`
   - Find it in the [AI SDK providers documentation](https://ai-sdk.dev/providers/ai-sdk-providers)

2. **API Key**
   - How to obtain: Provider's developer console/dashboard
   - Required format: Usually starts with a prefix (e.g., `sk-` for OpenAI)
   - Permissions needed: At minimum, API access for chat models

3. **Model IDs**
   - Available models for the provider
   - Model IDs to use in code (e.g., `gpt-4o-mini`, `claude-3-5-sonnet`)
   - Model capabilities and limitations

4. **Environment Variable Name**
   - The exact environment variable name expected by the provider
   - Examples: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
   - Some providers support alternative variable names

5. **Rate Limits and Quotas**
   - Requests per minute (RPM) or tokens per minute (TPM)
   - Daily or monthly quotas
   - Consequences of exceeding limits

6. **Pricing Information**
   - Cost per 1M input tokens
   - Cost per 1M output tokens
   - Any additional fees (e.g., for images, special features)

**Information Sources:**

- **Official Provider Documentation:** Most authoritative source
- **AI SDK Provider Documentation:** Integration-specific guidance
- **Provider Pricing Page:** Current pricing and tiers
- **Provider Status Page:** Uptime and known issues

**Example: Gathering Information for OpenAI**

| Information | Value | Source |
|-------------|-------|--------|
| Package Name | `@ai-sdk/openai` | AI SDK docs |
| API Key Prefix | `sk-` | OpenAI dashboard |
| Model IDs | `gpt-4o`, `gpt-4o-mini`, `o1-preview` | OpenAI docs |
| Environment Variable | `OPENAI_API_KEY` | AI SDK docs |
| Rate Limits | 10,000 TPM (Tier 1) | OpenAI docs |
| Pricing | $2.50/M input (gpt-4o-mini) | OpenAI pricing |
| Documentation | https://platform.openai.com/docs | OpenAI |

#### 4.2.3 Install Provider Package

Once you've gathered the necessary information, install the provider package.

**Installation Command:**

```bash
# Navigate to the server directory
cd apps/server

# Install the provider package (replace with your chosen provider)
bun add @ai-sdk/[provider-name]

# Example for OpenAI:
bun add @ai-sdk/openai

# Example for Anthropic:
bun add @ai-sdk/anthropic

# Example for Groq:
bun add @ai-sdk/groq
```

**Verify Installation:**

Check that the package was added to `apps/server/package.json`:

```json
{
  "dependencies": {
    "@ai-sdk/google": "^3.0.1",
    "@ai-sdk/openai": "^1.0.0",  // ← Your new provider
    "ai": "catalog:",
    // ... other dependencies
  }
}
```

**Verify Package Version:**

```bash
# Check installed version
bun pm ls | grep @ai-sdk/openai

# Expected output:
# @ai-sdk/openai@x.x.x
```

**Troubleshooting Installation Issues:**

| Issue | Solution |
|-------|----------|
| Package not found | Verify package name: `@ai-sdk/[provider]` |
| Version conflicts | Check AI SDK compatibility: `ai` package version |
| Network error | Try again or check internet connection |
| Permission denied | Run with appropriate permissions |

---

### 4.3 Step 2: Configure Environment Variables

Environment variables are used to securely store API keys and configuration. This step ensures your provider's credentials are available to the application.

#### 4.3.1 Identify Required Variables

Each provider requires specific environment variables. Most commonly, this is just an API key.

**Standard Pattern:**

```
[PROVIDER]_API_KEY
```

**Examples:**

- OpenAI: `OPENAI_API_KEY`
- Anthropic: `ANTHROPIC_API_KEY`
- Google: `GOOGLE_GENERATIVE_AI_API_KEY` or `GOOGLE_API_KEY`
- Groq: `GROQ_API_KEY`

**Optional Variables:**

Some providers support additional configuration:

- **Base URL:** `[PROVIDER]_BASE_URL` (for custom endpoints)
- **Organization:** `[PROVIDER]_ORGANIZATION` (for multi-tenant accounts)
- **Region:** `[PROVIDER]_REGION` (for regional deployments)
- **API Version:** `[PROVIDER]_API_VERSION` (for versioned APIs)

**Example: OpenAI Environment Variables**

```bash
# Required
OPENAI_API_KEY=sk-proj-abc123...

# Optional (for custom deployments)
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_ORGANIZATION=org-abc123...
```

**Tip:** Consult the provider's documentation for the complete list of supported environment variables.

#### 4.3.2 Add to Environment Schema

⚠️ **Note:** As of the current implementation, the environment schema (`packages/env/src/server.ts`) does not include AI provider variables. This is planned for Phase 5.

For now, the AI SDK will automatically read environment variables, so you can skip this step. However, for production use, you should add validation.

**Current State (No Schema Validation):**

```typescript
// packages/env/src/server.ts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // ⚠️ No AI provider variables yet
  },
});
```

**Recommended (Phase 5 - Future):**

```typescript
// packages/env/src/server.ts
export const env = createEnv({
  server: {
    // Existing variables...
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // AI Provider Configuration (recommended)
    OPENAI_API_KEY: z.string().min(1).optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
    GROQ_API_KEY: z.string().min(1).optional(),
  },
});
```

**For Now:** Proceed to Step 4.3.3 and add variables directly to your `.env` files.

#### 4.3.3 Update .env Files

Add your provider's environment variables to the appropriate environment files.

**For Local Development:**

Create or update `.env.local` in the project root:

```bash
# .env.local (do not commit to version control)

# AI Provider: OpenAI (replace with your chosen provider)
OPENAI_API_KEY=sk-proj-your_actual_api_key_here

# If using Anthropic:
# ANTHROPIC_API_KEY=sk-ant-your_actual_api_key_here

# If using Groq:
# GROQ_API_KEY=gsk-your_actual_api_key_here
```

**For Documentation:**

Update `.env.example` to show the expected format (without actual keys):

```bash
# .env.example (safe to commit)

# AI Provider Configuration
# Choose one or more providers to enable

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Anthropic (https://console.anthropic.com/settings/keys)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key_here

# Google Gemini (https://makersuite.google.com/app/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
# Alternative: GOOGLE_API_KEY=your_google_api_key_here

# Groq (https://console.groq.com/keys)
GROQ_API_KEY=gsk-your_groq_api_key_here
```

**Environment File Best Practices:**

| Practice | Description | Example |
|----------|-------------|---------|
| **Never commit .env.local** | Contains actual secrets | Add to `.gitignore` |
| **Commit .env.example** | Shows required variables | Use placeholder values |
| **Use different keys per environment** | Dev, staging, production | `OPENAI_DEV_KEY`, `OPENAI_PROD_KEY` |
| **Document key source** | Where to obtain the key | Add comments with URLs |
| **Group related variables** | Easier to read | Separate sections with comments |

**Verify Environment Variable:**

Test that the environment variable is accessible:

```bash
# In your terminal, from the project root
echo $OPENAI_API_KEY

# Or test with Node.js
node -e "console.log(process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set')"
```

---

### 4.4 Step 3: Update Server Implementation

With the provider package installed and environment variables configured, update the server code to integrate the new provider.

#### 4.4.1 Import Provider

**File:** `apps/server/src/index.ts`

Add the provider import at the top of the file:

```typescript
// Existing imports...
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

// Existing provider import
import { google } from "@ai-sdk/google";

// ⭐ ADD YOUR NEW PROVIDER IMPORT HERE
import { openai } from "@ai-sdk/openai";  // Replace with your provider
```

**Import Pattern:**

```typescript
// General pattern:
import { [provider-name] } from "@ai-sdk/[provider-package]";

// Examples:
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
```

**Full Import Section Example:**

```typescript
// apps/server/src/index.ts

// Web Framework
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Environment Configuration
import { env } from "@sambungchat/env";

// AI SDK - Core Functions
import { streamText, convertToModelMessages, wrapLanguageModel } from "ai";
import type { UiMessage } from "ai";

// AI SDK - Development Tools
import { devToolsMiddleware } from "@ai-sdk/devtools";

// AI SDK - Providers
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";  // ← New provider import
// import { anthropic } from "@ai-sdk/anthropic";  // Future providers
// import { groq } from "@ai-sdk/groq";  // Future providers
```

#### 4.4.2 Create Model Instance

Update the model creation in the `/ai` endpoint to use your new provider.

**Current Code (Google Gemini):**

```typescript
app.post("/ai", async (c) => {
  const { messages } = await c.req.json();

  // Current provider: Google Gemini
  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});
```

**Updated Code (OpenAI Example):**

```typescript
app.post("/ai", async (c) => {
  const { messages } = await c.req.json();

  // ⭐ NEW PROVIDER: OpenAI
  const model = wrapLanguageModel({
    model: openai("gpt-4o-mini"),  // ← Change: Provider and model ID
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});
```

**Pattern for Any Provider:**

```typescript
// Only ONE line changes:
const model = wrapLanguageModel({
  model: [provider-function]("[model-id]"),
  middleware: devToolsMiddleware(),
});
```

**Examples for Different Providers:**

```typescript
// OpenAI
const model = wrapLanguageModel({
  model: openai("gpt-4o-mini"),
  middleware: devToolsMiddleware(),
});

// Anthropic
const model = wrapLanguageModel({
  model: anthropic("claude-3-5-sonnet-20241022"),
  middleware: devToolsMiddleware(),
});

// Groq
const model = wrapLanguageModel({
  model: groq("llama-3.3-70b-versatile"),
  middleware: devToolsMiddleware(),
});
```

#### 4.4.3 Integration Options

There are three approaches to integrating your new provider, depending on your requirements.

**Option A: Replace Current Provider** (Simplest)

Replace the existing Google Gemini with your new provider:

```typescript
// Before
import { google } from "@ai-sdk/google";

const model = wrapLanguageModel({
  model: google("gemini-2.5-flash"),
  middleware: devToolsMiddleware(),
});

// After
import { openai } from "@ai-sdk/openai";

const model = wrapLanguageModel({
  model: openai("gpt-4o-mini"),
  middleware: devToolsMiddleware(),
});
```

**Pros:**
- ✅ Simplest change (1 line of code)
- ✅ No endpoint changes
- ✅ Frontend remains unchanged

**Cons:**
- ❌ Loses Google Gemini support
- ❌ Single point of failure

**Best For:**
- Testing a new provider
- Switching providers completely
- Simple use cases

---

**Option B: Support Multiple Providers** (Recommended)

Implement dynamic provider selection based on environment configuration:

```typescript
// apps/server/src/index.ts

// Import all providers
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";

// Provider selection function
function getModel() {
  const provider = process.env.AI_PROVIDER || "google";

  switch (provider) {
    case "openai":
      return wrapLanguageModel({
        model: openai("gpt-4o-mini"),
        middleware: devToolsMiddleware(),
      });

    case "anthropic":
      return wrapLanguageModel({
        model: anthropic("claude-3-5-sonnet-20241022"),
        middleware: devToolsMiddleware(),
      });

    case "groq":
      return wrapLanguageModel({
        model: groq("llama-3.3-70b-versatile"),
        middleware: devToolsMiddleware(),
      });

    case "google":
    default:
      return wrapLanguageModel({
        model: google("gemini-2.5-flash"),
        middleware: devToolsMiddleware(),
      });
  }
}

app.post("/ai", async (c) => {
  const { messages } = await c.req.json();

  // Dynamic model selection
  const model = getModel();

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});
```

**Environment Configuration:**

```bash
# .env.local
AI_PROVIDER=openai  # Options: openai, anthropic, google, groq
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
GROQ_API_KEY=gsk-...
```

**Pros:**
- ✅ Support multiple providers simultaneously
- ✅ Easy switching via environment variable
- ✅ Can implement fallback logic
- ✅ No frontend changes needed

**Cons:**
- ❌ More complex code
- ❌ Need to manage multiple API keys

**Best For:**
- Production deployments
- Provider redundancy and fallback
- Cost optimization (switch based on usage)

---

**Option C: Separate Endpoints** (Advanced)

Create separate endpoints for each provider:

```typescript
// apps/server/src/index.ts

// Google Gemini endpoint (existing)
app.post("/ai", async (c) => {
  const { messages } = await c.req.json();

  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});

// OpenAI endpoint (new)
app.post("/ai/openai", async (c) => {
  const { messages } = await c.req.json();

  const model = wrapLanguageModel({
    model: openai("gpt-4o-mini"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});

// Anthropic endpoint (new)
app.post("/ai/anthropic", async (c) => {
  const { messages } = await c.req.json();

  const model = wrapLanguageModel({
    model: anthropic("claude-3-5-sonnet-20241022"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});
```

**Frontend Configuration:**

```typescript
// apps/web/src/routes/ai/+page.svelte

// Choose endpoint based on user preference
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: `${PUBLIC_SERVER_URL}/ai/openai`,  // or /ai/anthropic, etc.
  }),
});
```

**Pros:**
- ✅ Maximum flexibility
- ✅ Can use multiple providers simultaneously
- ✅ Easy to compare providers
- ✅ Provider-specific customization

**Cons:**
- ❌ Requires frontend changes to select endpoint
- ❌ More code to maintain
- ❌ Potential confusion for users

**Best For:**
- A/B testing different providers
- Provider comparison tools
- Advanced use cases

**Recommendation:**

For most use cases, **Option B (Support Multiple Providers)** is recommended. It provides flexibility without frontend changes and allows easy provider switching.

---

### 4.5 Step 4: Test the Integration

Testing ensures your new provider integration works correctly before deploying to production.

#### 4.5.1 Manual Testing

**Test 1: Verify Server Starts**

```bash
# Navigate to server directory
cd apps/server

# Start development server
bun run dev

# Expected output:
# ✅ Server running on http://localhost:PORT
# No errors about missing API keys or imports
```

**If you see errors:**
- `Cannot find module '@ai-sdk/[provider]'` → Provider not installed (Step 4.2.3)
- `API key not found` → Environment variable not set (Step 4.3.3)
- `Invalid API key` → Incorrect or expired API key

---

**Test 2: Test Endpoint with curl**

```bash
# Test the /ai endpoint with a simple message
curl -X POST http://localhost:5173/ai \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello! Can you hear me?"
      }
    ]
  }'

# Expected response: Streaming text with provider's response
# data: {"type":"text-delta","delta":"Hello"}
# data: {"type":"text-delta","delta":"!"}
# data: [DONE]
```

**What to Check:**
- ✅ Response starts immediately (no long delays)
- ✅ Text streams token-by-token
- ✅ Response is coherent
- ✅ No error messages in stream

**Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid API key | Check environment variable |
| `429 Too Many Requests` | Rate limit exceeded | Wait or upgrade quota |
| `500 Internal Server Error` | Code error | Check server logs |
| `Model not found` | Wrong model ID | Verify model name |
| No response | Timeout/CORS | Check network settings |

---

**Test 3: Test with Frontend Chat UI**

```bash
# Start the web application
cd apps/web
bun run dev

# Navigate to chat UI in browser
open http://localhost:5174/ai
```

**Testing Checklist:**

- [ ] Chat interface loads
- [ ] Send a message: "Hello, can you introduce yourself?"
- [ ] Verify response appears in real-time (streaming)
- [ ] Check browser console for errors (F12 → Console)
- [ ] Verify response quality matches provider's capabilities
- [ ] Send a follow-up message to test conversation context
- [ ] Test with empty message (should handle gracefully)
- [ ] Test with very long message (test streaming)

**Expected Behavior:**

```
User: Hello, can you introduce yourself?
Assistant: [Streams in] "Hello! I'm an AI assistant powered by [Provider]. I'm here to help you with..."
```

**Browser Console Check:**

Press F12 and check the Console tab:
- ✅ No red error messages
- ✅ Network tab shows successful `/ai` request
- ✅ EventSource connection remains open
- ✅ Messages appear in chat.messages array

---

**Test 4: Test Error Handling**

Test how the integration handles errors:

```bash
# Test with invalid API key
export OPENAI_API_KEY=invalid
curl -X POST http://localhost:5173/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'

# Expected: Graceful error message, not crash
```

**Verify:**
- ✅ Server doesn't crash
- ✅ Error message is user-friendly
- ✅ Error is logged for debugging
- ✅ Frontend shows error notification

#### 4.5.2 Automated Testing

While manual testing is essential, automated tests provide confidence for future changes.

**Unit Test Example:**

```typescript
// tests/unit/providers.test.ts

import { describe, it, expect } from "bun:test";
import { openai } from "@ai-sdk/openai";
import { wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

describe("OpenAI Provider", () => {
  it("should create model instance", () => {
    const model = wrapLanguageModel({
      model: openai("gpt-4o-mini"),
      middleware: devToolsMiddleware(),
    });

    expect(model).toBeDefined();
    expect(model.provider).toBe("openai");
  });

  it("should have correct model ID", () => {
    const model = wrapLanguageModel({
      model: openai("gpt-4o-mini"),
      middleware: devToolsMiddleware(),
    });

    expect(model.modelId).toBe("gpt-4o-mini");
  });
});
```

**Run Unit Tests:**

```bash
bun test tests/unit/providers.test.ts
```

---

**Integration Test Example:**

```typescript
// tests/integration/ai-endpoint.test.ts

import { describe, it, expect } from "bun:test";

describe("AI Endpoint", () => {
  const serverUrl = "http://localhost:5173";

  it("should return streaming response", async () => {
    const response = await fetch(`${serverUrl}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Test" }],
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
  });

  it("should handle empty messages", async () => {
    const response = await fetch(`${serverUrl}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });

    // Should handle gracefully (200 or appropriate error code)
    expect([200, 400, 422]).toContain(response.status);
  });
});
```

**Run Integration Tests:**

```bash
# Start server first
bun run dev &

# Run tests
bun test tests/integration/ai-endpoint.test.ts
```

---

**Test Summary Checklist:**

- [ ] ✅ Server starts without errors
- [ ] ✅ Environment variables loaded correctly
- [ ] ✅ Provider import succeeds
- [ ] ✅ Model creation works
- [ ] ✅ `/ai` endpoint responds
- [ ] ✅ Streaming works correctly
- [ ] ✅ Frontend chat interface works
- [ ] ✅ Browser console shows no errors
- [ ] ✅ Error handling works
- [ ] ✅ Unit tests pass
- [ ] ✅ Integration tests pass

If all tests pass, your integration is ready for deployment!

---

### 4.6 Step 5: Deploy and Monitor

Once your integration passes all tests, it's ready for deployment. This step ensures your provider works correctly in production.

#### 4.6.1 Production Deployment

**1. Update Production Environment Variables**

Add your provider's API key to the production environment:

```bash
# Production environment (e.g., Vercel, AWS, DigitalOcean)
# Configure these in your hosting platform's dashboard

AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your_production_api_key
```

**Security Best Practices:**

- ✅ Use different API keys for development and production
- ✅ Store keys in secret management services (not .env files)
- ✅ Rotate keys regularly (every 30-90 days)
- ✅ Monitor API key usage for anomalies
- ✅ Set up alerts for unusual activity

**2. Build and Deploy**

```bash
# Build the application
bun run build

# Deploy (platform-specific)
# For Vercel:
vercel --prod

# For custom deployment:
bun run start:prod
```

**3. Verify Deployment**

```bash
# Test production endpoint
curl -X POST https://your-domain.com/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Production test"}]}'
```

**4. Update Monitoring and Logging**

Ensure your production environment has proper monitoring:

```typescript
// apps/server/src/index.ts

app.post("/ai", async (c) => {
  const startTime = Date.now();

  try {
    const { messages } = await c.req.json();

    const model = wrapLanguageModel({
      model: openai("gpt-4o-mini"),
      middleware: devToolsMiddleware(),
    });

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });

    // Log success
    const duration = Date.now() - startTime;
    console.log(`✅ AI request successful: ${duration}ms`);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    // Log error with context
    const duration = Date.now() - startTime;
    console.error(`❌ AI request failed after ${duration}ms:`, error);

    // Return user-friendly error
    return c.json(
      {
        error: "AI service temporarily unavailable",
        code: "AI_SERVICE_ERROR",
      },
      503
    );
  }
});
```

#### 4.6.2 Post-Deployment Checklist

After deploying, complete these verification steps:

**Connectivity Verification:**

- [ ] ✅ API endpoint is accessible from production URL
- [ ] ✅ Environment variables are loaded correctly
- [ ] ✅ API key is valid and has sufficient quota
- [ ] ✅ Network/firewall allows outbound API calls

**Functional Testing:**

- [ ] ✅ Send test message through production chat UI
- [ ] ✅ Verify streaming works in production
- [ ] ✅ Test with real user scenarios
- [ ] ✅ Verify response quality

**Monitoring Setup:**

- [ ] ✅ Set up uptime monitoring for `/ai` endpoint
- [ ] ✅ Configure error tracking (e.g., Sentry)
- [ ] ✅ Monitor API usage and costs
- [ ] ✅ Set up alerts for:
  - High error rates (>5%)
  - Slow response times (>10s)
  - API quota exceeded
  - Unusual traffic patterns

**Documentation Updates:**

- [ ] ✅ Update README with new provider support
- [ ] ✅ Document any provider-specific configuration
- [ ] ✅ Update deployment documentation
- [ ] ✅ Notify team of new provider availability

**Cost Monitoring:**

- [ ] ✅ Check provider dashboard for usage
- [ ] ✅ Set up budget alerts
- [ ] ✅ Monitor token usage patterns
- [ ] ✅ Track costs per user/request

**Performance Monitoring:**

- [ ] ✅ Track time to first token (TTFT)
- [ ] ✅ Monitor total response times
- [ ] ✅ Measure streaming performance
- [ ] ✅ Identify bottlenecks

**Example Monitoring Dashboard Metrics:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Success Rate | >99% | <95% |
| Avg Response Time | <3s | >10s |
| Time to First Token | <1s | >5s |
| Error Rate | <1% | >5% |
| Daily Token Usage | <1M | >900K |

---

### 4.7 Integration Checklist

Use this comprehensive checklist to ensure all steps are completed correctly:

**Pre-Integration (Step 4.2):**

- [ ] Provider researched and selected
- [ ] Provider package name identified
- [ ] API key obtained from provider dashboard
- [ ] Model IDs and capabilities documented
- [ ] Rate limits and pricing reviewed
- [ ] Provider package installed (`bun add @ai-sdk/[provider]`)
- [ ] Package installation verified in `package.json`

**Environment Configuration (Step 4.3):**

- [ ] Required environment variables identified
- [ ] API key added to `.env.local` (not committed)
- [ ] Environment variable format verified
- [ ] `.env.example` updated with placeholder (committed)
- [ ] Environment variable tested with `echo $VAR`

**Server Implementation (Step 4.4):**

- [ ] Provider import added to `apps/server/src/index.ts`
- [ ] Model creation updated with provider function
- [ ] Model ID verified for provider
- [ ] `wrapLanguageModel()` pattern maintained
- [ ] `devToolsMiddleware()` included
- [ ] Integration option chosen (replace, multi-provider, or endpoints)
- [ ] Code follows existing patterns
- [ ] No console.log or debugging statements left

**Testing (Step 4.5):**

- [ ] Server starts without errors
- [ ] No import errors or missing dependencies
- [ ] `/ai` endpoint responds to curl requests
- [ ] Streaming works correctly (token-by-token)
- [ ] Frontend chat interface works
- [ ] Browser console shows no errors
- [ ] Error handling tested with invalid inputs
- [ ] Unit tests created and passing
- [ ] Integration tests created and passing
- [ ] Manual testing completed with real conversations

**Deployment (Step 4.6):**

- [ ] Production environment variables configured
- [ ] Different API key used for production
- [ ] Application deployed successfully
- [ ] Production endpoint tested
- [ ] Monitoring and logging configured
- [ ] Error tracking set up
- [ ] Alerts configured for failures
- [ ] Cost monitoring set up
- [ ] Documentation updated

**Final Verification:**

- [ ] ✅ Integration works end-to-end
- [ ] ✅ No console errors in production
- [ ] ✅ Streaming performance acceptable
- [ ] ✅ Response quality meets expectations
- [ ] ✅ Frontend requires no changes (for Option A or B)
- [ ] ✅ Code follows project patterns
- [ ] ✅ Changes committed to git
- [ ] ✅ Commit message is descriptive
- [ ] ✅ Implementation plan updated (phase-3-task-3: completed)

**Example Commit Message:**

```
feat(ai): integrate OpenAI provider

Add OpenAI as a supported AI provider alongside Google Gemini.

Changes:
- Install @ai-sdk/openai package
- Add OPENAI_API_KEY environment variable
- Implement dynamic provider selection
- Update .env.example with OpenAI configuration
- Add integration tests for OpenAI endpoint

Testing:
- Manual testing with curl and frontend
- Unit tests for model creation
- Integration tests for /ai endpoint
- All tests passing

Refs: phase-3-task-3
```

---

### 4.8 Troubleshooting Common Integration Issues

Even with careful planning, issues can arise. Here are solutions to common problems:

**Issue: "Cannot find module '@ai-sdk/[provider]'"**

```bash
# Cause: Package not installed
# Solution:
cd apps/server
bun add @ai-sdk/[provider]

# Verify:
grep @ai-sdk/[provider] package.json
```

---

**Issue: "API key not found" or "API key invalid"**

```bash
# Cause 1: Environment variable not set
# Solution: Check variable exists
echo $OPENAI_API_KEY

# Cause 2: Wrong variable name
# Solution: Verify exact name in provider docs
# OPENAI_API_KEY (correct)
# OPENAI_KEY (wrong)

# Cause 3: Invalid or expired key
# Solution: Regenerate key in provider dashboard
```

---

**Issue: "Model not found" error**

```bash
# Cause: Incorrect model ID
# Solution: Verify model ID in provider documentation

# Example for OpenAI:
✅ gpt-4o-mini (correct)
❌ gpt-4-mini (incorrect)
❌ gpt4-mini (incorrect)

# Check provider docs for exact model IDs
```

---

**Issue: Streaming not working**

```bash
# Cause 1: Not using toUIMessageStreamResponse()
# Solution: Ensure correct return statement
return result.toUIMessageStreamResponse();

# Cause 2: CORS blocking
# Solution: Verify CORS configuration
app.use("/*", cors({ origin: env.CORS_ORIGIN }));

# Cause 3: Wrong content type
# Solution: Verify response is text/event-stream
```

---

**Issue: Very slow response times**

```bash
# Cause 1: Network latency
# Solution: Choose regionally close provider

# Cause 2: Rate limiting
# Solution: Check provider quota limits

# Cause 3: Model selection
# Solution: Use faster model (e.g., gpt-4o-mini instead of gpt-4o)
```

---

**Issue: Frontend not updating**

```bash
# Cause: Frontend cached old endpoint
# Solution: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

# If using Option C (separate endpoints):
# Cause: Frontend still pointing to old endpoint
# Solution: Update transport configuration
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: `${PUBLIC_SERVER_URL}/ai/openai`,  // Update this
  }),
});
```

---

**Issue: "Request too large" error**

```bash
# Cause: Exceeding provider's context window
# Solution: Implement message truncation or summarization

# Example: Limit conversation history
const recentMessages = messages.slice(-10);  // Keep last 10 messages
```

---

**Need More Help?**

- Check provider documentation
- Review AI SDK troubleshooting guide
- Search existing GitHub issues
- Ask for help in community forums

---

## Next Sections

> **Next:** [5. Provider-Specific Configurations](#5-provider-specific-configurations)
>
> This section provides detailed setup instructions for specific AI providers including OpenAI, Anthropic, Groq, Ollama, and others.

---

**Document Status:** 🚧 In Progress - Phase 3, Task 3 (Section 4 Complete)

**Last Updated:** 2025-01-12
**Contributors:** SambungChat Development Team
