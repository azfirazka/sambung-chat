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

## Next Sections

> **Next:** [2. Understanding the AI SDK Architecture](#2-understanding-the-ai-sdk-architecture)
>
> This section provides a deep dive into the AI SDK's core concepts, architecture, and how it achieves provider-agnostic integration.

---

**Document Status:** 🚧 In Progress - Phase 3, Task 1 (Introduction Section Complete)

**Last Updated:** 2025-01-11
**Contributors:** SambungChat Development Team
