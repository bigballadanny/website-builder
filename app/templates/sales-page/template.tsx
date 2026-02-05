/**
 * Sales Page Template
 * Long-form sales page for products/services
 *
 * Structure follows proven copywriting frameworks:
 * - Problem → Agitation → Solution (PAS)
 * - Features → Benefits → Proof → Action
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface SalesPageProps {
  brandDNA: BrandDNA;
  customizations?: {
    includeVideo?: boolean;
    includePricing?: boolean;
    includeFAQ?: boolean;
    includeGuarantee?: boolean;
  };
}

export const salesPagePrompt = (brandDNA: BrandDNA) => `
Generate a high-converting long-form sales page for this business.

BRAND CONTEXT:
- Business: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Problem Solved: ${brandDNA.problemSolved}
- Transformation: ${brandDNA.desiredTransformation}
- Offering: ${brandDNA.offering}
- Why Choose Them: ${brandDNA.differentiators}
- Objections: ${brandDNA.objections}
- Social Proof: ${brandDNA.socialProof}
- CTA: ${brandDNA.callToAction}

STRUCTURE (Long-form Sales Page):

1. HERO SECTION
   - Big Promise headline (outcome-focused)
   - Subheadline that qualifies the reader
   - Primary CTA button
   
2. PROBLEM SECTION
   - Paint the pain they're experiencing
   - "Do any of these sound familiar?" list
   - Make them feel understood
   - Agitate: What happens if nothing changes?

3. SOLUTION INTRO
   - "There's a better way..."
   - Introduce your solution
   - Position as the bridge to their desired outcome

4. WHAT YOU GET (Features → Benefits)
   - List 5-7 features
   - Each feature has a benefit explanation
   - Use icons for visual appeal

5. HOW IT WORKS
   - 3 simple steps
   - Make it feel easy and achievable
   - Remove perceived complexity

6. SOCIAL PROOF SECTION
   ${brandDNA.socialProof ? `- Use: ${brandDNA.socialProof}` : '- Placeholder for testimonials'}
   - Mix of text testimonials and stats
   - Include names, photos if available
   - Trust badges (as seen in, certifications)

7. ABOUT / CREDIBILITY
   - Brief founder/company story
   - Why you're qualified to help
   - Humanize the brand

8. PRICING / OFFER
   - Clear pricing presentation
   - What's included
   - Compare value to cost
   - Urgency element if appropriate

9. OBJECTION HANDLING
   Based on: "${brandDNA.objections}"
   - Address top 3-5 objections
   - FAQ format works well
   - Reframe concerns as benefits

10. GUARANTEE SECTION
    - Risk reversal
    - Money-back guarantee if applicable
    - "You have nothing to lose"

11. FINAL CTA
    - Recap the transformation
    - Scarcity/urgency if authentic
    - Clear next step
    - "${brandDNA.callToAction}"

12. FOOTER
    - Contact info
    - Legal links
    - Social proof recap (# of customers, rating)

TECHNICAL REQUIREMENTS:
- React + Tailwind CSS
- Mobile-first responsive
- PM dark theme colors (bg: #0a1628, accent: #3b82f6)
- Smooth scroll to sections
- Sticky header with CTA
- Clean typography, good whitespace

OUTPUT: Complete React component with all sections.
`;

export const salesPageSections = [
  { id: 'hero', name: 'Hero', description: 'Big promise headline and CTA', required: true },
  { id: 'problem', name: 'Problem', description: 'Pain points and agitation', required: true },
  { id: 'solution', name: 'Solution', description: 'Introduce your offering', required: true },
  { id: 'features', name: 'Features & Benefits', description: 'What they get', required: true },
  { id: 'how-it-works', name: 'How It Works', description: '3-step process', required: true },
  { id: 'testimonials', name: 'Social Proof', description: 'Testimonials and trust', required: true },
  { id: 'about', name: 'About', description: 'Credibility and story', required: false },
  { id: 'pricing', name: 'Pricing', description: 'Offer presentation', required: false },
  { id: 'faq', name: 'FAQ', description: 'Objection handling', required: true },
  { id: 'guarantee', name: 'Guarantee', description: 'Risk reversal', required: false },
  { id: 'final-cta', name: 'Final CTA', description: 'Closing section', required: true },
  { id: 'footer', name: 'Footer', description: 'Links and contact', required: true },
];

export default {
  id: 'sales-page',
  name: 'Sales Page',
  description: 'Long-form page for selling products or services',
  category: 'sales',
  thumbnail: '/templates/sales-page/preview.svg',
  prompt: salesPagePrompt,
  sections: salesPageSections,
};
