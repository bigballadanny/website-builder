/**
 * Context Aggregator
 *
 * Pulls data from PM's Interview, Knowledge Base, and Copy Vault
 * and assembles it into a unified context for AI generation.
 */

import type { BrandDNA, CopyAssets, Testimonial } from './types';
import { getProjectContext, getProjectAssets, getProjectCopy } from './client';

/**
 * Aggregated context ready for template generation
 */
export interface GenerationContext {
  // Core brand identity
  brandDNA: BrandDNA;

  // Pre-selected content from Copy Vault
  suggestedHeadlines: string[];
  suggestedCTAs: string[];

  // Assets
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;

  // Social proof
  testimonials: Testimonial[];
  trustBadges: string[];

  // Metadata
  projectId: string;
  projectName: string;
}

/**
 * Aggregate all PM data into generation-ready context
 */
export async function aggregateContext(pmProjectId: string): Promise<GenerationContext> {
  // Fetch all data in parallel
  const [projectContext, assets, copy] = await Promise.all([
    getProjectContext(pmProjectId),
    getProjectAssets(pmProjectId),
    getProjectCopy(pmProjectId),
  ]);

  return {
    brandDNA: projectContext.brandDNA,

    // Pull relevant copy
    suggestedHeadlines: selectBestHeadlines(copy, projectContext.brandDNA),
    suggestedCTAs: extractCTAs(copy, projectContext.brandDNA),

    // Extract assets
    logoUrl: assets.logo?.url,
    primaryColor: assets.brandColors?.[0] || '#3b82f6',
    secondaryColor: assets.brandColors?.[1] || '#0a1628',

    // Social proof
    testimonials: projectContext.testimonials || [],
    trustBadges: extractTrustBadges(projectContext.brandDNA),

    // Metadata
    projectId: pmProjectId,
    projectName: projectContext.brandDNA.projectName,
  };
}

/**
 * Select best headlines from Copy Vault based on template needs
 */
function selectBestHeadlines(copy: CopyAssets, brandDNA: BrandDNA): string[] {
  const headlines: string[] = [];

  // Use headlines from Copy Vault if available
  if (copy.headlines?.length) {
    headlines.push(...copy.headlines.slice(0, 5));
  }

  // Generate fallback headlines from Brand DNA
  if (headlines.length < 3) {
    // Transformation-focused headline
    if (brandDNA.desiredTransformation) {
      headlines.push(`Get ${brandDNA.desiredTransformation}`);
    }

    // Problem-focused headline
    if (brandDNA.problemSolved) {
      headlines.push(`Stop ${brandDNA.problemSolved.split(' ').slice(0, 5).join(' ')}...`);
    }

    // Ideal customer headline
    if (brandDNA.idealCustomer) {
      headlines.push(`For ${brandDNA.idealCustomer} Who Want Results`);
    }
  }

  return headlines;
}

/**
 * Extract CTAs from copy and Brand DNA
 */
function extractCTAs(copy: CopyAssets, brandDNA: BrandDNA): string[] {
  const ctas: string[] = [];

  // Primary CTA from Brand DNA
  if (brandDNA.callToAction) {
    ctas.push(brandDNA.callToAction);
  }

  // From offers
  if (copy.offers?.length) {
    ctas.push(...copy.offers.slice(0, 3));
  }

  // Fallbacks
  if (ctas.length === 0) {
    ctas.push('Get Started', 'Learn More', 'Book a Call');
  }

  return ctas;
}

/**
 * Extract trust badges from social proof text
 */
function extractTrustBadges(brandDNA: BrandDNA): string[] {
  const badges: string[] = [];
  const socialProof = brandDNA.socialProof?.toLowerCase() || '';

  // Look for common trust signals
  if (socialProof.includes('featured')) {
    // Extract publication names
    const pubMatch = socialProof.match(/featured in ([^.]+)/i);

    if (pubMatch) {
      badges.push(`Featured in ${pubMatch[1]}`);
    }
  }

  if (socialProof.includes('stars') || socialProof.includes('rating')) {
    const ratingMatch = socialProof.match(/([\d.]+)\s*(stars?|rating)/i);

    if (ratingMatch) {
      badges.push(`${ratingMatch[1]} Star Rating`);
    }
  }

  // Customer count
  const customerMatch = socialProof.match(/([\d,]+)\+?\s*(customers?|clients?|users?|served)/i);

  if (customerMatch) {
    badges.push(`${customerMatch[1]}+ Customers`);
  }

  return badges;
}

/**
 * Build the system prompt for AI generation
 */
export function buildSystemPrompt(context: GenerationContext): string {
  return `You are a website generator for Pocket Marketer. Generate high-converting marketing pages.

BRAND DNA:
- Business: ${context.brandDNA.businessDescription}
- Customer: ${context.brandDNA.idealCustomer}
- Problem: ${context.brandDNA.problemSolved}
- Transformation: ${context.brandDNA.desiredTransformation}
- Offer: ${context.brandDNA.offering}
- Differentiators: ${context.brandDNA.differentiators}

VOICE & TONE: ${context.brandDNA.voiceTone || 'Professional but approachable'}

SUGGESTED HEADLINES (use or improve):
${context.suggestedHeadlines.map((h) => `- "${h}"`).join('\n')}

SUGGESTED CTAs:
${context.suggestedCTAs.map((c) => `- "${c}"`).join('\n')}

TESTIMONIALS TO USE:
${context.testimonials.map((t) => `- "${t.quote}" - ${t.author}`).join('\n')}

TRUST BADGES:
${context.trustBadges.map((b) => `- ${b}`).join('\n')}

DESIGN REQUIREMENTS:
- Primary color: ${context.primaryColor}
- Background: #0a1628 (dark navy)
- Use React + Tailwind CSS
- Mobile-first responsive
- Clean, professional design

RULES:
1. Use the brand voice consistently
2. Focus on customer transformation, not features
3. Include all social proof provided
4. Make CTAs action-oriented
5. No placeholder text - use real copy derived from brand DNA
`;
}
