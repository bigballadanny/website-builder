/**
 * Lead Magnet Page Template
 * Simple opt-in page for free resources (guides, checklists, etc.)
 * 
 * Goal: Maximum conversions with minimal friction
 * Keep it simple, focused, compelling
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface LeadMagnetPageProps {
  brandDNA: BrandDNA;
  leadMagnet: {
    title: string;           // "The Ultimate Guide to..."
    type: 'guide' | 'checklist' | 'template' | 'video' | 'webinar' | 'other';
    description: string;     // What they'll learn/get
    deliveryMethod: 'email' | 'instant' | 'both';
  };
}

export const leadMagnetPagePrompt = (brandDNA: BrandDNA, leadMagnet?: { title?: string; description?: string }) => `
Generate a high-converting lead magnet opt-in page.

BRAND CONTEXT:
- Business: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Problem Solved: ${brandDNA.problemSolved}
- Transformation: ${brandDNA.desiredTransformation}

LEAD MAGNET:
${leadMagnet?.title ? `- Title: ${leadMagnet.title}` : '- Title: Free [Guide/Checklist/Template] for [Ideal Customer]'}
${leadMagnet?.description ? `- Description: ${leadMagnet.description}` : '- Description: Derive from problem solved'}

STRUCTURE (Keep it simple):

1. HERO SECTION
   - Attention-grabbing headline about the FREE resource
   - Subheadline: What they'll learn or get
   - Lead magnet mockup image (placeholder)
   - Email opt-in form (name + email)
   - Submit button with action-oriented text

2. WHAT'S INSIDE (3-5 bullets)
   - "Inside this [guide/checklist], you'll discover:"
   - Specific, outcome-focused bullet points
   - Use checkmarks or icons
   - Each bullet = a mini transformation

3. WHO THIS IS FOR
   - "This is perfect for you if..."
   - 3-4 qualifying statements
   - Help them self-identify as ideal customer

4. ABOUT THE CREATOR (Brief)
   - Small photo + name
   - 1-2 sentences of credibility
   - Why they should trust you

5. SIMPLE FOOTER
   - Privacy note ("We respect your privacy")
   - Logo
   - Copyright

DESIGN REQUIREMENTS:
- SINGLE column layout
- Above the fold: headline + form
- No navigation (reduce distractions)
- Mobile-optimized (most traffic is mobile)
- PM colors: #0a1628 background, #3b82f6 buttons
- Form: Name, Email, Submit button
- Clean, minimal, focused

PSYCHOLOGY:
- Value > Friction (make it feel like a great deal)
- Specificity (exact numbers, outcomes)
- Urgency only if authentic

OUTPUT: Complete React component with opt-in form.
`;

export const leadMagnetPageSections = [
  { id: 'hero', name: 'Hero + Form', description: 'Headline and opt-in form', required: true },
  { id: 'whats-inside', name: "What's Inside", description: 'Bullet points of value', required: true },
  { id: 'who-for', name: 'Who This Is For', description: 'Qualifying statements', required: false },
  { id: 'about', name: 'About Creator', description: 'Brief credibility', required: false },
  { id: 'footer', name: 'Footer', description: 'Privacy and copyright', required: true },
];

export default {
  id: 'lead-magnet',
  name: 'Lead Magnet Page',
  description: 'Simple opt-in page for free resources',
  category: 'lead-gen',
  thumbnail: '/templates/lead-magnet/preview.png',
  prompt: leadMagnetPagePrompt,
  sections: leadMagnetPageSections,
};
