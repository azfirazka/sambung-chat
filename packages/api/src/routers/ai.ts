/**
 * AI Chat Completion Router
 *
 * This router handles AI chat completions using the AI SDK v6.
 * It supports streaming responses and proper error handling for various scenarios.
 *
 * Supported providers:
 * - OpenAI (GPT-4, GPT-3.5, GPT-4o, etc.)
 *
 * Error handling:
 * - Rate limits (HTTP 429)
 * - Invalid API keys (HTTP 401)
 * - Network errors
 * - Model not found
 * - Context window exceeded
 */

import { z } from 'zod';
import { eventIterator } from '@orpc/server';
import { protectedProcedure } from '../index';
import { completionInputSchema, streamEventSchema } from '../lib/ai-schemas';
import { handleComplete } from '../lib/ai-complete-handler';
import { handleStream } from '../lib/ai-stream-handler';
import { listModels, validateModel } from '../lib/ai-utils';
import { ulidSchema } from '../utils/validation';

export const aiRouter = {
  /**
   * Generate a non-streaming chat completion
   *
   * This endpoint returns the complete response in one call.
   * Use this for simple completions where streaming is not required.
   */
  complete: protectedProcedure.input(completionInputSchema).handler(async ({ input, context }) => {
    const userId = context.session.user.id;
    return handleComplete(input, userId);
  }),

  /**
   * Generate a streaming chat completion using Server-Sent Events (SSE)
   *
   * This endpoint uses oRPC's event iterator to stream text chunks as they are generated.
   * The async generator function yields each text delta for real-time display.
   *
   * Frontend consumption example:
   * ```ts
   * const stream = await orpc.ai.stream({ messages: [...] })
   * for await (const chunk of stream) {
   *   console.log(chunk.text) // Individual text delta
   * }
   * ```
   */
  stream: protectedProcedure
    .input(completionInputSchema)
    .output(eventIterator(streamEventSchema))
    .handler(async function* ({ input, context }) {
      const userId = context.session.user.id;
      yield* handleStream(input, userId);
    }),

  /**
   * Get available models for testing
   *
   * This endpoint returns a list of available models for the current user.
   * Useful for testing and validation.
   */
  listModels: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;
    return listModels(userId);
  }),

  /**
   * Validate model configuration
   *
   * This endpoint checks if a model is properly configured with valid credentials.
   */
  validateModel: protectedProcedure
    .input(z.object({ modelId: ulidSchema }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      return validateModel(input.modelId, userId);
    }),
};
