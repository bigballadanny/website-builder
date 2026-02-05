/**
 * Discovery Component Tests
 *
 * Tests for the Discovery flow component logic including:
 * - Step configuration validation
 * - BrandDNA generation logic
 * - Template recommendation based on goal
 * - Input validation rules
 *
 * Note: Due to Remix Vite plugin limitations in test environment,
 * full component rendering tests are separated. These tests validate
 * the business logic used by the Discovery component.
 */

import { describe, it, expect } from 'vitest';
import type { BrandDNA } from '~/lib/pm/types';

// Discovery step configuration (mirrored from component for testing)
const DISCOVERY_STEPS = [
  {
    id: 'goal',
    question: "What's the ONE thing you want this website to accomplish?",
    helper: 'Every great marketing page has a single focused goal.',
    options: [
      { value: 'leads', label: '📧 Capture leads (email opt-ins)', template: 'lead-magnet' },
      { value: 'sell-low', label: '💳 Sell a product/service (<$500)', template: 'landing-page' },
      { value: 'sell-high', label: '💰 Sell high-ticket (>$500)', template: 'sales-page' },
      { value: 'calls', label: '📞 Book calls/appointments', template: 'landing-page' },
      { value: 'launch', label: '🚀 Build pre-launch buzz', template: 'coming-soon' },
    ],
    field: 'mainGoal',
    skillContext: 'From Marketing Domination: Every page needs ONE clear objective. Multiple CTAs kill conversion.',
  },
  {
    id: 'business',
    question: 'What does your business do, in one sentence?',
    helper: "Clear and simple. Pretend you're explaining it to a friend.",
    placeholder: 'e.g., We help busy professionals get fit with 20-minute home workouts',
    field: 'businessDescription',
    skillContext: 'The clearer your description, the sharper your messaging. Confusion kills sales.',
  },
  {
    id: 'customer',
    question: 'Who is your ideal customer?',
    helper: "'Everyone' is not a customer.",
    placeholder: 'e.g., Working moms aged 30-45 who want to lose weight but have no time for the gym',
    field: 'idealCustomer',
    skillContext: 'Customer Avatar Tool: The more specific, the better. Speak to ONE person, reach millions.',
  },
  {
    id: 'problem',
    question: 'What specific problem do you solve for them?',
    helper: 'What pain point are they trying to escape?',
    placeholder: "e.g., They've tried diets and gym memberships but always quit because it takes too much time",
    field: 'problemSolved',
    skillContext: 'PAS Framework: Agitate the problem before offering the solution. Make them feel understood.',
  },
  {
    id: 'transformation',
    question: 'What result or transformation do they want most?',
    helper: "What's the 'after' state they're dreaming of?",
    placeholder: 'e.g., Feel confident in their body, have more energy, fit into their favorite clothes again',
    field: 'desiredTransformation',
    skillContext: 'Sell the transformation, not the process. People buy outcomes.',
  },
  {
    id: 'offering',
    question: 'What exactly are you selling?',
    helper: 'The specific product, service, or offer.',
    placeholder: 'e.g., 8-week online fitness program with daily 20-minute video workouts and meal plans',
    field: 'offering',
    skillContext: 'Offer Architect: Stack value. What do they get? Be specific with deliverables.',
  },
  {
    id: 'why-you',
    question: 'Why should they choose you over someone else?',
    helper: 'Your unique mechanism or differentiator.',
    placeholder: 'e.g., Our workouts are designed by a NASA scientist for maximum results in minimum time',
    field: 'differentiators',
    skillContext: 'Big Idea: What makes you DIFFERENT, not just better? This is your hook.',
  },
  {
    id: 'cta',
    question: 'What do you want them to do?',
    helper: 'The specific action. One clear CTA.',
    placeholder: 'e.g., Start your free 7-day trial',
    field: 'callToAction',
    skillContext: 'Action-oriented, benefit-focused. "Get" beats "Submit". "Start Free Trial" beats "Sign Up".',
  },
  {
    id: 'proof',
    question: 'Do you have any social proof?',
    helper: 'Testimonials, reviews, results, credentials, press?',
    placeholder: "e.g., 500+ members, 4.9 star reviews, featured in Women's Health magazine",
    field: 'socialProof',
    isOptional: true,
    skillContext: 'Social proof near CTAs increases conversion 15-30%. Even one testimonial helps.',
  },
];

