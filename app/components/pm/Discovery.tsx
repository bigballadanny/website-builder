/**
 * Discovery Flow Component
 * 
 * Enhanced version of PM's Interview questions with marketing skill guidance.
 * Used when user enters Website Builder without PM project context.
 * 
 * Maps to PM's 12 Interview Questions + adds skill-based enhancements.
 */

import { useState } from 'react';
import type { BrandDNA } from '~/lib/pm/types';

interface DiscoveryProps {
  onComplete: (brandDNA: BrandDNA) => void;
  onSkip?: () => void;
  initialData?: Partial<BrandDNA>;
}

// Discovery steps with marketing skill context
const DISCOVERY_STEPS = [
  {
    id: 'goal',
    question: "What's the ONE thing you want this website to accomplish?",
    helper: "Every great marketing page has a single focused goal.",
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
    question: "What does your business do, in one sentence?",
    helper: "Clear and simple. Pretend you're explaining it to a friend.",
    placeholder: "e.g., We help busy professionals get fit with 20-minute home workouts",
    field: 'businessDescription',
    skillContext: 'The clearer your description, the sharper your messaging. Confusion kills sales.',
  },
  {
    id: 'customer',
    question: "Who is your ideal customer?",
    helper: "Be specific. 'Everyone' is not a customer.",
    placeholder: "e.g., Working moms aged 30-45 who want to lose weight but have no time for the gym",
    field: 'idealCustomer',
    skillContext: 'Customer Avatar Tool: The more specific, the better. Speak to ONE person, reach millions.',
  },
  {
    id: 'problem',
    question: "What specific problem do you solve for them?",
    helper: "What pain point are they trying to escape?",
    placeholder: "e.g., They've tried diets and gym memberships but always quit because it takes too much time",
    field: 'problemSolved',
    skillContext: 'PAS Framework: Agitate the problem before offering the solution. Make them feel understood.',
  },
  {
    id: 'transformation',
    question: "What result or transformation do they want most?",
    helper: "What's the 'after' state they're dreaming of?",
    placeholder: "e.g., Feel confident in their body, have more energy, fit into their favorite clothes again",
    field: 'desiredTransformation',
    skillContext: 'Sell the transformation, not the process. People buy outcomes.',
  },
  {
    id: 'offering',
    question: "What exactly are you selling?",
    helper: "The specific product, service, or offer.",
    placeholder: "e.g., 8-week online fitness program with daily 20-minute video workouts and meal plans",
    field: 'offering',
    skillContext: 'Offer Architect: Stack value. What do they get? Be specific with deliverables.',
  },
  {
    id: 'why-you',
    question: "Why should they choose you over someone else?",
    helper: "Your unique mechanism or differentiator.",
    placeholder: "e.g., Our workouts are designed by a NASA scientist for maximum results in minimum time",
    field: 'differentiators',
    skillContext: 'Big Idea: What makes you DIFFERENT, not just better? This is your hook.',
  },
  {
    id: 'cta',
    question: "What do you want them to do?",
    helper: "The specific action. One clear CTA.",
    placeholder: "e.g., Start your free 7-day trial",
    field: 'callToAction',
    skillContext: 'Action-oriented, benefit-focused. "Get" beats "Submit". "Start Free Trial" beats "Sign Up".',
  },
  {
    id: 'proof',
    question: "Do you have any social proof?",
    helper: "Testimonials, reviews, results, credentials, press?",
    placeholder: "e.g., 500+ members, 4.9 star reviews, featured in Women's Health magazine",
    field: 'socialProof',
    isOptional: true,
    skillContext: 'Social proof near CTAs increases conversion 15-30%. Even one testimonial helps.',
  },
];

export function Discovery({ onComplete, onSkip, initialData }: DiscoveryProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialData ? { ...initialData } as Record<string, string> : {}
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>('landing-page');

  const step = DISCOVERY_STEPS[currentStep];
  const progress = ((currentStep + 1) / DISCOVERY_STEPS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.field]: value }));
  };

  const handleOptionSelect = (option: { value: string; label: string; template?: string }) => {
    setAnswers((prev) => ({ ...prev, [step.field]: option.value }));
    if (option.template) {
      setSelectedTemplate(option.template);
    }
    // Auto-advance for option selections
    setTimeout(() => handleNext(), 300);
  };

  const handleNext = () => {
    if (currentStep < DISCOVERY_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete - build BrandDNA
      const brandDNA: BrandDNA = {
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
      onComplete(brandDNA);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = step.isOptional || answers[step.field]?.trim();

  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-1 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-bolt-elements-background-depth-3">
        <div
          className="h-full bg-bolt-elements-button-primary-background transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-bolt-elements-borderColor flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/pm-logo-white.png" alt="Pocket Marketer" className="h-8" />
          <span className="text-bolt-elements-textSecondary">Website Builder</span>
        </div>
        {onSkip && (
          <button
            onClick={onSkip}
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary text-sm"
          >
            Skip for now →
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="text-center mb-2">
            <span className="text-bolt-elements-textTertiary text-sm">
              Step {currentStep + 1} of {DISCOVERY_STEPS.length}
            </span>
          </div>

          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-bold text-bolt-elements-textPrimary text-center mb-2">
            {step.question}
          </h1>
          <p className="text-bolt-elements-textSecondary text-center mb-8">{step.helper}</p>

          {/* Answer input */}
          <div className="space-y-4">
            {step.options ? (
              // Option buttons for first question
              <div className="grid gap-3">
                {step.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      answers[step.field] === option.value
                        ? 'border-bolt-elements-button-primary-background bg-bolt-elements-button-primary-background/10'
                        : 'border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive bg-bolt-elements-background-depth-3'
                    }`}
                  >
                    <span className="text-bolt-elements-textPrimary">{option.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Text input for other questions
              <textarea
                value={answers[step.field] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={step.placeholder}
                rows={3}
                className="w-full p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:border-bolt-elements-button-primary-background focus:outline-none resize-none"
                autoFocus
              />
            )}

            {/* Skill context hint */}
            <div className="p-3 rounded-lg bg-bolt-elements-button-primary-background/10 border border-bolt-elements-button-primary-background/30">
              <p className="text-sm text-bolt-elements-textSecondary">
                <span className="text-bolt-elements-button-primary-background font-medium">💡 Pro tip:</span>{' '}
                {step.skillContext}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'text-bolt-elements-textTertiary cursor-not-allowed'
                  : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                canProceed
                  ? 'bg-bolt-elements-button-primary-background text-white hover:bg-bolt-elements-button-primary-backgroundHover'
                  : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textTertiary cursor-not-allowed'
              }`}
            >
              {currentStep === DISCOVERY_STEPS.length - 1 ? 'Generate Website →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discovery;
