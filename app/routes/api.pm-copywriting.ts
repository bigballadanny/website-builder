/**
 * PM AI Copywriting API
 *
 * Generates marketing copy for landing pages:
 * - Generate: Creates headlines, body copy, and CTAs
 * - Improve: Refines existing text with specific goals
 */

import type { ActionFunction } from '@remix-run/cloudflare';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export type ToneType = 'professional' | 'casual' | 'bold' | 'friendly';
export type SectionType = 'hero' | 'features' | 'cta' | 'about' | 'testimonials' | 'pricing' | 'faq' | 'benefits';
export type ImprovementType = 'shorter' | 'longer' | 'persuasive' | 'simpler' | 'urgent' | 'emotional';

interface GenerateCopyRequest {
  action: 'generate';
  description: string;
  tone: ToneType;
  sectionType: SectionType;
  businessName?: string;
  businessDescription?: string;
}

interface ImproveCopyRequest {
  action: 'improve';
  text: string;
  improvement: ImprovementType;
  sectionType?: SectionType;
}

type CopyRequest = GenerateCopyRequest | ImproveCopyRequest;

interface CopyResult {
  headlines: string[];
  subheadline: string;
  bodyCopy: string;
  ctaText: string;
}

interface ImproveResult {
  improved: string;
  alternatives: string[];
}

const TONE_DESCRIPTIONS: Record<ToneType, string> = {
  professional: 'polished, authoritative, and trustworthy',
  casual: 'conversational, friendly, and approachable',
  bold: 'confident, direct, and attention-grabbing',
  friendly: 'warm, welcoming, and personable',
};

const SECTION_CONTEXT: Record<SectionType, string> = {
  hero: 'the main hero section that captures attention immediately',
  features: 'a features or services section highlighting key offerings',
  cta: 'a call-to-action section driving conversions',
  about: 'an about us section building trust and connection',
  testimonials: 'a testimonials or social proof section',
  pricing: 'a pricing section communicating value',
  faq: 'a FAQ section addressing common questions',
  benefits: 'a benefits section showing customer outcomes',
};

const IMPROVEMENT_INSTRUCTIONS: Record<ImprovementType, string> = {
  shorter: 'Make this more concise while keeping the core message. Cut unnecessary words, be punchy.',
  longer: 'Expand this with more detail and context. Add supporting points while maintaining flow.',
  persuasive: 'Make this more compelling and action-oriented. Add urgency, benefits, and emotional hooks.',
  simpler: 'Simplify the language. Use shorter words, shorter sentences. Make it easy to understand.',
  urgent: 'Add urgency and scarcity. Make the reader feel they need to act now.',
  emotional: 'Make this more emotionally resonant. Connect with feelings, aspirations, and desires.',
};

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = (await request.json()) as CopyRequest;

    // Get Gemini API key (prefer Gemini, fall back to what's available)
    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      (context?.cloudflare?.env as any)?.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!geminiKey) {
      return new Response('GOOGLE_GENERATIVE_AI_API_KEY not configured', { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey: geminiKey });

    if (body.action === 'generate') {
      const result = await generateCopy(google, body);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (body.action === 'improve') {
      const result = await improveCopy(google, body);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid action', { status: 400 });
  } catch (error) {
    console.error('Copywriting error:', error);
    return new Response(error instanceof Error ? error.message : 'Copywriting failed', { status: 500 });
  }
};

async function generateCopy(
  google: ReturnType<typeof createGoogleGenerativeAI>,
  req: GenerateCopyRequest
): Promise<CopyResult> {
  const toneDesc = TONE_DESCRIPTIONS[req.tone];
  const sectionContext = SECTION_CONTEXT[req.sectionType];

  const prompt = `You are an expert marketing copywriter. Generate compelling copy for ${sectionContext}.

USER'S BRIEF:
"${req.description}"

${req.businessName ? `Business: ${req.businessName}` : ''}
${req.businessDescription ? `About: ${req.businessDescription}` : ''}

TONE: ${req.tone} - ${toneDesc}

Generate the following in JSON format:
{
  "headlines": ["headline1", "headline2", "headline3"],
  "subheadline": "supporting text that elaborates on the headline",
  "bodyCopy": "1-2 paragraphs of persuasive body text",
  "ctaText": "action button text"
}

RULES:
- Headlines should be punchy and benefit-focused (max 10 words each)
- Provide 3 distinct headline variations
- Subheadline should expand on the promise (max 25 words)
- Body copy should address pain points and present transformation
- CTA should be action-oriented (2-5 words)
- Match the ${req.tone} tone consistently
- Focus on benefits, not features
- Use "you" and "your" to speak directly to reader

Output ONLY valid JSON, no markdown or explanation.`;

  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    prompt,
    maxTokens: 1000,
  });

  // Parse JSON response
  const cleanText = text.replace(/```json?\n?/gi, '').replace(/\n?```/gi, '').trim();

  try {
    const result = JSON.parse(cleanText) as CopyResult;

    // Validate structure
    if (!result.headlines || !Array.isArray(result.headlines)) {
      result.headlines = [result.headlines as any].filter(Boolean);
    }
    if (result.headlines.length === 0) {
      result.headlines = ['Transform Your Business Today'];
    }

    return {
      headlines: result.headlines.slice(0, 3),
      subheadline: result.subheadline || 'Discover how we can help you achieve your goals.',
      bodyCopy: result.bodyCopy || 'Learn more about our solution.',
      ctaText: result.ctaText || 'Get Started',
    };
  } catch {
    // Fallback if JSON parsing fails
    return {
      headlines: ['Transform Your Business Today', 'Achieve More With Less', 'Your Success Starts Here'],
      subheadline: 'Discover how we can help you achieve your goals.',
      bodyCopy: text.slice(0, 500),
      ctaText: 'Get Started',
    };
  }
}

async function improveCopy(
  google: ReturnType<typeof createGoogleGenerativeAI>,
  req: ImproveCopyRequest
): Promise<ImproveResult> {
  const instruction = IMPROVEMENT_INSTRUCTIONS[req.improvement];
  const sectionContext = req.sectionType ? SECTION_CONTEXT[req.sectionType] : 'a marketing page';

  const prompt = `You are an expert marketing copywriter improving text for ${sectionContext}.

ORIGINAL TEXT:
"${req.text}"

IMPROVEMENT GOAL: ${instruction}

Generate the following in JSON format:
{
  "improved": "the primary improved version",
  "alternatives": ["alternative1", "alternative2"]
}

RULES:
- Keep the core message intact
- Apply the improvement goal specifically
- Provide one primary improved version
- Provide 2 alternative variations
- Maintain marketing effectiveness
- Each version should be distinct

Output ONLY valid JSON, no markdown or explanation.`;

  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    prompt,
    maxTokens: 800,
  });

  // Parse JSON response
  const cleanText = text.replace(/```json?\n?/gi, '').replace(/\n?```/gi, '').trim();

  try {
    const result = JSON.parse(cleanText) as ImproveResult;

    return {
      improved: result.improved || req.text,
      alternatives: Array.isArray(result.alternatives) ? result.alternatives.slice(0, 2) : [],
    };
  } catch {
    // Fallback
    return {
      improved: text.slice(0, 500),
      alternatives: [],
    };
  }
}