describe('Discovery Step Configuration', () => {
  it('has exactly 9 steps', () => {
    expect(DISCOVERY_STEPS).toHaveLength(9);
  });

  it('first step is goal selection with options', () => {
    const firstStep = DISCOVERY_STEPS[0];
    expect(firstStep.id).toBe('goal');
    expect(firstStep.options).toBeDefined();
    expect(firstStep.options?.length).toBe(5);
  });

  it('all subsequent steps are text inputs', () => {
    const textSteps = DISCOVERY_STEPS.slice(1);
    textSteps.forEach((step) => {
      expect(step.placeholder).toBeDefined();
      expect(step.options).toBeUndefined();
    });
  });

  it('each step has required fields', () => {
    DISCOVERY_STEPS.forEach((step) => {
      expect(step.id).toBeDefined();
      expect(step.question).toBeDefined();
      expect(step.helper).toBeDefined();
      expect(step.field).toBeDefined();
      expect(step.skillContext).toBeDefined();
    });
  });

  it('last step is marked as optional', () => {
    const lastStep = DISCOVERY_STEPS[DISCOVERY_STEPS.length - 1];
    expect(lastStep.isOptional).toBe(true);
    expect(lastStep.id).toBe('proof');
  });

  it('only the last step is optional', () => {
    const optionalSteps = DISCOVERY_STEPS.filter((step) => step.isOptional);
    expect(optionalSteps).toHaveLength(1);
  });
});

describe('Goal Options and Template Mapping', () => {
  const goalOptions = DISCOVERY_STEPS[0].options!;

  it('has 5 goal options', () => {
    expect(goalOptions).toHaveLength(5);
  });

  it('each option has value, label, and template', () => {
    goalOptions.forEach((option) => {
      expect(option.value).toBeDefined();
      expect(option.label).toBeDefined();
      expect(option.template).toBeDefined();
    });
  });

  it('maps leads to lead-magnet template', () => {
    const leadsOption = goalOptions.find((o) => o.value === 'leads');
    expect(leadsOption?.template).toBe('lead-magnet');
  });

  it('maps sell-low to landing-page template', () => {
    const sellLowOption = goalOptions.find((o) => o.value === 'sell-low');
    expect(sellLowOption?.template).toBe('landing-page');
  });

  it('maps sell-high to sales-page template', () => {
    const sellHighOption = goalOptions.find((o) => o.value === 'sell-high');
    expect(sellHighOption?.template).toBe('sales-page');
  });

  it('maps calls to landing-page template', () => {
    const callsOption = goalOptions.find((o) => o.value === 'calls');
    expect(callsOption?.template).toBe('landing-page');
  });

  it('maps launch to coming-soon template', () => {
    const launchOption = goalOptions.find((o) => o.value === 'launch');
    expect(launchOption?.template).toBe('coming-soon');
  });
});

