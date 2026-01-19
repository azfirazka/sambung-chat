/**
 * OpenAI Provider Configuration
 *
 * This module handles OpenAI provider setup using the AI SDK v6.
 * It provides type-safe configuration and initialization for OpenAI models.
 *
 * Supported models:
 * - gpt-4o-mini: Fast, cost-effective for most tasks
 * - gpt-4o: Multimodal, high-performance reasoning
 * - o1-mini: Optimized for code, math, and logic
 * - o1-preview: Advanced problem-solving and reasoning
 *
 * @see https://platform.openai.com/docs/models
 */

import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

import type { ProviderConfig, ProviderResult, ProviderInfo } from './types';

/**
 * Default OpenAI models
 */
export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

/**
 * Available OpenAI models with metadata
 */
export const OPENAI_MODELS = {
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    contextWindow: 128000,
    bestFor: 'General chat, fast responses',
    cost: 'Low',
    supported: true,
  },
  'gpt-4o': {
    name: 'GPT-4o',
    contextWindow: 128000,
    bestFor: 'Complex reasoning, vision, multimodal',
    cost: 'Medium',
    supported: true,
  },
  'o1-mini': {
    name: 'o1-mini',
    contextWindow: 128000,
    bestFor: 'Code, math, logic',
    cost: 'Medium',
    supported: true,
  },
  'o1-preview': {
    name: 'o1-preview',
    contextWindow: 128000,
    bestFor: 'Complex problem-solving',
    cost: 'High',
    supported: true,
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    contextWindow: 128000,
    bestFor: 'Legacy GPT-4 tasks',
    cost: 'Medium',
    supported: true,
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    contextWindow: 16385,
    bestFor: 'Simple tasks, legacy support',
    cost: 'Low',
    supported: true,
  },
} as const;

/**
 * OpenAI model IDs
 */
export type OpenAIModelId = keyof typeof OPENAI_MODELS;

/**
 * Validate OpenAI configuration
 *
 * @throws {Error} If API key is missing
 */
export function validateOpenAIConfig(config: ProviderConfig): void {
  if (!config.apiKey) {
    throw new Error('OPENAI_API_KEY is required for OpenAI provider');
  }

  if (!config.model) {
    throw new Error('Model ID is required for OpenAI provider');
  }
}

/**
 * Create an OpenAI language model instance
 *
 * This function creates a configured OpenAI model using the AI SDK.
 *
 * @param config - Provider configuration
 * @returns Language model instance
 *
 * @example
 * ```ts
 * const model = createOpenAIModel({
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * ```
 */
export function createOpenAIModel(config: ProviderConfig): LanguageModel {
  validateOpenAIConfig(config);

  // Create and return the OpenAI model instance
  // Note: For custom baseURL or organization, you need to use createOpenAI() client factory
  // For now, we use the default client which reads from environment variables
  const model = openai(config.model as any);

  return model as unknown as LanguageModel;
}

/**
 * Create OpenAI provider with full result
 *
 * Returns both the model instance and provider metadata.
 *
 * @param config - Provider configuration
 * @returns Provider result with model and info
 */
export function createOpenAIProvider(config: ProviderConfig): ProviderResult {
  validateOpenAIConfig(config);

  const model = createOpenAIModel(config);
  const modelInfo = OPENAI_MODELS[config.model as OpenAIModelId];

  const info: ProviderInfo = {
    provider: 'openai',
    model: config.model,
    configured: true,
    baseURL: config.baseURL,
    contextWindow: modelInfo?.contextWindow,
  };

  return { model, info };
}

/**
 * Get OpenAI provider info without creating model
 *
 * Useful for health checks and metadata endpoints.
 *
 * @param config - Provider configuration
 * @returns Provider information
 */
export function getOpenAIProviderInfo(config: ProviderConfig): ProviderInfo {
  const modelInfo = OPENAI_MODELS[config.model as OpenAIModelId];

  return {
    provider: 'openai',
    model: config.model || DEFAULT_OPENAI_MODEL,
    configured: !!config.apiKey,
    baseURL: config.baseURL,
    contextWindow: modelInfo?.contextWindow,
  };
}

/**
 * List all available OpenAI models
 *
 * @returns Array of available models with metadata
 */
export function listOpenAIModels(): Array<{
  id: string;
  name: string;
  contextWindow: number;
  bestFor: string;
  cost: string;
}> {
  return Object.entries(OPENAI_MODELS).map(([id, info]) => ({
    id,
    name: info.name,
    contextWindow: info.contextWindow,
    bestFor: info.bestFor,
    cost: info.cost,
  }));
}
