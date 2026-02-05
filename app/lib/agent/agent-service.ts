/**
 * Claude Agent Service
 *
 * Core service for AI-powered page building with streaming responses.
 * Uses Sonnet 4 for iterations, Opus 4 for premium/final polish.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  AgentStep,
  AgentMessage,
  PageStructure,
  SectionContent,
  ModelTier,
  CostEstimate,
  TOKEN_PRICING,
  AgentStreamEvent,
} from './types';
import {
  AGENT_SYSTEM_PROMPT,
  getUnderstandingPrompt,
  getStructurePrompt,
  getSectionCopyPrompt,
  getCodeGenerationPrompt,
  getRefinementPrompt,
} from './prompts';

// Configuration
const ANTHROPIC_API_KEY = typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined;
const OPENROUTER_API_KEY = typeof process !== 'undefined' ? process.env.OPEN_ROUTER_API_KEY : undefined;

// Model selection based on tier
const MODELS = {
  standard: 'claude-sonnet-4-20250514',
  premium: 'claude-opus-4-20250514',
};

// OpenRouter model names
const OPENROUTER_MODELS = {
  standard: 'anthropic/claude-sonnet-4',
  premium: 'anthropic/claude-opus-4',
};

export interface AgentServiceConfig {
  modelTier?: ModelTier;
  maxTokens?: number;
  onStream?: (event: AgentStreamEvent) => void;
}

/**
 * Agent Service Class
 */
export class AgentService {
  private client: Anthropic | null = null;
  private useOpenRouter: boolean;
  private config: AgentServiceConfig;
  private conversationHistory: AgentMessage[] = [];
  private currentStep: AgentStep = 'idle';
  private totalInputTokens = 0;
  private totalOutputTokens = 0;

  constructor(config: AgentServiceConfig = {}) {
    this.config = {
      modelTier: config.modelTier || 'standard',
      maxTokens: config.maxTokens || 8192,
      onStream: config.onStream,
    };

    this.useOpenRouter = !ANTHROPIC_API_KEY && !!OPENROUTER_API_KEY;

    if (ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    }
  }

  /**
   * Get current model based on tier
   */
  private getModel(): string {
    const tier = this.config.modelTier || 'standard';
    return this.useOpenRouter ? OPENROUTER_MODELS[tier] : MODELS[tier];
  }

  /**
   * Stream a message to the agent
   */
  async streamMessage(
    userMessage: string,
    context?: Record<string, string>,
  ): Promise<AsyncGenerator<AgentStreamEvent>> {
    const model = this.getModel();

    // Add user message to history
    this.conversationHistory.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Prepare messages for API
    const messages = this.conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    if (this.useOpenRouter) {
      return this.streamOpenRouter(model, messages, context);
    } else {
      return this.streamAnthropic(model, messages, context);
    }
  }

