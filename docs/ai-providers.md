# Supported AI Providers

**Version:** 1.0.0
**Last Updated:** January 19, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Provider Comparison](#provider-comparison)
3. [Anthropic (Claude)](#1-anthropic-claude)
4. [OpenAI](#2-openai)
5. [Google AI](#3-google-ai)
6. [Groq](#4-groq)
7. [Ollama](#5-ollama)
8. [Custom Providers](#6-custom-providers)
9. [Setup Instructions](#setup-instructions)
10. [Model Selection Guide](#model-selection-guide)

---

## Overview

SambungChat supports multiple AI providers, giving you the flexibility to choose the best model for your specific needs. All providers support streaming responses, chat history management, and encrypted API key storage.

### Key Features

- ✅ **Multi-Provider Support** - Switch between providers seamlessly
- ✅ **Streaming Responses** - Real-time token delivery for all providers
- ✅ **Encrypted Storage** - API keys stored securely
- ✅ **Model Selection** - Choose from multiple models per provider
- ✅ **Fallback Support** - Configure backup providers
- ✅ **Error Handling** - Clear, actionable error messages

---

## Provider Comparison

| Provider      | Models                           | Context Window | Speed    | Best For                           | Cost             |
| ------------- | -------------------------------- | -------------- | -------- | ---------------------------------- | ---------------- |
| **Anthropic** | Claude 3.5 Sonnet, Opus, Haiku   | Up to 200K     | ⚡️⚡️⚡️   | Complex reasoning, coding, writing | 💰💰💰 (Premium) |
| **OpenAI**    | GPT-4o, GPT-4 Turbo, GPT-3.5     | Up to 128K     | ⚡️⚡️⚡️   | General purpose, coding            | 💰💰💰 (Premium) |
| **Google**    | Gemini 1.5 Pro, Gemini 1.5 Flash | Up to 1M       | ⚡️⚡️     | Long context, multimodal           | 💰💰 (Moderate)  |
| **Groq**      | Llama 3, Mixtral, Gemma          | Up to 8K       | ⚡️⚡️⚡️⚡️ | Fast inference                     | 💰 (Low)         |
| **Ollama**    | Llama 3, Mistral, open-source    | Varies         | ⚡️⚡️⚡️   | Privacy, local execution           | Free (self-host) |

**Legend:**

- ⚡️ Speed: More bolts = faster response time
- 💰 Cost: More bags = higher cost per token

---

## 1. Anthropic (Claude)

### Overview

Anthropic's Claude models are known for their strong performance in complex reasoning, coding, and writing tasks. Claude excels at following instructions, maintaining context, and producing nuanced, well-structured responses.

### Available Models

| Model ID                     | Name              | Max Tokens | Context Window | Best For                        |
| ---------------------------- | ----------------- | ---------- | -------------- | ------------------------------- |
| `claude-3-5-sonnet-20241022` | Claude 3.5 Sonnet | 8,192      | 200,000        | Coding, analysis, general tasks |
| `claude-3-5-haiku-20241022`  | Claude 3.5 Haiku  | 8,192      | 200,000        | Fast responses, simple tasks    |
| `claude-3-opus-20240229`     | Claude 3 Opus     | 4,096      | 200,000        | Complex reasoning, writing      |
| `claude-3-sonnet-20240229`   | Claude 3 Sonnet   | 4,096      | 200,000        | Balanced performance            |
| `claude-3-haiku-20240307`    | Claude 3 Haiku    | 4,096      | 200,000        | Speed, cost-effective           |

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_VERSION=2023-06-01
```

### Setup Instructions

1. **Get an API Key**
   - Go to [console.anthropic.com](https://console.anthropic.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

2. **Configure in SambungChat**
   - **Option A:** Add to `apps/server/.env`:
     ```bash
     ANTHROPIC_API_KEY=sk-ant-your-key-here
     ```
   - **Option B:** Use UI Settings:
     - Go to Settings → API Keys
     - Click "Add Key"
     - Select "Anthropic"
     - Paste your API key
     - Click "Save"

3. **Select a Model**
   - Start a new chat
   - Click the model selector dropdown
   - Choose a Claude model (e.g., "Claude 3.5 Sonnet")

### Strengths

- ✅ Excellent at complex reasoning and analysis
- ✅ Strong coding capabilities with detailed explanations
- ✅ Maintains context well over long conversations
- ✅ Produces nuanced, well-structured content
- ✅ Large context window (200K tokens)

### Limitations

- ⚠️ Premium pricing (higher cost per token)
- ⚠️ Rate limits on API usage
- ⚠️ No multimodal capabilities (yet)

### Best Practices

- Use **Claude 3.5 Sonnet** for most tasks (best balance)
- Use **Claude 3.5 Haiku** for quick, simple requests
- Use **Claude 3 Opus** for complex, multi-step reasoning
- Set appropriate `max_tokens` to manage costs

---

## 2. OpenAI

### Overview

OpenAI's GPT models are versatile and widely adopted, offering strong performance across a broad range of tasks including coding, writing, and general assistance.

### Available Models

| Model ID        | Name          | Max Tokens | Context Window | Best For             |
| --------------- | ------------- | ---------- | -------------- | -------------------- |
| `gpt-4o`        | GPT-4o        | 4,096      | 128,000        | Multimodal tasks     |
| `gpt-4-turbo`   | GPT-4 Turbo   | 4,096      | 128,000        | Complex tasks        |
| `gpt-3.5-turbo` | GPT-3.5 Turbo | 4,096      | 16,385         | Fast, cost-effective |

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional
OPENAI_MODEL=gpt-4-turbo
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Setup Instructions

1. **Get an API Key**
   - Go to [platform.openai.com](https://platform.openai.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new secret key

2. **Configure in SambungChat**
   - Add to `apps/server/.env`:
     ```bash
     OPENAI_API_KEY=sk-your-key-here
     ```
   - Or use UI Settings → API Keys → Add Key → OpenAI

3. **Select a Model**
   - Start a new chat
   - Choose a GPT model from the dropdown

### Strengths

- ✅ Widely adopted and well-documented
- ✅ Strong general-purpose performance
- ✅ GPT-4o supports vision/images
- ✅ Good balance of speed and quality

### Limitations

- ⚠️ Premium pricing for GPT-4 models
- ⚠️ Rate limits on free tier
- ⚠️ Smaller context window than Claude

---

## 3. Google AI

### Overview

Google's Gemini models offer excellent performance with a massive 1 million token context window, making them ideal for analyzing large documents and codebases.

### Available Models

| Model ID           | Name             | Max Tokens | Context Window | Best For               |
| ------------------ | ---------------- | ---------- | -------------- | ---------------------- |
| `gemini-1.5-pro`   | Gemini 1.5 Pro   | 8,192      | 1,000,000      | Long context, analysis |
| `gemini-1.5-flash` | Gemini 1.5 Flash | 8,192      | 1,000,000      | Fast, large documents  |
| `gemini-pro`       | Gemini Pro       | 4,096      | 1,000,000      | General tasks          |
| `gemini-flash`     | Gemini Flash     | 4,096      | 1,000,000      | Quick responses        |

### Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key-here

# Optional
GOOGLE_MODEL=gemini-1.5-pro
GOOGLE_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### Setup Instructions

1. **Get an API Key**
   - Go to [makersuite.google.com](https://makersuite.google.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

2. **Configure in SambungChat**
   - Add to `apps/server/.env`:
     ```bash
     GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
     ```
   - Or use UI Settings → API Keys → Add Key → Google

### Strengths

- ✅ Massive context window (1M tokens)
- ✅ Good for analyzing large codebases
- ✅ Competitive pricing
- ✅ Strong multilingual support

### Limitations

- ⚠️ Less mature than OpenAI/Anthropic
- ⚠️ May have inconsistent output quality

---

## 4. Groq

### Overview

Groq provides extremely fast inference for open-source models like Llama 3 and Mixtral, making it ideal for applications that require rapid responses.

### Available Models

| Model ID             | Name         | Max Tokens | Context Window | Best For             |
| -------------------- | ------------ | ---------- | -------------- | -------------------- |
| `llama-3-70b-8192`   | Llama 3 70B  | 8,192      | 8,192          | Fast, high-quality   |
| `llama-3-8b-8192`    | Llama 3 8B   | 8,192      | 8,192          | Very fast, efficient |
| `mixtral-8x7b-32768` | Mixtral 8x7B | 8,192      | 32,768         | Fast inference       |
| `gemma-7b-it`        | Gemma 7B     | 8,192      | 8,192          | Lightweight tasks    |

### Environment Variables

```bash
# Required
GROQ_API_KEY=gsk_your-key-here

# Optional
GROQ_MODEL=llama-3-70b-8192
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### Setup Instructions

1. **Get an API Key**
   - Go to [console.groq.com](https://console.groq.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

2. **Configure in SambungChat**
   - Add to `apps/server/.env`:
     ```bash
     GROQ_API_KEY=gsk_your-key-here
     ```
   - Or use UI Settings → API Keys → Add Key → Groq

### Strengths

- ✅ Extremely fast inference
- ✅ Low cost per token
- ✅ Open-source models
- ✅ Good for simple tasks

### Limitations

- ⚠️ Smaller context window
- ⚠️ Less capable than GPT-4/Claude
- ⚠️ May struggle with complex reasoning

---

## 5. Ollama

### Overview

Ollama allows you to run open-source models locally, providing complete privacy and control over your data. Ideal for sensitive information and offline use.

### Available Models

| Model ID    | Name      | Max Tokens | Context Window | Best For                 |
| ----------- | --------- | ---------- | -------------- | ------------------------ |
| `llama3`    | Llama 3   | 4,096      | Varies         | Privacy, local execution |
| `mistral`   | Mistral   | 4,096      | Varies         | Privacy, local execution |
| `gemma`     | Gemma     | 4,096      | Varies         | Privacy, local execution |
| `codellama` | CodeLlama | 4,096      | Varies         | Coding, privacy          |
| `phi3`      | Phi 3     | 4,096      | Varies         | Lightweight, privacy     |

### Environment Variables

```bash
# Required
OLLAMA_BASE_URL=http://localhost:11434

# Optional - if using Ollama API authentication
OLLAMA_API_KEY=your-optional-key-here
```

### Setup Instructions

1. **Install Ollama**

   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh

   # Or download from ollama.com
   ```

2. **Pull a Model**

   ```bash
   ollama pull llama3
   ollama pull mistral
   ```

3. **Start Ollama Server**

   ```bash
   ollama serve
   ```

4. **Configure in SambungChat**
   - Add to `apps/server/.env`:
     ```bash
     OLLAMA_BASE_URL=http://localhost:11434
     ```
   - Or use UI Settings → API Keys → Add Key → Ollama

### Strengths

- ✅ Complete privacy and control
- ✅ No API costs
- ✅ Works offline
- ✅ Run on your own hardware

### Limitations

- ⚠️ Requires local compute resources
- ⚠️ Slower than cloud providers
- ⚠️ Manual model management
- ⚠️ Less capable than cloud models

---

## 6. Custom Providers

### Overview

SambungChat supports any OpenAI-compatible API endpoint, allowing you to integrate custom or third-party providers.

### Setup Instructions

1. **Configure Custom Provider**
   - Go to Settings → API Keys
   - Click "Add Key"
   - Select "Custom"
   - Enter your provider details:
     - **Name**: e.g., "Azure OpenAI"
     - **Base URL**: e.g., `https://your-resource.openai.azure.com/`
     - **API Key**: Your provider's API key
     - **Model ID**: e.g., `gpt-4`

2. **Use in Chat**
   - Start a new chat
   - Select your custom provider from the dropdown

### Use Cases

- Azure OpenAI for enterprise
- AWS Bedrock for cloud integration
- Custom model deployments
- Local inference servers
- Proxy services

---

## Setup Instructions

### Option A: Environment Variables (Recommended for Self-Hosting)

Edit `apps/server/.env`:

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Google
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here

# Groq
GROQ_API_KEY=gsk_your-key-here

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
```

**Pros:**

- ✅ Configured for all users
- ✅ Available immediately after setup
- ✅ Good for single-user or team deployments

**Cons:**

- ⚠️ Keys visible in server config
- ⚠️ Requires server restart to update
- ⚠️ All users share same credentials

### Option B: UI Settings (Recommended for Multi-User)

Each user configures their own API keys:

1. Go to **Settings** → **API Keys**
2. Click **Add Key**
3. Select provider and enter credentials
4. Click **Save**

**Pros:**

- ✅ Each user has their own keys
- ✅ Encrypted storage
- ✅ No server restart needed
- ✅ Users can rotate keys anytime

**Cons:**

- ⚠️ Each user must configure
- ⚠️ Requires setup per user

---

## Model Selection Guide

### By Use Case

| Use Case                   | Recommended Model                | Reason                                      |
| -------------------------- | -------------------------------- | ------------------------------------------- |
| **General Assistance**     | Claude 3.5 Sonnet, GPT-4o        | Best balance of capability and speed        |
| **Coding & Debugging**     | Claude 3.5 Sonnet, Claude 3 Opus | Excellent at code analysis and generation   |
| **Complex Reasoning**      | Claude 3 Opus, GPT-4 Turbo       | Strongest reasoning capabilities            |
| **Quick Responses**        | Claude 3.5 Haiku, GPT-3.5 Turbo  | Fast and cost-effective                     |
| **Long Documents**         | Gemini 1.5 Pro                   | 1M token context window                     |
| **Privacy/Sensitive Data** | Ollama (Llama 3)                 | Local execution, no data leaves your system |
| **Cost Optimization**      | Groq (Llama 3 8B)                | Lowest cost per token                       |
| **Multimodal (Images)**    | GPT-4o                           | Vision capabilities                         |

### By Performance

| Priority          | Model Choice                                         |
| ----------------- | ---------------------------------------------------- |
| **Quality First** | Claude 3 Opus > GPT-4o > Claude 3.5 Sonnet           |
| **Speed First**   | Claude 3.5 Haiku > Groq (Llama 3 8B) > GPT-3.5 Turbo |
| **Cost First**    | Ollama (free) > Groq (low) > Gemini (moderate)       |
| **Balance**       | Claude 3.5 Sonnet (recommended)                      |

### Context Window Needs

| Content Size            | Recommended Provider                   |
| ----------------------- | -------------------------------------- |
| **Small (<10K tokens)** | Any provider (Groq, OpenAI, Anthropic) |
| **Medium (10K-50K)**    | OpenAI, Anthropic                      |
| **Large (50K-200K)**    | Anthropic (Claude)                     |
| **Very Large (>200K)**  | Google (Gemini 1.5 Pro with 1M tokens) |

---

## Troubleshooting

### Common Issues

**Problem**: "Invalid API key" error

- **Solution**: Verify your API key is correct and has no extra spaces
- **Check**: Environment variables or UI Settings

**Problem**: "Rate limit exceeded"

- **Solution**: Wait a few minutes and try again, or upgrade your API plan
- **Prevention**: Use faster models (Haiku, GPT-3.5) for simple tasks

**Problem**: "Model not found"

- **Solution**: Verify the model ID is correct (see tables above)
- **Check**: Case-sensitive spelling (e.g., `claude-3-5-sonnet-20241022`)

**Problem**: "Connection timeout" (Ollama)

- **Solution**: Ensure Ollama is running: `ollama serve`
- **Check**: OLLAMA_BASE_URL is correct (default: `http://localhost:11434`)

**Problem**: Streaming not working

- **Solution**: Check network connection and firewall settings
- **Verify**: API key has streaming permissions

---

## Additional Resources

- [Getting Started Guide](./getting-started.md)
- [AI Provider Integration Guide](./ai-provider-integration-guide.md)
- [Environment Variables Reference](./ENVIRONMENT.md)
- [API Reference](./api-reference.md)

---

## Changelog

| Version | Date       | Changes                                                   |
| ------- | ---------- | --------------------------------------------------------- |
| 1.0.0   | 2026-01-19 | Initial documentation with Anthropic provider integration |

---

**"Sambung: Connect any AI model. Self-hosted. Privacy-first. Open-source forever."**
