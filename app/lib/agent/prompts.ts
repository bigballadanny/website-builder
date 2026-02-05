/**
 * Agent System Prompts
 *
 * Carefully crafted prompts for each stage of the page building workflow
 */

import type { PageStructure, SectionType, SectionContent } from './types';

/**
 * Main system prompt for the page building agent
 */
export const AGENT_SYSTEM_PROMPT = `You are an expert web designer and copywriter working as a personal design consultant. Your role is to help users create stunning, conversion-focused landing pages through a collaborative conversation.

## Your Personality
- Enthusiastic but not overwhelming
- Ask smart questions to understand their vision
- Provide expert recommendations with clear reasoning
- Celebrate wins and progress
- Use conversational language, not corporate speak

## Your Expertise
- Conversion-focused landing page design
- Compelling copywriting that sells
- Modern web design trends
- Color psychology and typography
- User experience best practices
- Brand voice consistency

## Your Process
1. UNDERSTAND: Ask clarifying questions to understand the business, audience, and goals
2. STRUCTURE: Propose a page structure with sections tailored to their needs
3. COPYWRITE: Generate compelling copy for each section
4. STYLE: Apply colors, typography, and visual hierarchy
5. ITERATE: Refine based on feedback until they're delighted

## Important Rules
- Always generate COMPLETE, production-ready code
- Use React with Tailwind CSS
- Make the design responsive (mobile-first)
- Include smooth animations where appropriate
- Focus on conversion - every element should serve a purpose
- Write copy that speaks to the customer's desires and pain points
- Never use placeholder text like "Lorem ipsum"

## Output Format
When generating code, wrap it in a code block with the appropriate language tag:
\`\`\`tsx
// Your React component here
\`\`\`

When proposing page structure, use this JSON format:
\`\`\`json
{
  "sections": [
    {"type": "hero", "title": "Hero Section"},
    {"type": "features", "title": "Key Features"}
  ]
}
\`\`\``;

/**
 * Prompt for understanding/clarifying stage
 */
export function getUnderstandingPrompt(userRequest: string, context?: Record<string, string>): string {
  const contextStr = context ? Object.entries(context).map(([k, v]) => `- ${k}: ${v}`).join('\n') : '';

  return `The user wants to build a page. Here's their initial request:
"${userRequest}"

${context ? `## Current Context (from Discovery Flow)\n${JSON.stringify(context, null, 2)}` : ''}

Your task is to understand their needs better. 

**CRITICAL RULE:** If the provided Context (BrandDNA) already contains the business description, ideal customer, and specific goals, DO NOT ASK QUESTIONS. Instead, jump straight to proposing the page structure by outputting the PageStructure JSON.

If you DO need to ask questions, ask 2-3 smart clarifying questions. 

Proposing Structure (if ready):
Output a JSON object wrapped in \`\`\`json \`\`\` tags with:
- title, description
- sections (hero, features, benefits, testimonials, cta, etc.)
- colorScheme (primary, secondary, accent, background, text)

Be conversational and enthusiastic.`;
}

/**
 * Prompt for generating page structure
 */
export function getStructurePrompt(context: Record<string, string>, userPreferences?: string): string {
  return `Based on our conversation, I need to design a page structure.

## Business Context
${Object.entries(context)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

${userPreferences ? `## User Preferences\n${userPreferences}` : ''}

Create a page structure that will maximize conversions for this business. Output a JSON object with the following structure:

\`\`\`json
{
  "title": "Page title for SEO",
  "description": "Meta description",
  "sections": [
    {
      "type": "hero|features|benefits|testimonials|pricing|faq|cta|about|contact|stats|process",
      "title": "Section name for reference",
      "order": 1
    }
  ],
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  }
}
\`\`\`

Choose sections strategically based on the business type and goals. A landing page typically has 5-8 sections.`;
}

/**
 * Prompt for generating copy for a section
 */
