/**
 * Anthropic Streaming Verification Tests
 *
 * This test suite verifies that streaming responses work correctly with Claude models.
 * Tests cover:
 * - Real-time token delivery (no buffer batching)
 * - Proper stream closure on completion
 * - Graceful error handling
 *
 * NOTE: These tests require ANTHROPIC_API_KEY to be set in environment variables.
 * Run with: ANTHROPIC_API_KEY=sk-ant-... bun test tests/unit/anthropic-streaming.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { streamText } from 'ai';
import { createAIProvider } from '@sambung-chat/api/lib/ai-provider-factory';
import { convertToModelMessages } from 'ai';

// Skip all tests if API key is not available
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const hasApiKey = !!ANTHROPIC_API_KEY;

describe.skipIf(!hasApiKey)('Anthropic Streaming', () => {
	describe('Real-time Token Delivery', () => {
		it('should deliver tokens in real-time without batching', async () => {
			// Arrange
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-3-5-haiku-20241022', // Use fastest model for testing
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'Count from 1 to 10, one number per line.',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
				maxTokens: 100,
			});

			// Track token arrival times
			const tokenTimes: number[] = [];
			const startTime = Date.now();

			const stream = result.toDataStream();
			const reader = stream.getReader();

			// Assert - Collect timing data for each chunk
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				// Record time when each chunk arrives
				tokenTimes.push(Date.now() - startTime);
			}

			// Verify tokens arrived in multiple chunks (not all at once)
			expect(tokenTimes.length).toBeGreaterThan(1);

			// Verify there were gaps between chunks (real-time streaming)
			// If all chunks arrived at the same time, it would indicate batching
			const uniqueTimes = new Set(tokenTimes);
			expect(uniqueTimes.size).toBeGreaterThan(1);

			// Verify first chunk arrived quickly (< 2 seconds)
			expect(tokenTimes[0]!).toBeLessThan(2000);
		});

		it('should handle streaming with longer responses', async () => {
			// Arrange
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-3-5-haiku-20241022',
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'Write a short poem about artificial intelligence (5 lines).',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
				maxTokens: 200,
			});

			// Track chunks
			let chunkCount = 0;
			const stream = result.toDataStream();
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunkCount++;
			}

			// Assert - Should receive multiple chunks for a 5-line poem
			expect(chunkCount).toBeGreaterThan(3);
		});
	});

	describe('Stream Closure', () => {
		it('should properly close stream on completion', async () => {
			// Arrange
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-3-5-haiku-20241022',
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'Say "Hello, World!" and nothing else.',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
				maxTokens: 50,
			});

			const stream = result.toDataStream();
			const reader = stream.getReader();

			let finalChunk = false;
			let chunkCount = 0;

			// Read all chunks
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					finalChunk = true;
					break;
				}
				chunkCount++;
			}

			// Assert - Stream should properly signal completion
			expect(finalChunk).toBe(true);
			expect(chunkCount).toBeGreaterThan(0);

			// Verify reader is closed
			const closedRead = await reader.read();
			expect(closedRead.done).toBe(true);
		});

		it('should include finish metadata in stream', async () => {
			// Arrange
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-3-5-haiku-20241022',
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'What is 2 + 2?',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
				maxTokens: 50,
			});

			// Use onFinish callback to verify completion metadata
			let finishReason: string | undefined;
			let usage: any;

			result.onFinish?.((event) => {
				finishReason = event.finishReason;
				usage = event.usage;
			});

			const stream = result.toDataStream();
			const reader = stream.getReader();

			// Consume stream
			while (true) {
				const { done } = await reader.read();
				if (done) break;
			}

			// Assert - Should have finish reason and usage data
			// Note: onFinish is called asynchronously, so we need to wait
			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(finishReason).toBeDefined();
			expect(['stop', 'length', 'content-filter']).toContain(finishReason);
			expect(usage).toBeDefined();
			expect(usage.totalTokens).toBeGreaterThan(0);
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid API key gracefully', async () => {
			// Arrange - Temporarily override API key with invalid one
			const originalKey = process.env.ANTHROPIC_API_KEY;
			process.env.ANTHROPIC_API_KEY = 'sk-ant-invalid-key';

			try {
				const model = createAIProvider({
					provider: 'anthropic',
					modelId: 'claude-3-5-haiku-20241022',
				});

				const messages = convertToModelMessages([
					{
						role: 'user',
						content: 'Hello',
					},
				]);

				// Act
				const result = streamText({
					model,
					messages,
				});

				const stream = result.toDataStream();
				const reader = stream.getReader();

				let errorThrown = false;
				let errorMessage = '';

				// Assert
				try {
					while (true) {
						const { done } = await reader.read();
						if (done) break;
					}
				} catch (error) {
					errorThrown = true;
					errorMessage = error instanceof Error ? error.message : String(error);
				}

				expect(errorThrown).toBe(true);
				expect(errorMessage.toLowerCase()).toMatch(/authentication|unauthorized|401|403/);
			} finally {
				// Restore original key
				if (originalKey) {
					process.env.ANTHROPIC_API_KEY = originalKey;
				} else {
					delete process.env.ANTHROPIC_API_KEY;
				}
			}
		});

		it('should handle model not found error', async () => {
			// Arrange - Use non-existent model
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-nonexistent-model',
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'Hello',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
			});

			const stream = result.toDataStream();
			const reader = stream.getReader();

			let errorThrown = false;
			let errorMessage = '';

			// Assert
			try {
				while (true) {
					const { done } = await reader.read();
					if (done) break;
				}
			} catch (error) {
				errorThrown = true;
				errorMessage = error instanceof Error ? error.message : String(error);
			}

			expect(errorThrown).toBe(true);
			expect(errorMessage.toLowerCase()).toMatch(/404|not found|invalid model/);
		});
	});

	describe('UI Message Stream Format', () => {
		it('should produce UI message stream compatible response', async () => {
			// Arrange
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: 'claude-3-5-haiku-20241022',
			});

			const messages = convertToModelMessages([
				{
					role: 'user',
					content: 'Say "test"',
				},
			]);

			// Act
			const result = streamText({
				model,
				messages,
				maxTokens: 50,
			});

			// Get UI message stream response (used by frontend)
			const response = result.toUIMessageStreamResponse();

			// Assert - Verify response structure
			expect(response).toBeInstanceOf(Response);
			expect(response.headers.get('Content-Type')).toContain('text/plain');

			// Verify body is a readable stream
			expect(response.body).toBeInstanceOf(ReadableStream);

			// Verify we can read from the stream
			const reader = response.body.getReader();
			let chunkCount = 0;

			while (true) {
				const { done } = await reader.read();
				if (done) break;
				chunkCount++;
			}

			expect(chunkCount).toBeGreaterThan(0);
		});
	});
});

// Basic structural tests that run without API key
describe('Anthropic Streaming - Structural', () => {
	describe('Provider Factory', () => {
		it('should create Anthropic provider with correct structure', () => {
			// This test verifies the provider can be created (doesn't call API)
			expect(() => {
				createAIProvider({
					provider: 'anthropic',
					modelId: 'claude-3-5-sonnet-20241022',
					apiKey: 'test-key-dummy', // Dummy key for structure check
				});
			}).not.toThrow();
		});

		it('should accept all Anthropic model IDs', () => {
			const validModels = [
				'claude-3-5-sonnet-20241022',
				'claude-3-5-haiku-20241022',
				'claude-3-opus-20240229',
				'claude-3-sonnet-20240229',
				'claude-3-haiku-20240307',
			];

			validModels.forEach((modelId) => {
				expect(() => {
					createAIProvider({
						provider: 'anthropic',
						modelId,
						apiKey: 'test-key-dummy',
					});
				}).not.toThrow();
			});
		});
	});
});
