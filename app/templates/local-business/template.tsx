/**
 * Local Business Template
 * For restaurants, clinics, gyms, salons, and local services
 *
 * Sections:
 * 1. Hero - Business name, what you do, location
 * 2. Services/Menu - What you offer
 * 3. About - Your story
 * 4. Hours & Location - When and where
 * 5. Reviews - Customer testimonials
 * 6. Contact/Book - Call to action
 * 7. Footer
 */

import type { BrandDNA } from '~/lib/pm/types';

export interface LocalBusinessProps {
  brandDNA: BrandDNA;
  businessType?: 'restaurant' | 'clinic' | 'gym' | 'salon' | 'general';
  customizations?: {
    showMenu?: boolean;
    showBooking?: boolean;
    showMap?: boolean;
    showGallery?: boolean;
  };
}

export const localBusinessPrompt = (brandDNA: BrandDNA) => `
Generate a local business website for attracting nearby customers.

BRAND CONTEXT:
- Business Name: ${brandDNA.companyName}
- Type: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Services/Products: ${brandDNA.offering}
- What makes you different: ${brandDNA.differentiators}
- CTA: ${brandDNA.callToAction}

STRUCTURE:

1. HERO SECTION
   - Business name prominently displayed
   - Tagline: What you do + for whom
   - Location hint: "Serving [City/Area]"
   - Primary CTA: "Book Now", "Call Us", "View Menu", etc.
   - Hero image of storefront, team, or product
   - Quick info bar: Phone | Hours | Address

2. SERVICES / MENU SECTION
   - "Our Services" or "Menu" or "What We Offer"
   - Grid or list of services/items with:
     - Name
     - Brief description
     - Price (if applicable)
     - Icon or image
   - Clear categories if needed

3. ABOUT US
   - Brief story: Who you are, why you started
   - Team photo or owner bio
   - What makes you special
   - Years in business, community involvement

4. HOURS & LOCATION
   - Operating hours (table format)
   - Address with map placeholder
   - Parking info (if relevant)
   - "Get Directions" button

5. REVIEWS SECTION
   ${brandDNA.socialProof ? `Use: ${brandDNA.socialProof}` : 'Placeholder for Google/Yelp reviews'}
   - Star rating display
   - 3-4 customer testimonials
   - Link to full reviews on Google/Yelp

6. CONTACT / BOOKING SECTION
   - "Ready to Visit?" or "Book Your Appointment"
   - Contact form OR booking button
   - Phone number (click-to-call on mobile)
   - Email address
   - Social media links

7. FOOTER
   - Logo
   - Quick links
   - Hours summary
   - Address
   - Phone
   - Social links
   - Copyright

DESIGN REQUIREMENTS:
- Warm, inviting feel (local business vibe)
- Easy to scan on mobile (most local searches are mobile)
- Click-to-call phone numbers
- PM colors: #0a1628 background, #132743 cards, #3b82f6 accent
- Large touch targets for mobile
- Fast loading (no heavy animations)
- Clear hierarchy: Name → What → Where → When → Why

LOCAL SEO ELEMENTS:
- Include city/neighborhood in headlines
- Structured for Google My Business
- Clear NAP (Name, Address, Phone)

OUTPUT: Complete React component optimized for local discovery.
`;

export const localBusinessSections = [
  { id: 'hero', name: 'Hero', description: 'Business intro with location', required: true },
  { id: 'services', name: 'Services/Menu', description: 'What you offer', required: true },
  { id: 'about', name: 'About', description: 'Your story', required: true },
  { id: 'hours-location', name: 'Hours & Location', description: 'When and where', required: true },
  { id: 'reviews', name: 'Reviews', description: 'Customer testimonials', required: true },
  { id: 'contact', name: 'Contact/Book', description: 'Call to action', required: true },
  { id: 'footer', name: 'Footer', description: 'Links and info', required: true },
];

export default {
  id: 'local-business',
  name: 'Local Business',
  description: 'Website for restaurants, clinics, salons, and local services',
  category: 'local',
  thumbnail: '/templates/local-business/preview.png',
  prompt: localBusinessPrompt,
  sections: localBusinessSections,
};
