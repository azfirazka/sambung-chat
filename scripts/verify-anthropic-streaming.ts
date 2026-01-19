#!/usr/bin/env bun
/**
 * Anthropic Streaming Verification Script
 *
 * This script verifies that streaming responses work correctly with Claude models.
 * It performs manual verification of:
 * - Real-time token delivery
 * - Stream closure on completion
 * - Error handling
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... bun run scripts/verify-anthropic-streaming.ts
 *
 * Requirements:
 *   - Server must be running on http://localhost:3000
 *   - ANTHROPIC_API_KEY must be set in environment
 *   - User must be authenticated (session cookie)
 */

interface StreamVerificationOptions {
	serverUrl: string;
	apiKey: string;
	modelId?: string;
}

interface VerificationResult {
	success: boolean;
	test: string;
	message: string;
	details?: any;
	duration: number;
}

class AnthropicStreamingVerifier {
	private results: VerificationResult[] = [];

	async verifyAll(options: StreamVerificationOptions): Promise<void> {
		console.log('🔍 Starting Anthropic Streaming Verification\n');

		const startTime = Date.now();

		// Test 1: Provider Factory Structure
		await this.testProviderFactory(options);

		// Test 2: Real-time Token Delivery
		await this.testRealTimeStreaming(options);

		// Test 3: Stream Closure
		await this.testStreamClosure(options);

		// Test 4: Error Handling
		await this.testErrorHandling(options);

		// Print summary
		this.printSummary(Date.now() - startTime);
	}

	private async testProviderFactory(options: StreamVerificationOptions): Promise<void> {
		const testStart = Date.now();
		console.log('📋 Test 1: Provider Factory Structure');

		try {
			// Import dynamically to avoid loading if not needed
			const { createAIProvider } = await import('@sambung-chat/api/lib/ai-provider-factory');

			// Test creating provider with dummy key (structure check)
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: options.modelId || 'claude-3-5-haiku-20241022',
				apiKey: options.apiKey,
			});

