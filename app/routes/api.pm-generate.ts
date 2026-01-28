/**
 * PM Website Generation API
 *
 * Takes brand info and template, generates a complete landing page.
 */

import type { ActionFunction } from '@remix-run/cloudflare';
import Anthropic from '@anthropic-ai/sdk';
import { getTemplate, type TemplateId } from '~/templates';
import type { BrandDNA } from '~/lib/pm/types';

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { templateId, brandInfo } = body as {
      templateId: TemplateId;
      brandInfo: {
        businessName: string;
        businessDescription: string;
        idealCustomer: string;
        problemSolved: string;
        transformation: string;
        callToAction: string;
      };
    };

    // Get template
    const template = getTemplate(templateId);

    if (!template) {
      return new Response(`Template not found: ${templateId}`, { status: 400 });
    }

    // Build BrandDNA from input
    const brandDNA: BrandDNA = {
      projectName: brandInfo.businessName,
      companyName: brandInfo.businessName,
      businessDescription: brandInfo.businessDescription,
      idealCustomer: brandInfo.idealCustomer,
      problemSolved: brandInfo.problemSolved,
      desiredTransformation: brandInfo.transformation,
      callToAction: brandInfo.callToAction,
      offering: brandInfo.businessDescription,
      differentiators: '',
      customerAcquisition: '',
      salesProcess: '',
      objections: '',
      socialProof: '',
      mainGoal: '',
    };

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || (context?.cloudflare?.env as any)?.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
    }

    // Generate with Claude
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a website generator for Pocket Marketer. 
Generate high-converting, professional marketing pages.

OUTPUT FORMAT:
- Return ONLY the complete HTML page
- Use Tailwind CSS via CDN
- Include all sections inline (no external files)
- Make it mobile-responsive
- Use this color scheme:
  - Background: #0a1628 (dark navy)
  - Cards/sections: #132743
  - Accent: #3b82f6 (blue)
  - Text: white and #94a3b8 (gray)

IMPORTANT: Output ONLY the HTML, no explanation or markdown code fences.`;

    const userPrompt = template.prompt(brandDNA);

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

    // Ensure it's wrapped in proper HTML structure
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandInfo.businessName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a1628]">
${html}
</body>
</html>`;
    }

    return new Response(JSON.stringify({ html }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(error instanceof Error ? error.message : 'Generation failed', { status: 500 });
  }
};