  /**
   * Stream via Anthropic API
   */
  private async *streamAnthropic(
    model: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    context?: Record<string, string>,
  ): AsyncGenerator<AgentStreamEvent> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Set ANTHROPIC_API_KEY.');
    }

    const systemPrompt = context
      ? `${AGENT_SYSTEM_PROMPT}\n\n## Current Context\n${JSON.stringify(context, null, 2)}`
      : AGENT_SYSTEM_PROMPT;

    try {
      const stream = await this.client.messages.stream({
        model,
        max_tokens: this.config.maxTokens || 8192,
        system: systemPrompt,
        messages,
      });

      let fullContent = '';

      yield { type: 'message_start', data: { model } };

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          const delta = event.delta;

          if ('text' in delta) {
            fullContent += delta.text;
            yield { type: 'message_delta', data: { text: delta.text } };
          }
        }
      }

      // Get final message for token counts
      const finalMessage = await stream.finalMessage();
      this.totalInputTokens += finalMessage.usage.input_tokens;
      this.totalOutputTokens += finalMessage.usage.output_tokens;

      // Add assistant response to history
      this.conversationHistory.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
        metadata: {
          tokensUsed: finalMessage.usage.input_tokens + finalMessage.usage.output_tokens,
          model,
        },
      });

      yield {
        type: 'message_complete',
        data: {
          content: fullContent,
          usage: finalMessage.usage,
          estimatedCost: this.calculateCost(finalMessage.usage.input_tokens, finalMessage.usage.output_tokens),
        },
      };
    } catch (error) {
      yield { type: 'error', data: { error: String(error) } };
    }
  }

  /**
   * Stream via OpenRouter API
   */
  private async *streamOpenRouter(
    model: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    context?: Record<string, string>,
  ): AsyncGenerator<AgentStreamEvent> {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured. Set OPEN_ROUTER_API_KEY.');
    }

    const systemPrompt = context
      ? `${AGENT_SYSTEM_PROMPT}\n\n## Current Context\n${JSON.stringify(context, null, 2)}`
      : AGENT_SYSTEM_PROMPT;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://pocketmarketer.app',
          'X-Title': 'Pocket Marketer Website Builder',
        },
        body: JSON.stringify({
          model,
          max_tokens: this.config.maxTokens || 8192,
          stream: true,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullContent = '';

      yield { type: 'message_start', data: { model } };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data) as {
              choices?: Array<{ delta?: { content?: string } }>;
              usage?: { prompt_tokens: number; completion_tokens: number };
            };
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              fullContent += content;
              yield { type: 'message_delta', data: { text: content } };
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Estimate tokens (OpenRouter may not always provide exact counts in stream)
      const estimatedInputTokens = Math.ceil(systemPrompt.length / 4);
      const estimatedOutputTokens = Math.ceil(fullContent.length / 4);
      this.totalInputTokens += estimatedInputTokens;
      this.totalOutputTokens += estimatedOutputTokens;

      this.conversationHistory.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
        metadata: {
          tokensUsed: estimatedInputTokens + estimatedOutputTokens,
          model,
        },
      });

      yield {
        type: 'message_complete',
        data: {
          content: fullContent,
          usage: { input_tokens: estimatedInputTokens, output_tokens: estimatedOutputTokens },
          estimatedCost: this.calculateCost(estimatedInputTokens, estimatedOutputTokens),
        },
      };
    } catch (error) {
      yield { type: 'error', data: { error: String(error) } };
    }
  }

  /**
   * Start the understanding phase - ask clarifying questions
   */
  async *startUnderstanding(userRequest: string, context?: Record<string, string>): AsyncGenerator<AgentStreamEvent> {
    this.currentStep = 'understanding';
    yield { type: 'step_change', data: { step: 'understanding' } };

    const prompt = getUnderstandingPrompt(userRequest);
    const generator = await this.streamMessage(prompt, context);

    for await (const event of generator) {
      yield event;
    }

    this.currentStep = 'clarifying';
    yield { type: 'step_change', data: { step: 'clarifying' } };
  }

  /**
   * Generate page structure based on gathered context
   */
  async *generateStructure(
    context: Record<string, string>,
    userPreferences?: string,
  ): AsyncGenerator<AgentStreamEvent> {
    this.currentStep = 'generating-structure';
    yield { type: 'step_change', data: { step: 'generating-structure' } };
    yield { type: 'progress_update', data: { progress: 10, message: 'Designing page structure...' } };

    const prompt = getStructurePrompt(context, userPreferences);
    const generator = await this.streamMessage(prompt, context);

    for await (const event of generator) {
      yield event;
    }
  }

  /**
   * Generate copy for a specific section
   */
  async *generateSectionCopy(
    sectionType: string,
    sectionTitle: string,
    context: Record<string, string>,
    pageStructure: PageStructure,
    sectionIndex: number,
    totalSections: number,
  ): AsyncGenerator<AgentStreamEvent> {
    this.currentStep = 'generating-copy';
    yield { type: 'step_change', data: { step: 'generating-copy' } };

    const progress = 20 + (sectionIndex / totalSections) * 40;
    yield {
      type: 'progress_update',
      data: {
        progress,
        currentSection: sectionTitle,
        sectionsComplete: sectionIndex,
        sectionsTotal: totalSections,
        message: `Writing copy for ${sectionTitle}...`,
      },
    };

    const prompt = getSectionCopyPrompt(sectionType as any, sectionTitle, context, pageStructure);
    const generator = await this.streamMessage(prompt, context);

    for await (const event of generator) {
      yield event;
    }

    yield { type: 'section_complete', data: { sectionType, sectionTitle } };
  }

  /**
   * Generate the final React component
   */
  async *generateCode(
    pageStructure: PageStructure,
    sectionContents: Record<string, SectionContent>,
    context: Record<string, string>,
  ): AsyncGenerator<AgentStreamEvent> {
    this.currentStep = 'applying-styles';
    yield { type: 'step_change', data: { step: 'applying-styles' } };
    yield { type: 'progress_update', data: { progress: 70, message: 'Generating code...' } };

    const prompt = getCodeGenerationPrompt(pageStructure, sectionContents, context);
    const generator = await this.streamMessage(prompt, context);

    for await (const event of generator) {
      yield event;
    }

    this.currentStep = 'previewing';
    yield { type: 'step_change', data: { step: 'previewing' } };
    yield { type: 'progress_update', data: { progress: 95, message: 'Almost done!' } };
  }

  /**
   * Apply a refinement to the generated code
   */
  async *refine(
    command: string,
    currentCode: string,
    targetSection?: string,
    context?: Record<string, string>,
  ): AsyncGenerator<AgentStreamEvent> {
    yield { type: 'progress_update', data: { progress: 0, message: `Applying refinement: ${command}...` } };

    const prompt = getRefinementPrompt(command, currentCode, targetSection);
    const generator = await this.streamMessage(prompt, context);

    for await (const event of generator) {
      yield event;
    }

    yield { type: 'progress_update', data: { progress: 100, message: 'Refinement complete!' } };
  }

  /**
   * Calculate cost estimate
   */
  calculateCost(inputTokens: number, outputTokens: number): CostEstimate {
    const model = this.getModel();
    const pricing = model.includes('opus') ? { input: 15.0, output: 75.0 } : { input: 3.0, output: 15.0 };

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return {
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
      model,
    };
  }

  /**
   * Get total cost for session
   */
  getTotalCost(): CostEstimate {
    return this.calculateCost(this.totalInputTokens, this.totalOutputTokens);
  }

  /**
   * Get conversation history
   */
  getHistory(): AgentMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    this.totalInputTokens = 0;
    this.totalOutputTokens = 0;
    this.currentStep = 'idle';
  }

  /**
   * Get current step
   */
  getCurrentStep(): AgentStep {
    return this.currentStep;
  }

  /**
   * Set model tier
   */
  setModelTier(tier: ModelTier): void {
    this.config.modelTier = tier;
  }

  /**
   * Check if service is configured
   */
  static isConfigured(): boolean {
    return !!(ANTHROPIC_API_KEY || OPENROUTER_API_KEY);
  }

  /**
   * Get provider info
   */
  static getProviderInfo(): { name: string; configured: boolean } {
    if (ANTHROPIC_API_KEY) {
      return { name: 'Anthropic', configured: true };
    }

    if (OPENROUTER_API_KEY) {
      return { name: 'OpenRouter', configured: true };
    }

    return { name: 'None', configured: false };
  }
}