			if (model) {
				this.results.push({
					success: true,
					test: 'Provider Factory',
					message: '✓ Provider factory creates Anthropic model correctly',
					duration: Date.now() - testStart,
				});
				console.log('   ✓ Provider factory creates Anthropic model correctly\n');
			} else {
				throw new Error('Provider factory returned undefined');
			}
		} catch (error) {
			this.results.push({
				success: false,
				test: 'Provider Factory',
				message: `✗ Failed to create provider: ${error instanceof Error ? error.message : String(error)}`,
				duration: Date.now() - testStart,
			});
			console.log(`   ✗ Failed: ${error}\n`);
		}
	}

	private async testRealTimeStreaming(options: StreamVerificationOptions): Promise<void> {
		const testStart = Date.now();
		console.log('📋 Test 2: Real-time Token Delivery');

		try {
			const { streamText } = await import('ai');
			const { createAIProvider } = await import('@sambung-chat/api/lib/ai-provider-factory');

			const model = createAIProvider({
				provider: 'anthropic',
				modelId: options.modelId || 'claude-3-5-haiku-20241022',
				apiKey: options.apiKey,
			});

			const messages = [
				{
					role: 'user' as const,
					content: 'Count from 1 to 5, one number per line. Be concise.',
				},
			];

			const result = streamText({
				model,
				messages,
				maxTokens: 100,
			});

			// Track token arrival times
			const tokenTimes: number[] = [];
			const startTime = Date.now();
			let totalTokens = 0;

			const stream = result.toDataStream();
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				tokenTimes.push(Date.now() - startTime);
				totalTokens++;
			}

			// Analyze results
			const uniqueTimes = new Set(tokenTimes);
			const hasRealTimeDelivery = uniqueTimes.size > 1;
			const firstChunkFast = tokenTimes[0] ? tokenTimes[0] < 3000 : false;

			if (hasRealTimeDelivery && firstChunkFast && totalTokens > 1) {
				this.results.push({
					success: true,
					test: 'Real-time Streaming',
					message: '✓ Tokens delivered in real-time without batching',
					details: {
						totalChunks: totalTokens,
						uniqueTimestamps: uniqueTimes.size,
						firstChunkDelay: tokenTimes[0],
					},
					duration: Date.now() - testStart,
				});
				console.log(`   ✓ Real-time delivery verified:`);
				console.log(`     - Total chunks: ${totalTokens}`);
				console.log(`     - Unique timestamps: ${uniqueTimes.size}`);
				console.log(`     - First chunk delay: ${tokenTimes[0]}ms\n`);
			} else {
				throw new Error(
					`Streaming not real-time: chunks=${totalTokens}, uniqueTimes=${uniqueTimes.size}, firstChunkFast=${firstChunkFast}`
				);
			}
		} catch (error) {
			this.results.push({
				success: false,
				test: 'Real-time Streaming',
				message: `✗ Real-time streaming failed: ${error instanceof Error ? error.message : String(error)}`,
				duration: Date.now() - testStart,
			});
			console.log(`   ✗ Failed: ${error}\n`);
		}
	}

	private async testStreamClosure(options: StreamVerificationOptions): Promise<void> {
		const testStart = Date.now();
		console.log('📋 Test 3: Stream Closure on Completion');

		try {
			const { streamText } = await import('ai');
			const { createAIProvider } = await import('@sambung-chat/api/lib/ai-provider-factory');

			const model = createAIProvider({
				provider: 'anthropic',
				modelId: options.modelId || 'claude-3-5-haiku-20241022',
				apiKey: options.apiKey,
			});

			const messages = [
				{
					role: 'user' as const,
					content: 'Say "Hello" and nothing else.',
				},
			];

			const result = streamText({
				model,
				messages,
				maxTokens: 50,
			});

			// Track finish metadata
			let finishReason: string | undefined;
			let usage: any;

			result.onFinish?.((event) => {
				finishReason = event.finishReason;
				usage = event.usage;
			});

			const stream = result.toDataStream();
			const reader = stream.getReader();

			let chunkCount = 0;
			let streamClosed = false;

			while (true) {
				const { done } = await reader.read();
				if (done) {
					streamClosed = true;
					break;
				}
				chunkCount++;
			}

			// Wait for onFinish callback
			await new Promise((resolve) => setTimeout(resolve, 200));

			const hasFinishReason = finishReason !== undefined;
			const hasUsage = usage && usage.totalTokens > 0;

			if (streamClosed && chunkCount > 0 && hasFinishReason && hasUsage) {
				this.results.push({
					success: true,
					test: 'Stream Closure',
					message: '✓ Stream properly closes with finish metadata',
					details: {
						chunkCount,
						finishReason,
						totalTokens: usage.totalTokens,
					},
					duration: Date.now() - testStart,
				});
				console.log(`   ✓ Stream closure verified:`);
				console.log(`     - Chunks received: ${chunkCount}`);
				console.log(`     - Finish reason: ${finishReason}`);
				console.log(`     - Total tokens: ${usage.totalTokens}\n`);
			} else {
				throw new Error(
					`Stream not properly closed: closed=${streamClosed}, chunks=${chunkCount}, finishReason=${hasFinishReason}, usage=${hasUsage}`
				);
			}
		} catch (error) {
			this.results.push({
				success: false,
				test: 'Stream Closure',
				message: `✗ Stream closure test failed: ${error instanceof Error ? error.message : String(error)}`,
				duration: Date.now() - testStart,
			});
			console.log(`   ✗ Failed: ${error}\n`);
		}
	}

	private async testErrorHandling(options: StreamVerificationOptions): Promise<void> {
		const testStart = Date.now();
		console.log('📋 Test 4: Error Handling');

		try {
			const { streamText } = await import('ai');
			const { createAIProvider } = await import('@sambung-chat/api/lib/ai-provider-factory');

			// Test with invalid API key
			const model = createAIProvider({
				provider: 'anthropic',
				modelId: options.modelId || 'claude-3-5-haiku-20241022',
				apiKey: 'sk-ant-invalid-key-12345',
			});

			const messages = [
				{
					role: 'user' as const,
					content: 'Hello',
				},
			];

			const result = streamText({
				model,
				messages,
			});

			const stream = result.toDataStream();
			const reader = stream.getReader();

			let errorThrown = false;
			let errorMessage = '';

			try {
				while (true) {
					const { done } = await reader.read();
					if (done) break;
				}
			} catch (error) {
				errorThrown = true;
				errorMessage = error instanceof Error ? error.message : String(error);
			}

			if (errorThrown && errorMessage.length > 0) {
				this.results.push({
					success: true,
					test: 'Error Handling',
					message: '✓ Errors are caught and reported gracefully',
					details: {
						errorMessage: errorMessage.substring(0, 100),
					},
					duration: Date.now() - testStart,
				});
				console.log(`   ✓ Error handling verified:`);
				console.log(`     - Error caught: ${errorMessage.substring(0, 80)}...\n`);
			} else {
				throw new Error('Expected error was not thrown for invalid API key');
			}
		} catch (error) {
			this.results.push({
				success: false,
				test: 'Error Handling',
				message: `✗ Error handling test failed: ${error instanceof Error ? error.message : String(error)}`,
				duration: Date.now() - testStart,
			});
			console.log(`   ✗ Failed: ${error}\n`);
		}
	}

	private printSummary(totalDuration: number): void {
		console.log('━'.repeat(60));
		console.log('📊 VERIFICATION SUMMARY\n');

		const passed = this.results.filter((r) => r.success).length;
		const failed = this.results.filter((r) => !r.success).length;

		this.results.forEach((result) => {
			const icon = result.success ? '✅' : '❌';
			console.log(`${icon} ${result.test}`);
			console.log(`   ${result.message}`);
			if (result.details) {
				console.log(`   Details:`, result.details);
			}
			console.log(`   Duration: ${result.duration}ms\n`);
		});

		console.log('━'.repeat(60));
		console.log(`Total: ${passed} passed, ${failed} failed`);
		console.log(`Total Duration: ${totalDuration}ms`);

		if (failed === 0) {
			console.log('\n✅ All tests passed! Anthropic streaming is working correctly.');
		} else {
			console.log('\n⚠️  Some tests failed. Please review the errors above.');
		}
	}
}

// Main execution
async function main() {
	const apiKey = process.env.ANTHROPIC_API_KEY;

	if (!apiKey) {
		console.error('❌ ANTHROPIC_API_KEY environment variable is not set');
		console.error('\nUsage: ANTHROPIC_API_KEY=sk-ant-... bun run scripts/verify-anthropic-streaming.ts');
		process.exit(1);
	}

	const verifier = new AnthropicStreamingVerifier();

	try {
		await verifier.verifyAll({
			serverUrl: 'http://localhost:3000',
			apiKey: apiKey,
			modelId: 'claude-3-5-haiku-20241022', // Use fastest model for testing
		});
	} catch (error) {
		console.error('\n❌ Verification failed with unexpected error:', error);
		process.exit(1);
	}
}

// Run if executed directly
if (import.meta.main) {
	main();
}

export { AnthropicStreamingVerifier };
