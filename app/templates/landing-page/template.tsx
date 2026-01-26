/**
 * Landing Page Template
 * For lead generation - simple, focused, high-converting
 * 
 * Sections:
 * 1. Hero - Headline, subhead, CTA
 * 2. Pain Points - What they're struggling with
 * 3. Solution - How you solve it
 * 4. Benefits - What they get
 * 5. Social Proof - Testimonials
 * 6. Final CTA - Close the deal
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface LandingPageProps {
  brandDNA: BrandDNA;
  customizations?: {
    heroStyle?: 'centered' | 'split' | 'video';
    includePricing?: boolean;
    ctaStyle?: 'button' | 'form';
  };
}

export const landingPagePrompt = (brandDNA: BrandDNA) => `
Generate a high-converting landing page for this business.

BRAND CONTEXT:
- Business: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Problem Solved: ${brandDNA.problemSolved}
- Transformation: ${brandDNA.desiredTransformation}
- Offering: ${brandDNA.offering}
- Why Choose Them: ${brandDNA.differentiators}
- CTA: ${brandDNA.callToAction}

STRUCTURE:
1. HERO SECTION
   - Headline: Address the main pain or desire (benefit-focused)
   - Subheadline: Clarify what they get
   - CTA Button: "${brandDNA.callToAction || 'Get Started'}"
   - Optional: Hero image placeholder

2. PAIN POINTS SECTION (3 items)
   - What they're struggling with
   - Make them feel understood
   - Use their language

3. SOLUTION SECTION
   - Introduce your solution
   - How it works (3 simple steps)
   - Make it feel easy

4. BENEFITS SECTION (3-4 benefits)
   - Outcome-focused (not features)
   - Use transformation language
   - Include icons

5. SOCIAL PROOF
   ${brandDNA.socialProof ? `- Use these testimonials: ${brandDNA.socialProof}` : '- Include placeholder for testimonials'}

6. FINAL CTA
   - Urgency or scarcity if appropriate
   - Repeat main CTA
   - Remove risk (guarantee, no credit card, etc.)

7. FOOTER
   - Logo
   - Copyright
   - Basic links

TECHNICAL REQUIREMENTS:
- React + Tailwind CSS
- Mobile-first responsive
- PM dark theme colors:
  - Background: #0a1628
  - Cards: #132743
  - Accent: #3b82f6
  - Text: white / #94a3b8
- Clean, minimal design
- Fast loading (no heavy animations)

OUTPUT: Complete React component with Tailwind classes.
`;

export const landingPageSections = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main headline and call-to-action',
    required: true,
  },
  {
    id: 'pain-points',
    name: 'Pain Points',
    description: 'Problems your audience faces',
    required: true,
  },
  {
    id: 'solution',
    name: 'Solution',
    description: 'How you solve their problems',
    required: true,
  },
  {
    id: 'benefits',
    name: 'Benefits',
    description: 'What they get from working with you',
    required: true,
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    description: 'Testimonials and trust signals',
    required: false,
  },
  {
    id: 'final-cta',
    name: 'Final CTA',
    description: 'Closing call-to-action',
    required: true,
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Logo, links, copyright',
    required: true,
  },
];

export default {
  id: 'landing-page',
  name: 'Landing Page',
  description: 'Simple, focused page for lead generation',
  category: 'lead-gen',
  thumbnail: '/templates/landing-page/preview.png',
  prompt: landingPagePrompt,
  sections: landingPageSections,
};
