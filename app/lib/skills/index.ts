/**
 * Marketing Skill Loaders
 *
 * Extracts relevant marketing frameworks for template generation.
 * Based on Pocket Marketer's 10-tool system and marketing-mode skills.
 */

import type { TemplateId } from '~/templates';

/**
 * Get marketing frameworks relevant to a template type
 */
export function getSkillContext(templateId: TemplateId): string {
  const skills: Record<TemplateId, () => string> = {
    'landing-page': getLandingPageSkills,
    'sales-page': getSalesPageSkills,
    'lead-magnet': getLeadMagnetSkills,
    'coming-soon': getComingSoonSkills,
  };

  return skills[templateId]?.() || '';
}

/**
 * Landing Page: page-cro + hooks + AIDA
 */
function getLandingPageSkills(): string {
  return `
MARKETING FRAMEWORKS (Follow these principles):

## AIDA Framework
- Attention: Headline stops the scroll
- Interest: Subhead creates curiosity
- Desire: Benefits paint the transformation
- Action: CTA is clear and compelling

## Hooks & Headlines (use these patterns)
- Pain-focused: "Tired of [pain point]?"
- Benefit-focused: "Get [outcome] without [obstacle]"
- Curiosity: "The [adjective] way to [desire]"
- Social proof: "Join [X]+ [audience] who..."
- Specificity: Use numbers when possible

## Page CRO Principles
- Single focused CTA (don't give multiple choices)
- Value proposition above the fold
- Social proof near CTAs
- Risk reversal (guarantee, free trial) near final CTA
- Mobile-first (40%+ traffic is mobile)
- F-pattern reading: key info on left and top

## Copy Guidelines
- Use "you" more than "we"
- Lead with benefits, not features
- Short sentences, short paragraphs
- Use bullet points for scanability
- Action verbs in CTAs ("Get" > "Submit")
`;
}

/**
 * Sales Page: PAS framework + long-form copywriting
 */
function getSalesPageSkills(): string {
  return `
MARKETING FRAMEWORKS (Follow these principles):

## PAS Framework (Structure the page)
- Problem: Paint the pain vividly (make them feel it)
- Agitation: What happens if they don't solve it?
- Solution: Your offer as the bridge to transformation

## Long-Form Sales Copy Principles
1. Headlines do 80% of the work
2. Lead with the biggest pain/desire
3. Future-pace the transformation (help them visualize success)
4. Stack value before revealing price
5. Overcome objections in copy before they think them
6. Use testimonials as proof, not decoration

## Offer Architecture
- Name the methodology/system
- Break into components (modules, features, bonuses)
- Assign value to each component
- Show total value vs. investment
- Add bonuses to increase perceived value
- Include guarantee to reduce risk

## Copywriting Techniques
- Open loops (tease what's coming)
- Pattern interrupt (unexpected statements)
- Bucket brigade ("Here's the thing...")
- Power words: free, new, proven, secret, instant
- Emotional triggers: fear of missing out, desire for status

## Section Transitions
- "But here's the problem..."
- "That's exactly why we created..."
- "Imagine if you could..."
- "Here's what makes this different..."
`;
}

/**
 * Lead Magnet: Value-first + urgency psychology
 */
function getLeadMagnetSkills(): string {
  return `
MARKETING FRAMEWORKS (Follow these principles):

## Lead Magnet Psychology
- Give genuine value (not a sales pitch)
- Solve ONE specific problem completely
- Quick win: they should get results fast
- Demonstrate expertise through generosity

## Opt-in Page Principles
- Headline = What they GET (not what it IS)
  ✓ "7 Scripts to Close More Sales"
  ✗ "Free PDF Download"
- Bullet points = Specific outcomes
- Form = Minimal friction (name + email max)
- Below form = Trust signals + privacy note

## Value Stacking
- List what's inside with specificity
- Use numbers: "5 templates, 12 examples, 3 scripts"
- Highlight the "aha moment" they'll have

## Urgency Principles (use sparingly, authentically)
- Limited access works better than fake countdown
- "Join 500+ marketers" = social proof urgency
- "Instant access" = speed promise
`;
}

/**
 * Coming Soon: Anticipation + scarcity psychology
 */
function getComingSoonSkills(): string {
  return `
MARKETING FRAMEWORKS (Follow these principles):

## Anticipation Building
- Tease, don't tell everything
- Focus on ONE big promise
- Leave them wanting more
- "Be the first" = exclusivity trigger

## Pre-Launch Principles
- Waitlist = commitment device
- Early bird promise = reward for action
- Mystery creates curiosity
- Simple > complex (no distractions)

## Social Proof for Launches
- "Join X others waiting"
- Founder credibility mention
- Previous success indicators

## Visual Hierarchy
- Logo prominent (brand recognition)
- Headline: The promise
- Email capture: Only ask for email
- Social links: Secondary, not required
`;
}

/**
 * Customer Avatar context builder
 * Helps AI understand the target audience
 */
export function buildAvatarContext(idealCustomer: string, problemSolved: string): string {
  return `
## Target Customer Profile
Who they are: ${idealCustomer}
Their main problem: ${problemSolved}

Write as if speaking directly to this person.
Use their language. Feel their pain. Offer their desired transformation.
`;
}

/**
 * Big Idea/Differentiator context
 */
export function buildBigIdeaContext(differentiators: string): string {
  if (!differentiators) {
    return '';
  }

  return `
## Unique Mechanism
What makes this different: ${differentiators}

Weave this differentiation throughout the copy.
It's not just another [solution] - it's the [unique approach].
`;
}
