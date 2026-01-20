/**
 * Provider Factory
 *
 * Centralized provider management for multi-provider AI support.
 * This module provides a unified interface for working with different AI providers.
 *
 * Supported providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - Google (Gemini)
 * - Groq (Llama)
 * - Ollama (local models)
 * - Custom (OpenAI-compatible)
 *
 * @example
 * ```ts
 * import { createProvider } from '@sambung-chat/api/lib/providers';
 *
 * const model = createProvider({
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * ```
 */

import type { LanguageModel } from 'ai';

import { createOpenAIModel, getOpenAIProviderInfo, createOpenAIProvider } from './openai';
import type { ProviderConfig, ProviderResult, ProviderInfo, AIProvider } from './types';

/**
 * Create a language model from any supported provider
 *
 * This is the main factory function that abstracts provider creation.
 * Just pass the provider configuration and get back a ready-to-use model.
 *
 * @param config - Provider configuration
 * @returns Language model instance
 * @throws {Error} If provider is not supported or configuration is invalid
 *
 * @example
 * ```ts
 * const model = createProvider({
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   apiKey: 'sk-...',
 * });
 * ```
 */
export function createProvider(config: ProviderConfig): LanguageModel {
  switch (config.provider) {
    case 'openai':
      return createOpenAIModel(config);

    // TODO: Add other providers in subsequent subtasks
    // case 'anthropic':
    //   return createAnthropicModel(config);
    //
    // case 'google':
    //   return createGoogleModel(config);
    //
    // case 'groq':
    //   return createGroqModel(config);
    //
    // case 'ollama':
    //   return createOllamaModel(config);
    //
    // case 'custom':
    //   return createCustomModel(config);

    default:
      throw new Error(
        `Unsupported provider: ${config.provider}. Supported providers: openai, anthropic, google, groq, ollama, custom`
      );
  }
}

/**
 * Create a provider with full result (model + info)
 *
 * Returns both the model instance and provider metadata.
 * Useful when you need provider information alongside the model.
 *
 * @param config - Provider configuration
 * @returns Provider result with model and info
 *
 * @example
 * ```ts
 * const { model, info } = createProviderWithInfo({
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   apiKey: 'sk-...',
 * });
 *
 * console.log(`Using ${info.provider} with model ${info.model}`);
 * ```
 */
export function createProviderWithInfo(config: ProviderConfig): ProviderResult {
  switch (config.provider) {
    case 'openai':
      return createOpenAIProvider(config);

    // TODO: Add other providers in subsequent subtasks
    // case 'anthropic':
    //   return createAnthropicProvider(config);
    //
    // case 'google':
    //   return createGoogleProvider(config);
    //
    // case 'groq':
    //   return createGroqProvider(config);
    //
    // case 'ollama':
    //   return createOllamaProvider(config);
    //
    // case 'custom':
    //   return createCustomProvider(config);

    default:
      throw new Error(
        `Unsupported provider: ${config.provider}. Supported providers: openai, anthropic, google, groq, ollama, custom`
      );
  }
}

/**
 * Get provider information without creating a model
 *
 * Useful for health checks, metadata endpoints, and provider validation.
 *
 * @param config - Provider configuration
 * @returns Provider information
 *
 * @example
 * ```ts
 * const info = getProviderInfo({
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   apiKey: 'sk-...',
 * });
 *
 * if (!info.configured) {
 *   console.error('Provider not configured');
 * }
 * ```
 */
export function getProviderInfo(config: ProviderConfig): ProviderInfo {
  switch (config.provider) {
    case 'openai':
      return getOpenAIProviderInfo(config);

    // TODO: Add other providers in subsequent subtasks
    // case 'anthropic':
    //   return getAnthropicProviderInfo(config);
    //
    // case 'google':
    //   return getGoogleProviderInfo(config);
    //
    // case 'groq':
    //   return getGroqProviderInfo(config);
    //
    // case 'ollama':
    //   return getOllamaProviderInfo(config);
    //
    // case 'custom':
    //   return getCustomProviderInfo(config);

    default:
      return {
        provider: config.provider,
        model: config.model || 'unknown',
        configured: false,
      };
  }
}

/**
 * Get the default model ID for a provider
 *
 * @param provider - Provider name
 * @returns Default model ID
 */
export function getDefaultModel(provider: AIProvider): string {
  const defaults: Record<AIProvider, string> = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-5-sonnet-20241022',
    google: 'gemini-2.5-flash',
    groq: 'llama-3.3-70b-versatile',
    ollama: 'llama3.2',
    custom: 'custom-model',
  };

  return defaults[provider] || 'gpt-4o-mini';
}

/**
 * Validate that a provider is properly configured
 *
 * @param config - Provider configuration
 * @returns True if provider is configured
 */
export function isProviderConfigured(config: ProviderConfig): boolean {
  const info = getProviderInfo(config);
  return info.configured;
}

// Re-export types and OpenAI-specific functions
export * from './types';
export * from './openai';
