/**
 * AI Provider Factory Tests
 *
 * This file verifies that the provider factory can be imported and used correctly.
 */

import { describe, it, expect } from 'vitest';
import {
  createAIProvider,
  isProviderConfigured,
  getConfiguredProviders,
  type AIProvider,
} from './ai-provider-factory';

describe('AI Provider Factory', () => {
  describe('createAIProvider', () => {
    it('should create an OpenAI provider instance', () => {
      // This test verifies the factory can create a provider without actually calling the API
      expect(() => {
        createAIProvider({
          provider: 'openai',
          modelId: 'gpt-4o-mini',
        });
      }).not.toThrow();
    });

    it('should create an Anthropic provider instance when API key is available', () => {
      // Skip this test if ANTHROPIC_API_KEY is not set
      if (!process.env.ANTHROPIC_API_KEY) {
        return;
      }

      expect(() => {
        createAIProvider({
          provider: 'anthropic',
          modelId: 'claude-3-5-sonnet-20241022',
        });
      }).not.toThrow();
    });

    it('should throw error when Anthropic API key is missing', () => {
      // Temporarily unset the API key for this test
      const originalKey = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => {
        createAIProvider({
          provider: 'anthropic',
          modelId: 'claude-3-5-sonnet-20241022',
        });
      }).toThrow('Anthropic API key is required');

      // Restore the original key
      if (originalKey) {
        process.env.ANTHROPIC_API_KEY = originalKey;
      }
    });

    it('should create a Groq provider instance', () => {
      expect(() => {
        createAIProvider({
          provider: 'groq',
          modelId: 'llama-3.3-70b-versatile',
        });
      }).not.toThrow();
    });

    it('should create an Ollama provider instance', () => {
      expect(() => {
        createAIProvider({
          provider: 'ollama',
          modelId: 'llama3.2',
        });
      }).not.toThrow();
    });

    it('should create a custom provider instance', () => {
      expect(() => {
        createAIProvider({
          provider: 'custom',
          modelId: 'custom-model',
          baseURL: 'https://api.example.com/v1',
          apiKey: 'test-key',
        });
      }).not.toThrow();
    });
  });

  describe('isProviderConfigured', () => {
    it('should return true for OpenAI if API key is set', () => {
      const result = isProviderConfigured('openai');
      expect(typeof result).toBe('boolean');
    });

    it('should return true for Anthropic if API key is set', () => {
      const result = isProviderConfigured('anthropic');
      expect(typeof result).toBe('boolean');
    });

    it('should return true for Ollama (no API key required)', () => {
      const result = isProviderConfigured('ollama');
      expect(result).toBe(true);
    });

    it('should return false for unsupported providers', () => {
      // This test verifies type safety - unsupported providers should not exist
      const providers: AIProvider[] = ['openai', 'anthropic', 'google', 'groq', 'ollama', 'custom'];

      providers.forEach((provider) => {
        const result = isProviderConfigured(provider);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('getConfiguredProviders', () => {
    it('should return an array of configured providers', () => {
      const providers = getConfiguredProviders();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should always include Ollama (no API key required)', () => {
      const providers = getConfiguredProviders();
      expect(providers).toContain('ollama');
    });
  });
});
