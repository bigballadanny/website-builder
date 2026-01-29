/**
 * Agency Portfolio Template
 * Showcase agency work, services, and team
 *
 * Sections:
 * 1. Hero - Bold agency introduction
 * 2. Services - What you offer
 * 3. Case Studies - Portfolio/work samples
 * 4. About - Team and story
 * 5. Testimonials - Client feedback
 * 6. Contact - Get in touch
 * 7. Footer
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface AgencyPortfolioProps {
  brandDNA: BrandDNA;
  customizations?: {
    heroStyle?: 'bold' | 'minimal' | 'creative';
    showTeam?: boolean;
    caseStudyCount?: number;
  };
}

export const agencyPortfolioPrompt = (brandDNA: BrandDNA) => `
Generate a professional agency portfolio website.

BRAND CONTEXT:
- Agency Name: ${brandDNA.companyName}
- Description: ${brandDNA.businessDescription}
- Target Clients: ${brandDNA.idealCustomer}
- Services: ${brandDNA.offering}
- Differentiators: ${brandDNA.differentiators}
- CTA: ${brandDNA.callToAction}

STRUCTURE:

1. HERO SECTION
   - Bold, confident headline showcasing expertise
   - Brief tagline about what you do
   - Primary CTA button
   - Optional: Hero image/video or animated background
   - Navigation: Logo, Services, Work, About, Contact

2. SERVICES SECTION
   - "What We Do" or "Our Services"
   - 3-6 service cards with:
     - Icon
     - Service name
     - Brief description
   - Link to learn more about each

3. CASE STUDIES / PORTFOLIO
   - "Our Work" or "Featured Projects"
   - 3-6 project cards with:
     - Project image/thumbnail
     - Client name (or project type)
     - Brief result or description
     - "View Case Study" link
   - Grid layout, hover effects

4. ABOUT SECTION
   - Agency story and mission
   - Why clients trust you
   - Optional: Team member photos/bios
   - Statistics (years in business, projects completed, etc.)

5. TESTIMONIALS
   ${brandDNA.socialProof ? `Use: ${brandDNA.socialProof}` : 'Placeholder for client testimonials'}
   - Client logo carousel (if available)
   - 2-3 featured testimonials with:
     - Quote
     - Client name and title
     - Company logo (optional)

6. CONTACT SECTION
   - "Let's Work Together" or "Start a Project"
   - Contact form: Name, Email, Company, Project Brief
   - Alternative: Email and phone
   - Office location (if applicable)

7. FOOTER
   - Logo
   - Service links
   - Social media links
   - Copyright

DESIGN REQUIREMENTS:
- Modern, professional aesthetic
- Bold typography for headlines
- Plenty of whitespace
- PM colors: #0a1628 background, #132743 cards, #3b82f6 accent
- Smooth scroll between sections
- Mobile-responsive
- Subtle animations on scroll

OUTPUT: Complete React component with Tailwind classes.
`;

export const agencyPortfolioSections = [
  { id: 'hero', name: 'Hero', description: 'Bold agency introduction', required: true },
  { id: 'services', name: 'Services', description: 'What you offer', required: true },
  { id: 'portfolio', name: 'Case Studies', description: 'Featured projects', required: true },
  { id: 'about', name: 'About', description: 'Team and story', required: true },
  { id: 'testimonials', name: 'Testimonials', description: 'Client feedback', required: false },
  { id: 'contact', name: 'Contact', description: 'Get in touch form', required: true },
  { id: 'footer', name: 'Footer', description: 'Links and copyright', required: true },
];

export default {
  id: 'agency-portfolio',
  name: 'Agency Portfolio',
  description: 'Professional portfolio site for agencies and studios',
  category: 'portfolio',
  thumbnail: '/templates/agency-portfolio/preview.png',
  prompt: agencyPortfolioPrompt,
  sections: agencyPortfolioSections,
};