/**
 * Extract code blocks from response
 */
export function extractCodeFromResponse(response: string): {
  tsx?: string;
  json?: string;
  raw: string;
} {
  const tsxMatch = response.match(/```(?:tsx|jsx|react)\n([\s\S]*?)```/i);
  const jsonMatch = response.match(/```json\n([\s\S]*?)```/i);

  return {
    tsx: tsxMatch?.[1]?.trim(),
    json: jsonMatch?.[1]?.trim(),
    raw: response,
  };
}

/**
 * Parse page structure from JSON response
 */
export function parsePageStructure(jsonString: string): PageStructure | null {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      title: parsed.title || 'Untitled Page',
      description: parsed.description || '',
      sections: (parsed.sections || []).map((s: any, i: number) => ({
        id: crypto.randomUUID(),
        type: s.type || 'custom',
        title: s.title || `Section ${i + 1}`,
        order: s.order ?? i + 1,
        status: 'pending',
      })),
      colorScheme: parsed.colorScheme,
      typography: parsed.typography,
    };
  } catch {
    return null;
  }
}

/**
 * Parse section content from JSON response
 */
export function parseSectionContent(jsonString: string): SectionContent | null {
  try {
    return JSON.parse(jsonString) as SectionContent;
  } catch {
    return null;
  }
}
