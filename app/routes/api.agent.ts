/**
 * Agent API Route
 *
 * Handles streaming AI interactions for the page building agent.
 */

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import Anthropic from '@anthropic-ai/sdk';
import {
  AGENT_SYSTEM_PROMPT,
  getUnderstandingPrompt,
  getStructurePrompt,
  getSectionCopyPrompt,
  getCodeGenerationPrompt,
  getRefinementPrompt,
} from '~/lib/agent/prompts';
import type { AgentStep, PageStructure, SectionContent, ModelTier } from '~/lib/agent/types';

// Model selection
const MODELS = {
  standard: 'claude-sonnet-4-20250514',
  premium: 'claude-opus-4-20250514',
};

const OPENROUTER_MODELS = {
  standard: 'anthropic/claude-sonnet-4',
  premium: 'anthropic/claude-opus-4',
};

interface AgentRequest {
  action: 'chat' | 'understand' | 'structure' | 'copy' | 'code' | 'refine';
  message?: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: Record<string, string>;
  modelTier?: ModelTier;
  // For structure/copy/code actions
  pageStructure?: PageStructure;
  sectionContents?: Record<string, SectionContent>;
  sectionType?: string;
  sectionTitle?: string;
  sectionIndex?: number;
  totalSections?: number;
  // For refinement
  currentCode?: string;
  refinementCommand?: string;
  targetSection?: string;
}

export async function action({ request, context }: ActionFunctionArgs) {
  // Get API keys from environment
  const cloudflareEnv = context.cloudflare?.env as unknown as Record<string, string | undefined> | undefined;
  const ANTHROPIC_API_KEY = cloudflareEnv?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const OPENROUTER_API_KEY = cloudflareEnv?.OPEN_ROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY;

  if (!ANTHROPIC_API_KEY && !OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'No AI API key configured. Set ANTHROPIC_API_KEY or OPEN_ROUTER_API_KEY.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const useOpenRouter = !ANTHROPIC_API_KEY && !!OPENROUTER_API_KEY;

  try {
    const body = await request.json() as AgentRequest;
    const { action, modelTier = 'standard' } = body;
    const model = useOpenRouter ? OPENROUTER_MODELS[modelTier] : MODELS[modelTier];

    // Build the prompt based on action
    let systemPrompt = AGENT_SYSTEM_PROMPT;
    let userPrompt = body.message || '';
    let messages = body.messages || [];

    if (body.context) {
      systemPrompt += `\n\n## Current Context\n${JSON.stringify(body.context, null, 2)}`;
    }

    switch (action) {
      case 'understand':
        userPrompt = getUnderstandingPrompt(body.message || '');
        break;

      case 'structure':
        userPrompt = getStructurePrompt(body.context || {}, body.message);
        break;

      case 'copy':
        if (!body.sectionType || !body.sectionTitle || !body.pageStructure) {
          return new Response(
            JSON.stringify({ error: 'Missing section info for copy generation' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        userPrompt = getSectionCopyPrompt(
          body.sectionType as any,
          body.sectionTitle,
          body.context || {},
          body.pageStructure
        );
        break;

      case 'code':
        if (!body.pageStructure || !body.sectionContents) {
          return new Response(
            JSON.stringify({ error: 'Missing page structure or section contents' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        userPrompt = getCodeGenerationPrompt(
          body.pageStructure,
          body.sectionContents,
          body.context || {}
        );
        break;

      case 'refine':
        if (!body.currentCode || !body.refinementCommand) {
          return new Response(
            JSON.stringify({ error: 'Missing code or refinement command' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        userPrompt = getRefinementPrompt(
          body.refinementCommand,
          body.currentCode,
          body.targetSection
        );
        break;

      case 'chat':
      default:
        // Use provided messages for chat
        break;
    }

    // Add the user prompt to messages if not a chat action
    if (action !== 'chat' && userPrompt) {
      messages = [...messages, { role: 'user' as const, content: userPrompt }];
    }

    // Stream the response
    if (useOpenRouter) {
      return streamOpenRouter(OPENROUTER_API_KEY!, model, systemPrompt, messages);
    } else {
      return streamAnthropic(ANTHROPIC_API_KEY!, model, systemPrompt, messages);
    }
  } catch (error) {
    console.error('[Agent API] Error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Stream via Anthropic API
 */
async function streamAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model,
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  });

  // Create a readable stream that emits SSE events
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        // Send start event
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', model })}\n\n`));

        for await (const event of stream) {
          if (event.type === 'content_block_delta') {
            const delta = event.delta;
            if ('text' in delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'delta', text: delta.text })}\n\n`)
              );
            }
          }
        }

        // Get final message for usage
        const finalMessage = await stream.finalMessage();
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'complete',
              usage: finalMessage.usage,
            })}\n\n`
          )
        );

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: String(error) })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

/**
 * Stream via OpenRouter API
 */
async function streamOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://pocketmarketer.app',
      'X-Title': 'Pocket Marketer Website Builder',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      stream: true,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(
      JSON.stringify({ error: `OpenRouter API error: ${error}` }),
      { status: response.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Forward the stream with our event format
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      // Send start event
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', model })}\n\n`));

      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
                usage?: { prompt_tokens: number; completion_tokens: number };
              };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'delta', text: content })}\n\n`)
                );
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // Send completion with estimated usage
        const estimatedInputTokens = Math.ceil(systemPrompt.length / 4);
        const estimatedOutputTokens = Math.ceil(fullContent.length / 4);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'complete',
              usage: {
                input_tokens: estimatedInputTokens,
                output_tokens: estimatedOutputTokens,
              },
            })}\n\n`
          )
        );

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: String(error) })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
