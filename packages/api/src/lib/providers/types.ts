/**
 * Provider Types and Interfaces
 *
 * Type definitions for AI provider configurations and models.
 * These types ensure type-safety when working with multiple AI providers.
 */

import type { LanguageModel } from 'ai';

/**
 * Supported AI providers
 */
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq' | 'ollama' | 'custom';

/**
 * Provider configuration interface
 */
export interface ProviderConfig {
  /** Provider name */
  provider: AIProvider;
  /** Model identifier (e.g., "gpt-4o-mini", "claude-3-5-sonnet-20241022") */
  model: string;
  /** API key for the provider (optional for local providers like Ollama) */
  apiKey?: string;
  /** Custom base URL (for proxies, Azure deployments, etc.) */
  baseURL?: string;
  /** Organization ID (OpenAI-specific) */
  organization?: string;
  /** Additional provider-specific settings */
  settings?: Record<string, unknown>;
}

/**
 * Model parameters for generation
 */
export interface ModelSettings {
  /** Temperature (0-2) - Controls randomness */
  temperature?: number;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Top-p sampling (0-1) */
  topP?: number;
  /** Top-k sampling (0-100) */
  topK?: number;
  /** Frequency penalty (-2 to 2) */
  frequencyPenalty?: number;
  /** Presence penalty (-2 to 2) */
  presencePenalty?: number;
}

/**
 * Provider info returned by metadata endpoints
 */
export interface ProviderInfo {
  provider: string;
  model: string;
  configured: boolean;
  baseURL?: string;
  contextWindow?: number;
}

/**
 * Result from provider initialization
 */
export interface ProviderResult {
  /** Wrapped language model ready for use with AI SDK */
  model: LanguageModel;
  /** Provider metadata */
  info: ProviderInfo;
}