export function getSectionCopyPrompt(
  sectionType: SectionType,
  sectionTitle: string,
  context: Record<string, string>,
  pageStructure: PageStructure,
): string {
  const sectionGuidelines: Record<SectionType, string> = {
    hero: `Create a hero section with:
- A powerful headline that hooks the reader (max 10 words)
- A subheadline that explains the value proposition
- A clear call-to-action button
- Optional: supporting visual description`,

    features: `Create a features section with:
- Section headline
- 3-4 key features, each with:
  - Feature title
  - Short description (1-2 sentences)
  - Suggested icon name (from Lucide icons)`,

    benefits: `Create a benefits section with:
- Section headline focusing on outcomes
- 3-4 benefits from the customer's perspective
- Each benefit should answer "What's in it for me?"`,

    testimonials: `Create a testimonials section with:
- Section headline
- 2-3 realistic testimonials with:
  - Quote (authentic-sounding, specific results)
  - Name and title
  - Company (optional)`,

    pricing: `Create a pricing section with:
- Section headline
- 2-3 pricing tiers with:
  - Tier name
  - Price
  - Key features list
  - CTA button text`,

    faq: `Create an FAQ section with:
- Section headline
- 4-6 common questions and answers
- Focus on objection handling`,

    cta: `Create a call-to-action section with:
- Compelling headline
- Brief supporting text
- Strong action button
- Optional: urgency element`,

    about: `Create an about section with:
- Section headline
- Company story or mission (2-3 paragraphs)
- Key differentiators`,

    team: `Create a team section with:
- Section headline
- 3-4 team member placeholders with roles`,

    contact: `Create a contact section with:
- Section headline
- Contact form fields suggestion
- Alternative contact methods`,

    gallery: `Create a gallery section with:
- Section headline
- Description of what images to showcase
- Layout suggestion`,

    stats: `Create a stats section with:
- 3-4 impressive statistics
- Each with number and label
- Make numbers feel achievable but impressive`,

    process: `Create a process section with:
- Section headline
- 3-4 steps showing how it works
- Each step with title and description`,

    comparison: `Create a comparison section with:
- Before/After or Us vs. Them comparison
- Clear differentiators
- Visual hierarchy suggestion`,

    custom: `Create custom content based on the section title.`,
  };

  return `Generate copy for the "${sectionTitle}" section (type: ${sectionType}).

## Business Context
${Object.entries(context)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

## Page Structure
${pageStructure.sections.map((s) => `${s.order}. ${s.title} (${s.type})`).join('\n')}

## Guidelines
${sectionGuidelines[sectionType]}

Output the content as JSON:
\`\`\`json
{
  "headline": "Section headline",
  "subheadline": "Optional subheadline",
  "body": "Optional body text",
  "items": [
    {"title": "Item title", "description": "Item description", "icon": "icon-name"}
  ],
  "cta": {"text": "Button text", "url": "#"}
}
\`\`\`

Write copy that:
- Speaks directly to the target customer
- Uses their language and addresses their pain points
- Focuses on benefits over features
- Creates urgency or desire
- Sounds natural, not salesy`;
}

/**
 * Prompt for generating the final React component
 */
export function getCodeGenerationPrompt(
  pageStructure: PageStructure,
  sectionContents: Record<string, SectionContent>,
  context: Record<string, string>,
): string {
  return `Generate a complete, production-ready React landing page component.

## Page Structure
${JSON.stringify(pageStructure, null, 2)}

## Section Contents
${JSON.stringify(sectionContents, null, 2)}

## Business Context
${Object.entries(context)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

## Requirements
1. Use React with Tailwind CSS
2. Make it fully responsive
3. Include smooth scroll animations (use Framer Motion if complex)
4. Use semantic HTML
5. Include all sections with the provided copy
6. Use the color scheme from pageStructure
7. Import icons from 'lucide-react'
8. Export as default component

## Code Structure
\`\`\`tsx
import React from 'react';
import { Icon1, Icon2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>...</section>
      
      {/* Other Sections */}
    </div>
  );
}
\`\`\`

Generate the COMPLETE component with all sections. Do not use placeholders.`;
}

/**
 * Prompt for refinement commands
 */
export function getRefinementPrompt(command: string, currentCode: string, targetSection?: string): string {
  const refinementGuidelines: Record<string, string> = {
    make_shorter: 'Make the copy more concise. Cut unnecessary words. Every word must earn its place.',
    make_longer: 'Expand the copy with more detail, examples, or emotional appeal.',
    make_formal: 'Adjust the tone to be more professional and authoritative.',
    make_casual: 'Make the tone more conversational and friendly.',
    make_urgent: 'Add urgency and scarcity elements. Create FOMO.',
    make_friendly: 'Make the tone warmer and more approachable.',
    add_humor: 'Add appropriate humor while keeping it professional.',
    simplify: 'Simplify the language. Use shorter sentences and simpler words.',
    emphasize_benefits: 'Rewrite to focus more on customer benefits and outcomes.',
    add_social_proof: 'Add or enhance social proof elements (numbers, testimonials, logos).',
  };

  const guideline = refinementGuidelines[command] || `Apply this refinement: ${command}`;

  return `Refine the following code based on this instruction:

## Refinement
${guideline}

${targetSection ? `## Target Section\nOnly modify the "${targetSection}" section.` : '## Scope\nApply to the entire page.'}

## Current Code
\`\`\`tsx
${currentCode}
\`\`\`

Output the COMPLETE updated code with the refinement applied. Maintain all other aspects of the design.`;
}
