/**
 * PM Website Generation API
 *
 * Takes brand info, template, and styling - generates a complete landing page.
 */

import type { ActionFunction } from '@remix-run/cloudflare';
import Anthropic from '@anthropic-ai/sdk';
import { getTemplate, type TemplateId } from '~/templates';
import type { BrandDNA } from '~/lib/pm/types';
import type { ColorScheme } from '~/lib/pm/color-schemes';
import { getSkillContext, buildAvatarContext, buildBigIdeaContext } from '~/lib/skills';

interface StylingInput {
  colorScheme?: ColorScheme;
  font?: {
    id: string;
    name: string;
    family: string;
    style: string;
  };
}

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { templateId, brandInfo, styling } = body as {
      templateId: TemplateId;
      brandInfo: {
        businessName: string;
        businessDescription: string;
        idealCustomer: string;
        problemSolved: string;
        transformation: string;
        callToAction: string;
        socialProof?: string;
      };
      styling?: StylingInput;
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
      socialProof: brandInfo.socialProof || '',
      mainGoal: '',
    };

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || (context?.cloudflare?.env as any)?.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
    }

    // Build color scheme CSS
    const colors = styling?.colorScheme?.colors || {
      background: '#0a1628',
      surface: '#132743',
      primary: '#3b82f6',
      secondary: '#1e3a5f',
      accent: '#60a5fa',
      text: '#ffffff',
      textMuted: '#94a3b8',
      border: '#1e3a5f',
    };

    const fontFamily = styling?.font?.family || 'Inter, system-ui, sans-serif';
    const isDark = styling?.colorScheme?.isDark ?? true;

    // Generate with Claude
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert website generator for Pocket Marketer. 
Generate high-converting, professional marketing pages with a PREMIUM, EDITORIAL aesthetic (similar to Lovable or high-end SaaS landing pages).

CRITICAL DESIGN RULES:
1. Output ONLY raw HTML - no markdown, no code fences, no explanations.
2. Use Tailwind CSS via CDN for styling.
3. TYPOGRAPHY: Use a distinctive font pair. Use a Serif font (e.g., 'Playfair Display' or 'Instrument Serif') for headings and a clean Sans-serif (e.g., 'Inter' or 'DM Sans') for body text. 
4. SPACING: Use generous negative space. Avoid cramped layouts. Use py-24 or py-32 for sections.
5. VISUAL HIERARCHY: Use asymmetric layouts, overlapping elements, and subtle glassmorphism (backdrop-blur).
6. RADIUS: Use large border-radius (rounded-2xl or rounded-3xl) for cards and buttons.
7. ANIMATIONS: Include subtle entry animations using Tailwind's animate- classes or simple CSS transitions.
8. MOBILE-FIRST: Ensure perfectly responsive layouts. Stack columns on mobile (flex-col), use grid-cols-1 md:grid-cols-2 etc.
9. FORMS: Include a premium-looking form with action="https://formspree.io/f/placeholder" method="POST".

COLOR SCHEME (use these exact colors):
- Background: ${colors.background} (Use this for the main body bg)
- Surface/Cards: ${colors.surface} (Use for cards with subtle borders)
- Primary (buttons): ${colors.primary} (Use for main CTAs)
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}
- Text: ${colors.text}
- Muted text: ${colors.textMuted}
- Borders: ${colors.border} (Use very subtle borders, e.g., border-white/10)

IMPORTANT: Start your response directly with <!DOCTYPE html> and include all necessary head tags.`;

    const userPrompt = buildUserPrompt(template.id as TemplateId, brandDNA, colors, fontFamily, isDark);

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

    // Ensure it starts with DOCTYPE
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
      // Try to find the start of valid HTML
      const doctypeIndex = html.indexOf('<!DOCTYPE');
      const htmlIndex = html.indexOf('<html');

      if (doctypeIndex > 0) {
        html = html.substring(doctypeIndex);
      } else if (htmlIndex > 0) {
        html = '<!DOCTYPE html>\n' + html.substring(htmlIndex);
      } else {
        // Wrap in basic structure
        html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandInfo.businessName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: ${fontFamily}; }
  </style>
</head>
<body style="background-color: ${colors.background}; color: ${colors.text};">
${html}
</body>
</html>`;
      }
    }

    return new Response(JSON.stringify({ html }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(error instanceof Error ? error.message : 'Generation failed', { status: 500 });
  }
};

