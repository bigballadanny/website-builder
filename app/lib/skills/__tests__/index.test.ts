/**
 * Marketing Skills Tests
 *
 * Tests for the marketing skill loaders including:
 * - Skill context retrieval for each template type
 * - Customer avatar context building
 * - Big idea/differentiator context building
 * - Framework content validation
 */

import { describe, it, expect } from 'vitest';
import { getSkillContext, buildAvatarContext, buildBigIdeaContext } from '~/lib/skills/index';
import type { TemplateId } from '~/templates';

describe('getSkillContext', () => {
  describe('Landing Page Skills', () => {
    it('returns AIDA framework for landing-page template', () => {
      const context = getSkillContext('landing-page');

      expect(context).toContain('AIDA Framework');
      expect(context).toContain('Attention');
      expect(context).toContain('Interest');
      expect(context).toContain('Desire');
      expect(context).toContain('Action');
    });

    it('includes hooks and headlines patterns', () => {
      const context = getSkillContext('landing-page');

      expect(context).toContain('Hooks & Headlines');
      expect(context).toContain('Pain-focused');
      expect(context).toContain('Benefit-focused');
      expect(context).toContain('Curiosity');
    });

    it('includes page CRO principles', () => {
      const context = getSkillContext('landing-page');

      expect(context).toContain('Page CRO Principles');
      expect(context).toContain('Single focused CTA');
      expect(context).toContain('Value proposition above the fold');
      expect(context).toContain('Social proof near CTAs');
    });

    it('includes copy guidelines', () => {
      const context = getSkillContext('landing-page');

      expect(context).toContain('Copy Guidelines');
      expect(context).toContain('"you" more than "we"');
      expect(context).toContain('Action verbs in CTAs');
    });
  });

  describe('Sales Page Skills', () => {
    it('returns PAS framework for sales-page template', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('PAS Framework');
      expect(context).toContain('Problem');
      expect(context).toContain('Agitation');
      expect(context).toContain('Solution');
    });

    it('includes long-form sales copy principles', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('Long-Form Sales Copy Principles');
      expect(context).toContain('Headlines do 80% of the work');
      expect(context).toContain('Future-pace the transformation');
    });

    it('includes offer architecture guidance', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('Offer Architecture');
      expect(context).toContain('Name the methodology');
      expect(context).toContain('Stack value');
      expect(context).toContain('Add bonuses');
    });

    it('includes copywriting techniques', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('Copywriting Techniques');
      expect(context).toContain('Open loops');
      expect(context).toContain('Pattern interrupt');
      expect(context).toContain('Bucket brigade');
    });

    it('includes section transitions', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('Section Transitions');
      expect(context).toContain("But here's the problem");
      expect(context).toContain('Imagine if you could');
    });
  });

  describe('Lead Magnet Skills', () => {
    it('returns lead magnet psychology for lead-magnet template', () => {
      const context = getSkillContext('lead-magnet');

      expect(context).toContain('Lead Magnet Psychology');
      expect(context).toContain('Give genuine value');
      expect(context).toContain('Quick win');
    });

    it('includes opt-in page principles', () => {
      const context = getSkillContext('lead-magnet');

      expect(context).toContain('Opt-in Page Principles');
      expect(context).toContain('Headline = What they GET');
      expect(context).toContain('Minimal friction');
    });

    it('includes value stacking guidance', () => {
      const context = getSkillContext('lead-magnet');

      expect(context).toContain('Value Stacking');
      expect(context).toContain('Use numbers');
    });

    it('includes urgency principles', () => {
      const context = getSkillContext('lead-magnet');

      expect(context).toContain('Urgency Principles');
      expect(context).toContain('Limited access');
    });
  });

  describe('Coming Soon Skills', () => {
    it('returns anticipation building for coming-soon template', () => {
      const context = getSkillContext('coming-soon');

      expect(context).toContain('Anticipation Building');
      expect(context).toContain("Tease, don't tell");
      expect(context).toContain('Be the first');
    });

    it('includes pre-launch principles', () => {
      const context = getSkillContext('coming-soon');

      expect(context).toContain('Pre-Launch Principles');
      expect(context).toContain('Waitlist');
      expect(context).toContain('Early bird promise');
    });

    it('includes social proof for launches', () => {
      const context = getSkillContext('coming-soon');

      expect(context).toContain('Social Proof for Launches');
      expect(context).toContain('Founder credibility');
    });

    it('includes visual hierarchy guidance', () => {
      const context = getSkillContext('coming-soon');

      expect(context).toContain('Visual Hierarchy');
      expect(context).toContain('Logo prominent');
    });
  });

  describe('Edge Cases', () => {
    it('returns empty string for unknown template', () => {
      const context = getSkillContext('unknown-template' as TemplateId);

      expect(context).toBe('');
    });

    it('returns non-empty string for all valid template IDs', () => {
      const templateIds: TemplateId[] = ['landing-page', 'sales-page', 'lead-magnet', 'coming-soon'];

      templateIds.forEach((id) => {
        const context = getSkillContext(id);
        expect(context.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('buildAvatarContext', () => {
  it('builds context with ideal customer', () => {
    const context = buildAvatarContext('Small business owners aged 30-50', 'Struggling with online marketing');

    expect(context).toContain('Target Customer Profile');
    expect(context).toContain('Small business owners aged 30-50');
  });

  it('builds context with problem solved', () => {
    const context = buildAvatarContext('Busy professionals', 'No time for meal planning');

    expect(context).toContain('Their main problem: No time for meal planning');
  });

  it('includes guidance on speaking to the customer', () => {
    const context = buildAvatarContext('Tech startups', 'Scaling challenges');

    expect(context).toContain('Write as if speaking directly to this person');
    expect(context).toContain('Use their language');
    expect(context).toContain('Feel their pain');
  });

  it('handles empty ideal customer', () => {
    const context = buildAvatarContext('', 'Some problem');

    expect(context).toContain('Who they are:');
    expect(context).toContain('Their main problem: Some problem');
  });

  it('handles empty problem solved', () => {
    const context = buildAvatarContext('Target audience', '');

    expect(context).toContain('Who they are: Target audience');
    expect(context).toContain('Their main problem:');
  });
});

describe('buildBigIdeaContext', () => {
  it('builds context with differentiators', () => {
    const context = buildBigIdeaContext('AI-powered analysis, 10x faster results');

    expect(context).toContain('Unique Mechanism');
    expect(context).toContain('AI-powered analysis, 10x faster results');
  });

  it('includes guidance on weaving differentiation', () => {
    const context = buildBigIdeaContext('Patented technology');

    expect(context).toContain('Weave this differentiation throughout the copy');
    expect(context).toContain("It's not just another");
  });

  it('returns empty string for empty differentiators', () => {
    const context = buildBigIdeaContext('');

    expect(context).toBe('');
  });

  it('returns empty string for undefined differentiators', () => {
    // TypeScript would catch this, but testing runtime behavior
    const context = buildBigIdeaContext(undefined as unknown as string);

    expect(context).toBe('');
  });

  it('handles multiline differentiators', () => {
    const differentiators = `- Unique methodology
- 15 years experience
- Featured in Forbes`;

    const context = buildBigIdeaContext(differentiators);

    expect(context).toContain('Unique methodology');
    expect(context).toContain('15 years experience');
    expect(context).toContain('Featured in Forbes');
  });
});

describe('Skill Context Quality', () => {
  const templateIds: TemplateId[] = ['landing-page', 'sales-page', 'lead-magnet', 'coming-soon'];

  templateIds.forEach((templateId) => {
    describe(`${templateId} template`, () => {
      it('contains marketing frameworks header', () => {
        const context = getSkillContext(templateId);
        expect(context).toContain('MARKETING FRAMEWORKS');
      });

      it('contains actionable guidance', () => {
        const context = getSkillContext(templateId);

        // All templates should have some form of principles or guidelines
        const hasActionableContent =
          context.includes('Principles') || context.includes('Guidelines') || context.includes('Framework');
        expect(hasActionableContent).toBe(true);
      });

      it('uses markdown-like formatting', () => {
        const context = getSkillContext(templateId);

        // Should use headers and bullet points
        expect(context).toMatch(/##.*\n/); // Contains ## headers
        expect(context).toMatch(/- /); // Contains bullet points
      });

      it('is reasonably sized for LLM context', () => {
        const context = getSkillContext(templateId);

        // Should be substantial but not overwhelming
        expect(context.length).toBeGreaterThan(500);
        expect(context.length).toBeLessThan(5000);
      });
    });
  });
});

describe('Integration Scenarios', () => {
  it('builds complete context for a landing page generation', () => {
    const skillContext = getSkillContext('landing-page');
    const avatarContext = buildAvatarContext('Busy professionals aged 25-45', 'No time for healthy cooking');
    const bigIdeaContext = buildBigIdeaContext('15-minute recipes designed by NASA nutritionists');

    const fullContext = `${skillContext}\n${avatarContext}\n${bigIdeaContext}`;

    // Verify all components are present
    expect(fullContext).toContain('AIDA Framework');
    expect(fullContext).toContain('Busy professionals aged 25-45');
    expect(fullContext).toContain('15-minute recipes');
    expect(fullContext).toContain('Unique Mechanism');
  });

  it('builds complete context for a sales page generation', () => {
    const skillContext = getSkillContext('sales-page');
    const avatarContext = buildAvatarContext('Entrepreneurs making $100k+', 'Stuck at revenue plateau');
    const bigIdeaContext = buildBigIdeaContext('The Revenue Acceleration System™');

    const fullContext = `${skillContext}\n${avatarContext}\n${bigIdeaContext}`;

    expect(fullContext).toContain('PAS Framework');
    expect(fullContext).toContain('Entrepreneurs making $100k+');
    expect(fullContext).toContain('Revenue Acceleration System');
  });

  it('handles lead magnet without differentiators gracefully', () => {
    const skillContext = getSkillContext('lead-magnet');
    const avatarContext = buildAvatarContext('Email marketers', 'Low open rates');
    const bigIdeaContext = buildBigIdeaContext(''); // No differentiator

    const fullContext = `${skillContext}\n${avatarContext}\n${bigIdeaContext}`;

    expect(fullContext).toContain('Lead Magnet Psychology');
    expect(fullContext).toContain('Email marketers');

    // Should not have Unique Mechanism section
    expect(fullContext).not.toContain('Unique Mechanism');
  });
});

describe('Template-Specific Marketing Frameworks', () => {
  describe('Landing Page - AIDA + CRO', () => {
    it('provides complete AIDA guidance', () => {
      const context = getSkillContext('landing-page');

      const aidaElements = [
        'Attention: Headline stops the scroll',
        'Interest: Subhead creates curiosity',
        'Desire: Benefits paint the transformation',
        'Action: CTA is clear and compelling',
      ];

      aidaElements.forEach((element) => {
        expect(context).toContain(element.split(':')[0]);
      });
    });
  });

  describe('Sales Page - PAS + Long-Form', () => {
    it('provides complete PAS guidance', () => {
      const context = getSkillContext('sales-page');

      expect(context).toContain('Problem: Paint the pain vividly');
      expect(context).toContain('Agitation');
      expect(context).toContain('Solution: Your offer as the bridge');
    });
  });

  describe('Lead Magnet - Value-First', () => {
    it('emphasizes value-first approach', () => {
      const context = getSkillContext('lead-magnet');

      expect(context).toContain('Give genuine value');
      expect(context).toContain('not a sales pitch');
      expect(context).toContain('Quick win');
    });
  });

  describe('Coming Soon - Anticipation', () => {
    it('focuses on building anticipation', () => {
      const context = getSkillContext('coming-soon');

      expect(context).toContain('Anticipation Building');
      expect(context).toContain('Tease');
      expect(context).toContain('ONE big promise');
    });
  });
});
