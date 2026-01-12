# SambungChat Documentation

Welcome to the SambungChat documentation! This hub provides comprehensive guides for integrating AI providers, extending functionality, and contributing to the project.

## 📚 Documentation Index

### 🤖 AI Provider Integration

**[AI Provider Integration Guide](./ai-provider-integration-guide.md)** - *Complete Guide*

The comprehensive guide for adding new AI providers to SambungChat. Covers everything from basic setup to advanced multi-provider patterns.

- **What's Inside:**
  - Step-by-step integration workflow
  - Provider-specific configurations (OpenAI, Anthropic, Google, Groq, Ollama)
  - Environment variable patterns and best practices
  - Testing procedures and validation
  - Troubleshooting common issues
  - Multi-provider setup and optimization

- **Who Should Read This:**
  - Contributors adding new AI providers
  - Developers extending AI functionality
  - DevOps engineers configuring AI environments

**📖 [Read the Guide →](./ai-provider-integration-guide.md)**

### 🚀 Quick Start Guides

#### OpenAI Integration
Get started with OpenAI's GPT models (GPT-4o, GPT-4o-mini, o1-series).

- **Example:** [examples/openai-integration/](../examples/openai-integration/)
- **Best For:** General-purpose AI, vision tasks, coding assistance
- **Cost:** Low-Medium
- **Speed:** Fast (~500ms to first token)

#### Anthropic Integration
Integrate Anthropic's Claude models with extended context windows.

- **Example:** [examples/anthropic-integration/](../examples/anthropic-integration/)
- **Best For:** Complex reasoning, long conversations, analysis
- **Cost:** Medium-High
- **Special Feature:** 200K token context window

#### Groq Integration
Ultra-fast inference with Groq's LPU acceleration.

- **Example:** [examples/groq-integration/](../examples/groq-integration/)
- **Best For:** Real-time responses, high-volume applications
- **Cost:** Very Low
- **Special Feature:** 10-20x faster than other providers (~50ms to first token)

#### Ollama Integration
100% local AI with zero API costs.

- **Example:** [examples/ollama-integration/](../examples/ollama-integration/)
- **Best For:** Privacy, offline use, cost optimization
- **Cost:** Free (local inference)
- **Special Feature:** 100+ models, complete data privacy

#### Multi-Provider Integration
Provider abstraction with fallback chains and zero-code switching.

- **Example:** [examples/multi-provider-integration/](../examples/multi-provider-integration/)
- **Best For:** Production reliability, cost optimization, flexibility
- **Features:** Automatic failover, load balancing, cost-based routing
- **Special Feature:** Switch providers via environment variables

### 🧪 Testing

**[Test Templates](../examples/test-templates/)**

Comprehensive test templates for validating AI provider integrations.

- **Unit Tests:** Provider initialization, model creation, validation
- **Integration Tests:** API endpoints, streaming responses
- **E2E Tests:** Complete user flows, UI interactions
- **Test Fixtures:** Reusable test data and mocks

**📖 [View Test Templates →](../examples/test-templates/README.md)**

## 🎯 Getting Started

### New to AI Provider Integration?

1. **Start Here:** Read the [AI Provider Integration Guide](./ai-provider-integration-guide.md)
2. **Pick a Provider:** Choose from OpenAI, Anthropic, Google, Groq, or Ollama
3. **Try an Example:** Run the corresponding example in the `examples/` directory
4. **Test Thoroughly:** Use the test templates to validate your integration

### Adding a New Provider?

Follow this workflow:

```
1. Research → Read Section 2 of the Integration Guide
2. Plan → Review the provider-specific examples
3. Implement → Follow the Step-by-Step Integration Guide
4. Test → Use test templates and follow testing procedures
5. Deploy → Follow production deployment checklist
```

**📖 [Complete Integration Guide →](./ai-provider-integration-guide.md)**

## 📋 Common Tasks

### Configure Environment Variables

**Quick Reference:**

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL_ID=gpt-4o-mini

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL_ID=claude-3-5-sonnet-20241022

# Google
GOOGLE_GENERATIVE_AI_API_KEY=...
GOOGLE_MODEL_ID=gemini-2.5-flash

# Groq
GROQ_API_KEY=gsk_...
GROQ_MODEL_ID=llama-3.3-70b-versatile

# Ollama (no API key needed)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL_ID=llama3.2
```

**📖 [Complete Environment Guide →](./ai-provider-integration-guide.md#6-environment-configuration)**

### Test Your Integration

**Manual Testing:**

```bash
# 1. Start the server
npm run dev

# 2. Check health
curl http://localhost:5173/health