function buildUserPrompt(
  templateId: TemplateId,
  brandDNA: BrandDNA,
  colors: Record<string, string>,
  fontFamily: string,
  isDark: boolean,
): string {
  // Get marketing frameworks for this template type
  const skillContext = getSkillContext(templateId);
  const avatarContext = buildAvatarContext(brandDNA.idealCustomer, brandDNA.problemSolved);
  const bigIdeaContext = buildBigIdeaContext(brandDNA.differentiators);

  const baseContext = `
${skillContext}

${avatarContext}
${bigIdeaContext}

BRAND DETAILS:
- Business Name: ${brandDNA.companyName}
- What they do: ${brandDNA.businessDescription}
- Ideal Customer: ${brandDNA.idealCustomer}
- Problem Solved: ${brandDNA.problemSolved}
- Transformation: ${brandDNA.desiredTransformation}
- CTA: ${brandDNA.callToAction}
${brandDNA.socialProof ? `- Social Proof: ${brandDNA.socialProof}` : ''}

STYLING:
- Colors: Background ${colors.background}, Cards ${colors.surface}, Buttons ${colors.primary}, Text ${colors.text}
- Font: ${fontFamily}
- Theme: ${isDark ? 'Dark' : 'Light'}
`;

  switch (templateId) {
    case 'landing-page':
      return `${baseContext}

Generate a LANDING PAGE with these sections:

1. HERO SECTION (full viewport height on desktop)
   - Bold headline addressing customer pain/desire
   - Subheadline explaining the solution (1-2 sentences)
   - Primary CTA button: "${brandDNA.callToAction}"
   - Trust indicator below CTA (if social proof provided)

2. PAIN POINTS SECTION
   - "Sound familiar?" intro
   - 3 pain points with icons (use emoji or simple SVG)
   - Make them feel understood

3. SOLUTION SECTION  
   - "Here's how we help" intro
   - 3 simple steps with numbers
   - Brief description for each

4. BENEFITS SECTION
   - 3-4 outcome-focused benefits
   - Use cards with icons
   - Focus on transformation, not features

5. SOCIAL PROOF (if provided, otherwise use placeholder)
   - Testimonial cards or trust badges
   - Customer results/stats

6. FINAL CTA SECTION
   - Recap the transformation
   - Same CTA button
   - Risk reversal (free trial, guarantee, etc.)

7. FOOTER
   - Logo/company name
   - Copyright ${new Date().getFullYear()}
   - Privacy & Terms links (can be # placeholders)

Output complete, valid HTML.`;

    case 'sales-page':
      return `${baseContext}

Generate a LONG-FORM SALES PAGE with these sections:

1. HERO - Big promise headline, qualifier subhead, CTA
2. PROBLEM - Paint the pain (3-4 specific struggles)
3. AGITATION - What happens if nothing changes?
4. SOLUTION - Introduce your offer as the bridge
5. FEATURES/BENEFITS - 5-6 items, each feature→benefit
6. HOW IT WORKS - 3 simple steps
7. SOCIAL PROOF - Testimonials (use placeholders if none)
8. PRICING/OFFER - Clear value proposition
9. FAQ - 4-5 objection-handling questions
10. GUARANTEE - Risk reversal
11. FINAL CTA - Urgency + main CTA
12. FOOTER

Make it compelling and conversion-focused. Output complete HTML.`;

    case 'lead-magnet':
      return `${baseContext}

Generate a LEAD MAGNET OPT-IN PAGE with:

1. HERO with EMAIL FORM
   - Headline about the FREE resource
   - "Get instant access to [resource]"
   - Form with Name + Email + Submit button
   - Use form action="https://formspree.io/f/placeholder" method="POST"
   - Add honeypot: <input type="text" name="_gotcha" style="display:none">

2. WHAT'S INSIDE
   - "Inside this [guide/checklist], you'll discover:"
   - 4-5 bullet points with checkmarks
   - Specific, outcome-focused

3. WHO THIS IS FOR
   - "Perfect for you if..."
   - 3-4 qualifying bullet points

4. BRIEF ABOUT/CREDIBILITY
   - Why trust this resource
   - Quick credential mention

5. SIMPLE FOOTER
   - "We respect your privacy" note
   - Copyright

Keep it SIMPLE and FOCUSED on conversion. Single-column, no distractions.
Output complete HTML with working form.`;

    case 'coming-soon':
      return `${baseContext}

Generate a COMING SOON / PRE-LAUNCH PAGE:

1. CENTERED HERO (full viewport)
   - Logo or company name prominent
   - "Coming Soon" or creative variant
   - One powerful headline about what's coming
   - 1-2 sentence teaser

2. EMAIL WAITLIST FORM
   - "Be the first to know"
   - Email input + Submit button ("Join Waitlist")
   - Form action="https://formspree.io/f/placeholder" method="POST"
   - Add honeypot field
   - Optional: "Join 500+ others" social proof

3. WHAT TO EXPECT (optional, 3 teaser items)
   - Feature icons
   - Brief descriptions
   - Build anticipation

4. SOCIAL LINKS (optional)
   - "Follow for updates"
   - Twitter, Instagram, etc. (placeholder links)

5. MINIMAL FOOTER
   - Contact email
   - Copyright

Make it EXCITING and EXCLUSIVE feeling.
Full-screen hero, centered layout.
Output complete HTML.`;

    default:
      return `${baseContext}
Generate a professional marketing landing page with hero, features, CTA, and footer.
Output complete HTML.`;
  }
}
