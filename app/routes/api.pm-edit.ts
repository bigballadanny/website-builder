/**
 * PM Website Edit API
 *
 * Takes current HTML and natural language instruction, returns updated HTML.
 */

import type { ActionFunction } from '@remix-run/cloudflare';
import Anthropic from '@anthropic-ai/sdk';

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { currentHtml, instruction, brandInfo } = body as {
      currentHtml: string;
      instruction: string;
      brandInfo: {
        businessName: string;
        businessDescription: string;
        idealCustomer: string;
        problemSolved: string;
        transformation: string;
        callToAction: string;
      };
    };

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || (context?.cloudflare?.env as any)?.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
    }

    // Generate with Claude
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a website editor for Pocket Marketer.
You receive an existing HTML page and an edit instruction.
Apply the edit while maintaining the brand consistency.

BRAND CONTEXT:
- Business: ${brandInfo.businessName}
- Description: ${brandInfo.businessDescription}
- Customer: ${brandInfo.idealCustomer}

OUTPUT FORMAT:
- Return ONLY the complete updated HTML page
- Keep all existing structure unless explicitly asked to change
- Maintain Tailwind CSS styling
- Keep responsive design

IMPORTANT: Output ONLY the HTML, no explanation or markdown code fences.`;

    const userPrompt = `CURRENT HTML:
${currentHtml}

EDIT INSTRUCTION:
${instruction}

Apply this edit and return the complete updated HTML.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Extract text
    const textBlock = response.content.find((block) => block.type === 'text');
    let html = textBlock?.text || '';

    // Clean up if wrapped in code fence
    html = html
      .replace(/^```html?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    return new Response(JSON.stringify({ html }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edit error:', error);
    return new Response(error instanceof Error ? error.message : 'Edit failed', { status: 500 });
  }
};
