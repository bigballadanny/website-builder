/**
 * Coming Soon Page Template
 * Pre-launch page to build anticipation and collect emails
 *
 * Use cases:
 * - New product launch
 * - New business launch
 * - Feature announcement
 * - Event registration
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface ComingSoonPageProps {
  brandDNA: BrandDNA;
  launchDetails?: {
    launchDate?: string; // "March 2024" or specific date
    waitlistIncentive?: string; // "Early access", "50% off", etc.
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export const comingSoonPagePrompt = (
  brandDNA: BrandDNA,
  launchDetails?: { launchDate?: string; waitlistIncentive?: string },
) => `
Generate a compelling coming soon / pre-launch page.

BRAND CONTEXT:
- Business: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Transformation: ${brandDNA.desiredTransformation}
- Company: ${brandDNA.companyName}

LAUNCH DETAILS:
${launchDetails?.launchDate ? `- Launch Date: ${launchDetails.launchDate}` : '- Launch Date: Coming Soon'}
${launchDetails?.waitlistIncentive ? `- Waitlist Incentive: ${launchDetails.waitlistIncentive}` : '- Waitlist Incentive: Be the first to know'}

STRUCTURE (Single Page, Minimal):

1. HERO SECTION (Full viewport)
   - Logo (centered, prominent)
   - "Coming Soon" or creative variant
   - One powerful headline about what's coming
   - Brief 1-2 sentence description
   - Countdown timer (if launch date specified)
   
2. EMAIL CAPTURE
   - "Join the waitlist" or "Get notified"
   - Email input + Submit button
   - Incentive text: "${launchDetails?.waitlistIncentive || 'Be the first to know when we launch'}"
   - Subscriber count if available ("Join 1,234 others")

3. TEASER CONTENT (Optional)
   - 3 key things to expect
   - Feature icons or preview images
   - Build curiosity without revealing everything

4. SOCIAL LINKS
   - "Follow for updates"
   - Twitter, Instagram, LinkedIn icons
   - Link to existing content if available

5. FOOTER
   - Copyright
   - Contact email
   - "Questions? Reach out at..."

DESIGN REQUIREMENTS:
- Full-screen hero
- Centered layout
- Dramatic but clean
- PM colors: #0a1628 dark navy, #3b82f6 accent blue
- Subtle animation (fade in, gentle pulse on CTA)
- Mobile-perfect

VIBE:
- Exclusive, exciting
- Something worth waiting for
- FOMO without being pushy

OUTPUT: Complete React component with email capture.
`;

export const comingSoonPageSections = [
  { id: 'hero', name: 'Hero', description: 'Logo, headline, countdown', required: true },
  { id: 'email-capture', name: 'Email Capture', description: 'Waitlist signup', required: true },
  { id: 'teaser', name: 'Teaser', description: 'What to expect', required: false },
  { id: 'social', name: 'Social Links', description: 'Follow for updates', required: false },
  { id: 'footer', name: 'Footer', description: 'Contact and copyright', required: true },
];

export default {
  id: 'coming-soon',
  name: 'Coming Soon',
  description: 'Pre-launch page with email capture',
  category: 'launch',
  thumbnail: '/templates/coming-soon/preview.png',
  prompt: comingSoonPagePrompt,
  sections: comingSoonPageSections,
};