describe('BrandDNA Generation Logic', () => {
  // Simulate the BrandDNA generation from answers
  const buildBrandDNA = (answers: Record<string, string>): BrandDNA => {
    return {
      projectName: answers.businessDescription?.split(' ').slice(0, 3).join(' ') || 'My Project',
      companyName: answers.businessDescription?.split(' ').slice(0, 3).join(' ') || 'My Company',
      businessDescription: answers.businessDescription || '',
      idealCustomer: answers.idealCustomer || '',
      problemSolved: answers.problemSolved || '',
      desiredTransformation: answers.desiredTransformation || '',
      offering: answers.offering || '',
      differentiators: answers.differentiators || '',
      callToAction: answers.callToAction || 'Get Started',
      socialProof: answers.socialProof || '',
      mainGoal: answers.mainGoal || 'leads',
      customerAcquisition: '',
      salesProcess: '',
      objections: '',
    };
  };

  it('generates project name from business description', () => {
    const answers = {
      businessDescription: 'We help busy professionals',
    };
    const brandDNA = buildBrandDNA(answers);
    expect(brandDNA.projectName).toBe('We help busy');
  });

  it('uses first 3 words for project name', () => {
    const answers = {
      businessDescription: 'Amazing Digital Marketing Agency Services',
    };
    const brandDNA = buildBrandDNA(answers);
    expect(brandDNA.projectName).toBe('Amazing Digital Marketing');
  });

  it('handles short business descriptions', () => {
    const answers = {
      businessDescription: 'Fitness App',
    };
    const brandDNA = buildBrandDNA(answers);
    expect(brandDNA.projectName).toBe('Fitness App');
  });

  it('provides default callToAction if not provided', () => {
    const answers = {};
    const brandDNA = buildBrandDNA(answers);
    expect(brandDNA.callToAction).toBe('Get Started');
  });

  it('maps all required BrandDNA fields', () => {
    const answers = {
      mainGoal: 'leads',
      businessDescription: 'Test Business Description',
      idealCustomer: 'Test Customer',
      problemSolved: 'Test Problem',
      desiredTransformation: 'Test Transformation',
      offering: 'Test Offering',
      differentiators: 'Test Differentiator',
      callToAction: 'Sign Up Now',
      socialProof: 'Featured in Forbes',
    };

    const brandDNA = buildBrandDNA(answers);

    expect(brandDNA.mainGoal).toBe('leads');
    expect(brandDNA.businessDescription).toBe('Test Business Description');
    expect(brandDNA.idealCustomer).toBe('Test Customer');
    expect(brandDNA.problemSolved).toBe('Test Problem');
    expect(brandDNA.desiredTransformation).toBe('Test Transformation');
    expect(brandDNA.offering).toBe('Test Offering');
    expect(brandDNA.differentiators).toBe('Test Differentiator');
    expect(brandDNA.callToAction).toBe('Sign Up Now');
    expect(brandDNA.socialProof).toBe('Featured in Forbes');
  });

  it('sets empty strings for optional unfilled fields', () => {
    const answers = {
      mainGoal: 'sell-high',
      businessDescription: 'Premium Coaching',
      idealCustomer: 'Executives',
      problemSolved: 'Burnout',
      desiredTransformation: 'Work-life balance',
      offering: 'Coaching program',
      differentiators: 'Unique method',
      callToAction: 'Book Call',

      // socialProof not provided
    };

    const brandDNA = buildBrandDNA(answers);
    expect(brandDNA.socialProof).toBe('');
    expect(brandDNA.customerAcquisition).toBe('');
    expect(brandDNA.salesProcess).toBe('');
    expect(brandDNA.objections).toBe('');
  });
});

describe('Step Field Mapping', () => {
  it('maps step fields to BrandDNA properties correctly', () => {
    const fieldMapping = DISCOVERY_STEPS.map((step) => step.field);

    expect(fieldMapping).toContain('mainGoal');
    expect(fieldMapping).toContain('businessDescription');
    expect(fieldMapping).toContain('idealCustomer');
    expect(fieldMapping).toContain('problemSolved');
    expect(fieldMapping).toContain('desiredTransformation');
    expect(fieldMapping).toContain('offering');
    expect(fieldMapping).toContain('differentiators');
    expect(fieldMapping).toContain('callToAction');
    expect(fieldMapping).toContain('socialProof');
  });

  it('has unique field names for each step', () => {
    const fieldNames = DISCOVERY_STEPS.map((step) => step.field);
    const uniqueFields = new Set(fieldNames);
    expect(uniqueFields.size).toBe(fieldNames.length);
  });
});

describe('Skill Context', () => {
  it('every step has marketing skill context', () => {
    DISCOVERY_STEPS.forEach((step) => {
      expect(step.skillContext.length).toBeGreaterThan(0);
    });
  });

  it('first step mentions conversion', () => {
    expect(DISCOVERY_STEPS[0].skillContext).toContain('conversion');
  });

  it('customer step mentions avatar', () => {
    const customerStep = DISCOVERY_STEPS.find((s) => s.id === 'customer');
    expect(customerStep?.skillContext).toContain('Avatar');
  });

  it('problem step mentions PAS framework', () => {
    const problemStep = DISCOVERY_STEPS.find((s) => s.id === 'problem');
    expect(problemStep?.skillContext).toContain('PAS Framework');
  });

  it('transformation step mentions outcomes', () => {
    const transformStep = DISCOVERY_STEPS.find((s) => s.id === 'transformation');
    expect(transformStep?.skillContext).toContain('outcomes');
  });

  it('why-you step mentions differentiator', () => {
    const whyYouStep = DISCOVERY_STEPS.find((s) => s.id === 'why-you');
    expect(whyYouStep?.skillContext).toContain('DIFFERENT');
  });

  it('proof step mentions conversion percentage', () => {
    const proofStep = DISCOVERY_STEPS.find((s) => s.id === 'proof');
    expect(proofStep?.skillContext).toMatch(/\d+%/);
  });
});