# 3. Test chat endpoint
curl -X POST http://localhost:5173/api/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'
```

**Automated Testing:**

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**📖 [Complete Testing Guide →](./ai-provider-integration-guide.md#7-testing-and-validation)**

### Troubleshoot Issues

**Common Problems:**

| Issue | Solution |
|-------|----------|
| API key not recognized | Check environment variable name spelling |
| Model not found | Verify model ID is correct for the provider |
| Rate limiting (429) | Implement exponential backoff |
| Timeout errors | Increase timeout or reduce message length |
| Streaming broken | Check middleware configuration |

**📖 [Complete Troubleshooting →](./ai-provider-integration-guide.md#8-troubleshooting-and-common-issues)**

## 🆘 Need Help?

### Documentation

- **Integration Guide:** [ai-provider-integration-guide.md](./ai-provider-integration-guide.md)
- **Provider Examples:** [examples/](../examples/)
- **Test Templates:** [examples/test-templates/](../examples/test-templates/)

### Community

- **GitHub Issues:** Report bugs or request features
- **Pull Requests:** Contribute improvements or new providers
- **Discussions:** Ask questions and share knowledge

### Provider Resources

- **OpenAI:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Anthropic:** [docs.anthropic.com](https://docs.anthropic.com)
- **Google AI:** [ai.google.dev/docs](https://ai.google.dev/docs)
- **Groq:** [console.groq.com/docs](https://console.groq.com/docs)
- **Ollama:** [ollama.com/docs](https://ollama.com/docs)
- **AI SDK:** [sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)

## 📊 Provider Comparison

| Provider | Best For | Cost | Speed | Context | Local? |
|----------|----------|------|-------|---------|--------|
| **OpenAI** | General purpose, vision | 💰💰 | ⚡⚡⚡ | 128K | ❌ |
| **Anthropic** | Complex reasoning | 💰💰💰 | ⚡⚡⚡ | 200K | ❌ |
| **Google** | Multimodal, cost-effective | 💰 | ⚡⚡⚡ | 1M | ❌ |
| **Groq** | Ultra-fast responses | 💰 | ⚡⚡⚡⚡⚡ | 131K | ❌ |
| **Ollama** | Privacy, free | 💰 | ⚡⚡ | Varies | ✅ |

**Key:**
- 💰 = Cost (💰 = Very Low, 💰💰💰 = High)
- ⚡ = Speed (⚡ = Medium, ⚡⚡⚡⚡⚡ = Ultra-fast)
- Context = Maximum context window size

**📖 [Detailed Comparison →](./ai-provider-integration-guide.md#5-provider-specific-configurations)**

## 🔄 Quick Reference: Integration Pattern

All AI SDK providers follow this consistent pattern:

```typescript
// 1. Import provider
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

// 2. Create model (same pattern for all)
const model = provider("model-id", { apiKey });

// 3. Stream responses (same for all)
const result = streamText({
  model,
  messages: await convertToCoreMessages(messages),
});

// 4. Return stream (same for all)
return result.toUIMessageStreamResponse();
```

**Only the import and initialization changes - everything else stays the same!**

**📖 [Learn More →](./ai-provider-integration-guide.md#2-understanding-the-ai-sdk-architecture)**

## 📝 Documentation Standards

Our documentation follows these principles:

- ✅ **Comprehensive:** Covers all aspects from setup to deployment
- ✅ **Practical:** Includes real code examples from actual implementations
- ✅ **Tested:** All examples have been validated and tested
- ✅ **Current:** Kept up-to-date with the latest AI SDK versions
- ✅ **Clear:** Written for developers with clear, actionable steps

## 🎓 Learning Path

### Beginner
1. Read [AI Provider Integration Guide](./ai-provider-integration-guide.md) - Sections 1-4
2. Try the [OpenAI example](../examples/openai-integration/)
3. Run the test suite

### Intermediate
1. Complete the [Multi-Provider example](../examples/multi-provider-integration/)
2. Study [Environment Configuration](./ai-provider-integration-guide.md#6-environment-configuration)
3. Implement [Testing procedures](./ai-provider-integration-guide.md#7-testing-and-validation)

### Advanced
1. Explore [Advanced Topics](./ai-provider-integration-guide.md#9-advanced-topics)
2. Implement custom middleware
3. Optimize for cost and performance
4. Contribute new provider examples

---

**Last Updated:** 2025-01-12
**Documentation Version:** 1.0
**Maintained By:** SambungChat Team

---

**Looking for something specific?** Use the search function in your editor or browser to find keywords in this documentation.

**Need to add or update documentation?** Please refer to our contributing guidelines and submit a pull request.
