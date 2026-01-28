/**
 * Pocket Marketer Skills Bank
 * Internal methodology-based skills for enhancing AI outputs
 * Based on PM's proprietary frameworks (not exposed to users)
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'strategy' | 'copy' | 'conversion' | 'design' | 'technical';
  promptAddition: string;
  active?: boolean;
}

export const SKILLS_BANK: Skill[] = [
  // Strategy Skills (from Pocket Growth Strategist patterns)
  {
    id: 'cmo-thinking',
    name: 'CMO Strategy',
    description: 'Think like a Chief Marketing Officer - strategy first, then tactics',
    icon: '🧠',
    category: 'strategy',
    promptAddition: `Apply CMO-level strategic thinking:
- Start with WHO is the target buyer and WHAT they deeply want
- Define HOW the offer meets that need uniquely
- Establish WHY this is urgent and worth paying for now
- Map the customer journey from awareness to conversion
- Consider full funnel context, not just this single page`
  },
  {
    id: 'avatar-deep-dive',
    name: 'Customer Avatar',
    description: 'Deep understanding of the ideal buyer',
    icon: '👤',
    category: 'strategy',
    promptAddition: `Build for a specific customer avatar:
- Define their current painful situation vividly
- Identify their deepest desires and dreams
- Understand their objections and hesitations
- Speak to their identity and aspirations
- Use their language and terminology
- Address the gap between where they are and where they want to be`
  },

  // Copy Skills (from Pocket Copywriter patterns)
  {
    id: 'direct-response',
    name: 'Direct Response Copy',
    description: 'Persuasive copy that drives immediate action',
    icon: '✍️',
    category: 'copy',
    promptAddition: `Apply direct response copywriting principles:
- Lead with the transformation, not the product
- Use specific numbers and proof points
- Build desire before revealing the solution
- Handle objections elegantly within the copy
- Create urgency without being gimmicky
- End every section with forward momentum
- Write to ONE person, not an audience`
  },
  {
    id: 'big-idea',
    name: 'Big Idea Hook',
    description: 'Craft an irresistible central concept',
    icon: '💡',
    category: 'copy',
    promptAddition: `Develop a compelling Big Idea:
- Create a unique mechanism or approach that differentiates
- Make it intellectually interesting and emotionally resonant
- Ensure it's believable yet surprising
- Connect it to a larger trend or shift
- Make the reader feel they're discovering something new
- Build the entire page around this central concept`
  },
  {
    id: 'belief-building',
    name: 'Belief Building',
    description: 'Systematically build trust and overcome skepticism',
    icon: '🎯',
    category: 'copy',
    promptAddition: `Build beliefs systematically:
- Identify the key beliefs needed before they can buy
- Address "why this, why you, why now" questions
- Use social proof strategically (testimonials, numbers, logos)
- Include risk reversal (guarantees, trials)
- Show transformation stories from people like them
- Acknowledge their past failures without blame`
  },

  // Conversion Skills (from Offer Architect patterns)
  {
    id: 'offer-stack',
    name: 'Irresistible Offer',
    description: 'Structure offers that feel like no-brainers',
    icon: '💰',
    category: 'conversion',
    promptAddition: `Create an irresistible offer structure:
- Stack value visually (show everything they get)
- Anchor with a higher price point first
- Add bonuses that solve adjacent problems
- Include fast-action incentives
- Frame the price as an investment with ROI
- Make the guarantee remove all risk
- Calculate and display the total value clearly`
  },
  {
    id: 'funnel-aware',
    name: 'Funnel Context',
    description: 'Design for traffic temperature and funnel stage',
    icon: '🌡️',
    category: 'conversion',
    promptAddition: `Optimize for funnel position:
- For COLD traffic: Lead with problem/pain, build awareness
- For WARM traffic: Leverage existing relationship, go deeper on solution
- For HOT traffic: Focus on offer details, urgency, and CTA
- Match message sophistication to audience awareness
- Include appropriate trust-building for the stage
- Design the page for where they came from and where they're going next`
  },
  {
    id: 'lead-capture',
    name: 'Lead Magnet Mastery',
    description: 'Optimize for email capture and lead generation',
    icon: '📧',
    category: 'conversion',
    promptAddition: `Maximize lead capture:
- Offer immediate, specific value for the email
- Make the lead magnet solve a burning problem
- Use a compelling name that promises transformation
- Keep forms short (email only when possible)
- Show what they'll get immediately upon signup
- Include social proof near the form
- Create anticipation for what comes next`
  },

  // Design Skills
  {
    id: 'premium-design',
    name: 'Premium Polish',
    description: 'High-end design that builds trust instantly',
    icon: '✨',
    category: 'design',
    promptAddition: `Apply premium design principles:
- Generous whitespace and breathing room
- Consistent visual hierarchy throughout
- High-quality imagery with consistent treatment
- Subtle animations that enhance, not distract
- Professional typography (2 fonts max)
- Color palette that evokes the right emotion
- Mobile-first but beautiful on all devices`
  },
  {
    id: 'dark-theme',
    name: 'Dark Mode Excellence',
    description: 'Sophisticated dark design with proper contrast',
    icon: '🌙',
    category: 'design',
    promptAddition: `Design for dark mode excellence:
- Deep background (#0a1628 or darker)
- Proper contrast ratios for accessibility
- Subtle glow effects on interactive elements
- Gradient accents for visual interest
- Cards with subtle elevation through light, not shadows
- Avoid pure white text - use off-white (#f0f0f0)`
  },

  // Technical Skills
  {
    id: 'mobile-first',
    name: 'Mobile First',
    description: 'Designed for thumbs, scales up beautifully',
    icon: '📱',
    category: 'technical',
    promptAddition: `Build mobile-first:
- Touch-friendly tap targets (44px minimum)
- Thumb-zone consideration for CTAs
- Collapsible sections for mobile
- Fast load time optimized
- Single column layouts that stack well
- Test at 375px width first, then scale up`
  },
  {
    id: 'scroll-animations',
    name: 'Scroll Animations',
    description: 'Engaging reveal effects as users scroll',
    icon: '🎬',
    category: 'technical',
    promptAddition: `Add professional scroll animations:
- Fade-in reveals as sections enter viewport
- Subtle slide-up effects for content blocks
- Staggered animations for lists and grids
- Counter animations for statistics
- Smooth scroll for anchor links
- Keep animations subtle (0.3-0.5s, ease-out)`
  }
];

// Category metadata
export const SKILL_CATEGORIES = {
  strategy: { name: 'Strategy', icon: '🧠', color: '#3B82F6' },
  copy: { name: 'Copywriting', icon: '✍️', color: '#10B981' },
  conversion: { name: 'Conversion', icon: '🎯', color: '#F59E0B' },
  design: { name: 'Design', icon: '✨', color: '#8B5CF6' },
  technical: { name: 'Technical', icon: '⚙️', color: '#6366F1' },
};

export function getSkillsByCategory(category: Skill['category']): Skill[] {
  return SKILLS_BANK.filter(s => s.category === category);
}

export function buildEnhancedPrompt(basePrompt: string, activeSkills: Skill[]): string {
  if (activeSkills.length === 0) return basePrompt;
  
  const skillsContext = activeSkills
    .map(s => s.promptAddition)
    .join('\n\n');
  
  return `${basePrompt}

---
APPLY THESE POCKET MARKETER SKILLS:

${skillsContext}`;
}

// Default skills for different page types
export const DEFAULT_SKILLS_BY_TYPE = {
  'landing-page': ['cmo-thinking', 'direct-response', 'lead-capture', 'premium-design', 'mobile-first'],
  'sales-page': ['cmo-thinking', 'big-idea', 'offer-stack', 'belief-building', 'scroll-animations'],
  'lead-magnet': ['avatar-deep-dive', 'lead-capture', 'funnel-aware', 'mobile-first'],
  'coming-soon': ['big-idea', 'lead-capture', 'premium-design', 'dark-theme'],
};