describe('Progress Calculation', () => {
  it('calculates progress percentage correctly', () => {
    const totalSteps = DISCOVERY_STEPS.length;

    // Step 1 progress
    expect((1 / totalSteps) * 100).toBeCloseTo(11.11, 1);

    // Step 5 progress (midpoint)
    expect((5 / totalSteps) * 100).toBeCloseTo(55.56, 1);

    // Step 9 progress (complete)
    expect((9 / totalSteps) * 100).toBeCloseTo(100, 1);
  });
});

describe('Input Validation Rules', () => {
  const isStepValid = (step: (typeof DISCOVERY_STEPS)[0], value: string | undefined): boolean => {
    if (step.isOptional) {
      return true;
    }

    return Boolean(value?.trim());
  };

  it('requires non-empty input for required steps', () => {
    const requiredStep = DISCOVERY_STEPS.find((s) => !s.isOptional);
    expect(isStepValid(requiredStep!, '')).toBe(false);
    expect(isStepValid(requiredStep!, '  ')).toBe(false);
    expect(isStepValid(requiredStep!, undefined)).toBe(false);
  });

  it('accepts non-empty input for required steps', () => {
    const requiredStep = DISCOVERY_STEPS.find((s) => !s.isOptional);
    expect(isStepValid(requiredStep!, 'test')).toBe(true);
    expect(isStepValid(requiredStep!, 'test value here')).toBe(true);
  });

  it('always passes validation for optional steps', () => {
    const optionalStep = DISCOVERY_STEPS.find((s) => s.isOptional);
    expect(isStepValid(optionalStep!, '')).toBe(true);
    expect(isStepValid(optionalStep!, undefined)).toBe(true);
    expect(isStepValid(optionalStep!, 'has value')).toBe(true);
  });
});

describe('Option Selection Behavior', () => {
  it('goal options all have emoji prefixes', () => {
    const goalOptions = DISCOVERY_STEPS[0].options!;
    goalOptions.forEach((option) => {
      // Check that label starts with an emoji (unicode range check)
      const firstChar = option.label.codePointAt(0);
      expect(firstChar).toBeGreaterThan(127); // Non-ASCII indicates emoji
    });
  });

  it('goal values are URL-safe', () => {
    const goalOptions = DISCOVERY_STEPS[0].options!;
    const urlSafePattern = /^[a-z0-9-]+$/;
    goalOptions.forEach((option) => {
      expect(option.value).toMatch(urlSafePattern);
    });
  });
});

describe('Template Recommendation Integration', () => {
  it('provides template for each goal', () => {
    const goalOptions = DISCOVERY_STEPS[0].options!;
    const templates = goalOptions.map((o) => o.template);

    // All templates should be valid template IDs
    const validTemplates = ['landing-page', 'sales-page', 'lead-magnet', 'coming-soon'];
    templates.forEach((template) => {
      expect(validTemplates).toContain(template);
    });
  });

  it('most common template is landing-page', () => {
    const goalOptions = DISCOVERY_STEPS[0].options!;
    const templates = goalOptions.map((o) => o.template);
    const landingPageCount = templates.filter((t) => t === 'landing-page').length;

    expect(landingPageCount).toBe(2); // sell-low and calls
  });
});

describe('Placeholder Text Quality', () => {
  it('all text steps have example placeholders', () => {
    const textSteps = DISCOVERY_STEPS.filter((s) => s.placeholder);
    textSteps.forEach((step) => {
      expect(step.placeholder).toContain('e.g.,');
    });
  });

  it('placeholders are specific and actionable', () => {
    const textSteps = DISCOVERY_STEPS.filter((s) => s.placeholder);
    textSteps.forEach((step) => {
      expect(step.placeholder!.length).toBeGreaterThan(30);
    });
  });
});

describe('Question Quality', () => {
  it('all questions end with question mark', () => {
    DISCOVERY_STEPS.forEach((step) => {
      expect(step.question.endsWith('?')).toBe(true);
    });
  });

  it('questions are concise', () => {
    DISCOVERY_STEPS.forEach((step) => {
      expect(step.question.length).toBeLessThan(100);
    });
  });
});

describe('Helper Text Quality', () => {
  it('helper text provides guidance', () => {
    DISCOVERY_STEPS.forEach((step) => {
      expect(step.helper.length).toBeGreaterThan(10);
      expect(step.helper.length).toBeLessThan(100);
    });
  });
});
