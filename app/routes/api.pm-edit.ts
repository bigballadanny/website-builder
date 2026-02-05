/**
 * PM Website Edit API
 *
 * Takes current HTML and natural language instruction, returns updated HTML.
 * Supports color changes, layout tweaks, content updates, and more.
 */

import type { ActionFunction } from '@remix-run/cloudflare';
import Anthropic from '@anthropic-ai/sdk';
import type { ColorScheme } from '~/lib/pm/color-schemes';

interface StylingInput {
  colorScheme?: ColorScheme;
  font?: {
    id: string;
    name: string;
    family: string;
    style: string;
  };
}

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { currentHtml, instruction, brandInfo, styling } = body as {
      currentHtml: string;
      instruction: string;
      brandInfo: {
        businessName: string;
        businessDescription: string;
        idealCustomer: string;
        problemSolved: string;
        transformation: string;
        callToAction: string;
        socialProof?: string;
      };
      styling?: StylingInput;
    };

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || (context?.cloudflare?.env as any)?.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
    }

    // Get color scheme info for context
    const colors = styling?.colorScheme?.colors || {
      background: '#0a1628',
      surface: '#132743',
      primary: '#3b82f6',
      secondary: '#1e3a5f',
      accent: '#60a5fa',
      text: '#ffffff',
      textMuted: '#94a3b8',
      border: '#1e3a5f',
    };

    // Generate with Claude
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a website editor for Pocket Marketer.
You receive an existing HTML page and an edit instruction.
Apply the requested changes while maintaining design consistency.

CRITICAL RULES:
1. Output ONLY the complete updated HTML - no explanations, no markdown, no code fences
2. Start directly with <!DOCTYPE html>
3. Preserve ALL existing structure unless explicitly asked to change it
4. Keep Tailwind CSS classes consistent
5. Maintain mobile responsiveness
6. Keep forms working (don't remove form attributes)

BRAND CONTEXT:
- Business: ${brandInfo.businessName}
- Description: ${brandInfo.businessDescription}
- Customer: ${brandInfo.idealCustomer}
- CTA: ${brandInfo.callToAction}

COLOR PALETTE (reference for "change colors" requests):
- Primary: ${colors.primary} (use for buttons, links, accents)
- Background: ${colors.background}
- Surface: ${colors.surface} (cards, sections)
- Text: ${colors.text}
- Muted text: ${colors.textMuted}

COMMON EDIT PATTERNS:
- "make headline bigger" → increase text size classes (text-4xl → text-5xl, etc.)
- "change colors to blue" → update primary color classes to blue variants
- "change colors to green" → update primary color classes to green variants  
- "add more white space" → increase padding/margin (py-8 → py-16, etc.)
- "make it more professional" → adjust typography, spacing, tone
- "add testimonial section" → insert new section with placeholder testimonials
- "make CTA button green" → change button background to green

IMPORTANT: Output complete, valid HTML starting with <!DOCTYPE html>`;

    const userPrompt = `CURRENT HTML:
\`\`\`html
${currentHtml}
\`\`\`

EDIT INSTRUCTION:
"${instruction}"

Apply this edit and return the COMPLETE updated HTML page.
Remember: Output ONLY the HTML, starting with <!DOCTYPE html>`;

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

    // Ensure it starts with DOCTYPE
    if (!html.startsWith('<!DOCTYPE')) {
      const doctypeIndex = html.indexOf('<!DOCTYPE');

      if (doctypeIndex > 0) {
        html = html.substring(doctypeIndex);
      } else if (html.includes('<html')) {
        html = '<!DOCTYPE html>\n' + html;
      }
    }

    return new Response(JSON.stringify({ html }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edit error:', error);
    return new Response(error instanceof Error ? error.message : 'Edit failed', { status: 500 });
  }
};
