/**
 * AI Generation Service
 *
 * Handles website generation using Claude
 * Supports direct Anthropic API or OpenRouter proxy
 */

import Anthropic from '@anthropic-ai/sdk';
import { type GenerationContext, buildSystemPrompt } from '~/lib/pm/context-aggregator';
import { getTemplate, type TemplateId } from '~/templates';

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
const USE_OPENROUTER = !ANTHROPIC_API_KEY && OPENROUTER_API_KEY;

// Model selection
const MODEL = USE_OPENROUTER ? 'anthropic/claude-sonnet-4' : 'claude-sonnet-4-20250514';

/**
 * Generate a website page using AI
 */
export async function generatePage(
  templateId: TemplateId,
  context: GenerationContext,
  customInstructions?: string,
): Promise<GenerationResult> {
  const template = getTemplate(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const systemPrompt = buildSystemPrompt(context);
  const userPrompt =
    template.prompt(context.brandDNA) +
    (customInstructions ? `\n\nADDITIONAL INSTRUCTIONS:\n${customInstructions}` : '');

  // Call the appropriate API
  const response = USE_OPENROUTER
    ? await callOpenRouter(systemPrompt, userPrompt)
    : await callAnthropic(systemPrompt, userPrompt);

  return {
    html: extractCode(response, 'html'),
    react: extractCode(response, 'tsx') || extractCode(response, 'jsx'),
    css: extractCode(response, 'css'),
    raw: response,
  };
}

/**
 * Edit an existing page with natural language
 */
export async function editPage(
  currentCode: string,
  instruction: string,
  context: GenerationContext,
): Promise<GenerationResult> {
  const systemPrompt = buildSystemPrompt(context);
  const userPrompt = `
CURRENT CODE:
\`\`\`tsx
${currentCode}
\`\`\`

EDIT INSTRUCTION:
${instruction}

Apply the edit to the code above. Return the complete updated component.
Keep all existing functionality unless explicitly asked to remove it.
Maintain the same styling patterns and brand consistency.

OUTPUT: Complete React component with the requested changes.
`;

  const response = USE_OPENROUTER
    ? await callOpenRouter(systemPrompt, userPrompt)
    : await callAnthropic(systemPrompt, userPrompt);

  return {
    html: extractCode(response, 'html'),
    react: extractCode(response, 'tsx') || extractCode(response, 'jsx'),
    css: extractCode(response, 'css'),
    raw: response,
  };
}

/**
 * Call Anthropic API directly
 */
async function callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured. Add it to .env.local');
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  // Extract text from response
  const textBlock = response.content.find((block) => block.type === 'text');

  return textBlock?.text || '';
}

/**
 * Call OpenRouter API (proxy to Claude)
 */
async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPEN_ROUTER_API_KEY not configured. Add it to .env.local');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://pocketmarketer.app',
      'X-Title': 'Pocket Marketer Website Builder',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };

  return data.choices?.[0]?.message?.content || '';
}

/**
 * Extract code blocks from AI response
 */
function extractCode(response: string, language: string): string | null {
  const regex = new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\`\`\``, 'i');
  const match = response.match(regex);

  return match ? match[1].trim() : null;
}

/**
 * Generation result
 */
export interface GenerationResult {
  html: string | null;
  react: string | null;
  css: string | null;
  raw: string;
}

/**
 * Check if AI is properly configured
 */
export function isAIConfigured(): boolean {
  return !!(ANTHROPIC_API_KEY || OPENROUTER_API_KEY);
}

/**
 * Get current AI provider info
 */
export function getAIProvider(): { name: string; model: string; configured: boolean } {
  if (ANTHROPIC_API_KEY) {
    return { name: 'Anthropic', model: MODEL, configured: true };
  }

  if (OPENROUTER_API_KEY) {
    return { name: 'OpenRouter', model: MODEL, configured: true };
  }

  return { name: 'None', model: MODEL, configured: false };
}
