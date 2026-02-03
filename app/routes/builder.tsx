/**
 * PM Website Builder - Main Route
 *
 * Complete flow:
 * 1. Discovery (if no PM context) - Enhanced interview questions with marketing skills
 * 2. Select template (recommended based on goal)
 * 3. Choose styling (colors, fonts)
 * 4. Review/edit brand info
 * 5. Generate page with AI
 * 6. Preview and edit
 * 7. Deploy to Cloudflare
 */

import { useState, useEffect } from 'react';
import { TemplateSelector } from '~/components/pm/TemplateSelector';
import { PreviewFrame } from '~/components/pm/PreviewFrame';
import { Discovery } from '~/components/pm/Discovery';
import { type TemplateId, getTemplate } from '~/templates';
import { colorSchemes, fontOptions, type ColorScheme } from '~/lib/pm/color-schemes';
import type { BrandDNA } from '~/lib/pm/types';

type BuilderStep = 'discovery' | 'template' | 'styling' | 'brand' | 'generating' | 'preview' | 'deploying' | 'deployed';

interface BrandInfo {
  businessName: string;
  businessDescription: string;
  idealCustomer: string;
  problemSolved: string;
  transformation: string;
  callToAction: string;
  socialProof?: string;
}

interface StylingOptions {
  colorScheme: string;
  font: string;
}

export default function Builder() {
  // Check for PM context (will be replaced with real API call)
  const [hasPMContext, setHasPMContext] = useState<boolean | null>(null);
  const [pmBrandDNA, setPmBrandDNA] = useState<BrandDNA | null>(null);
  
  const [step, setStep] = useState<BuilderStep>('discovery');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [styling, setStyling] = useState<StylingOptions>({
    colorScheme: 'midnight-blue',
    font: 'inter',
  });
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    businessName: '',
    businessDescription: '',
    idealCustomer: '',
    problemSolved: '',
    transformation: '',
    callToAction: 'Get Started',
    socialProof: '',
  });
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [editInstruction, setEditInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedScheme = colorSchemes.find(s => s.id === styling.colorScheme);
  const selectedFont = fontOptions.find(f => f.id === styling.font);

  // Check for PM project context on mount
  useEffect(() => {
    // TODO: Replace with real PM API call
    // For now, simulate no context (will run Discovery)
    const checkPMContext = async () => {
      try {
        // const response = await fetch('/api/pm-context');
        // const data = await response.json();
        // if (data.hasContext) {
        //   setPmBrandDNA(data.brandDNA);
        //   setHasPMContext(true);
        //   setStep('template');
        // } else {
        //   setHasPMContext(false);
        // }
        
        // For now, always start with discovery
        setHasPMContext(false);
      } catch (err) {
        console.error('Failed to check PM context:', err);
        setHasPMContext(false);
      }
    };
    checkPMContext();
  }, []);

  // Handle discovery completion
  const handleDiscoveryComplete = (brandDNA: BrandDNA) => {
    setPmBrandDNA(brandDNA);
    setBrandInfo({
      businessName: brandDNA.companyName,
      businessDescription: brandDNA.businessDescription,
      idealCustomer: brandDNA.idealCustomer,
      problemSolved: brandDNA.problemSolved,
      transformation: brandDNA.desiredTransformation,
      callToAction: brandDNA.callToAction,
      socialProof: brandDNA.socialProof,
    });
    
    // Recommend template based on goal
    const goalToTemplate: Record<string, TemplateId> = {
      'leads': 'lead-magnet',
      'sell-low': 'landing-page',
      'sell-high': 'sales-page',
      'calls': 'landing-page',
      'launch': 'coming-soon',
    };
    const recommendedTemplate = goalToTemplate[brandDNA.mainGoal] || 'landing-page';
    setSelectedTemplate(recommendedTemplate);
    
    setStep('template');
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setStep('styling');
  };

  // Handle styling continue
  const handleStylingContinue = () => {
    setStep('brand');
  };

  // Handle brand info submission
  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('generating');
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/pm-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          brandInfo,
          styling: {
            colorScheme: selectedScheme,
            font: selectedFont,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { html: string };
      setGeneratedHtml(data.html);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setStep('brand');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle edit request
  const handleEdit = async () => {
    if (!editInstruction.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/pm-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHtml: generatedHtml,
          instruction: editInstruction,
          brandInfo,
          styling: {
            colorScheme: selectedScheme,
            font: selectedFont,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { html: string };
      setGeneratedHtml(data.html);
      setEditInstruction('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Edit failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle deployment
  const handleDeploy = async () => {
    setStep('deploying');
    setError(null);

    try {
      const response = await fetch('/api/cloudflare-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: generatedHtml,
          projectName: brandInfo.businessName.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { url: string };
      setDeployedUrl(data.url);
      setStep('deployed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
      setStep('preview');
    }
  };

  // Quick edit suggestions
  const quickEdits = [
    'Make the headline more urgent',
    'Change CTA button color to green',
    'Add more white space',
    'Make the text larger',
    'Add a testimonial section',
    'Make it feel more premium',
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Header - Hidden during Discovery (it has its own) */}
      {step !== 'discovery' && (
        <header className="border-b border-[#1e3a5f] bg-[#0d1f35]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/pm-logo-white.png" alt="Pocket Marketer" className="h-8" />
              <span className="text-[#94a3b8]">→</span>
              <h1 className="text-xl font-semibold">Website Builder</h1>
            </div>

          {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {['template', 'styling', 'brand', 'preview', 'deployed'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === s
                        ? 'bg-[#3b82f6] text-white'
                        : ['template', 'styling', 'brand', 'generating', 'preview', 'deployed'].indexOf(step) > i
                          ? 'bg-green-500 text-white'
                          : 'bg-[#1e3a5f] text-[#64748b]'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 4 && <div className="w-8 h-0.5 bg-[#1e3a5f] mx-1" />}
                </div>
              ))}
            </div>
        </div>
        </header>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-700 px-4 py-3 text-red-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={step === 'discovery' ? '' : 'max-w-7xl mx-auto p-6'}>
        {/* Step 0: Discovery (if no PM context) */}
        {step === 'discovery' && (
          <Discovery
            onComplete={handleDiscoveryComplete}
            onSkip={() => setStep('template')}
            initialData={pmBrandDNA || undefined}
          />
        )}

        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <div>
            {/* Show recommended template banner if we came from discovery */}
            {pmBrandDNA?.mainGoal && (
              <div className="mb-6 p-4 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30">
                <p className="text-sm text-[#3b82f6]">
                  ✨ Based on your goal ({pmBrandDNA.mainGoal === 'leads' ? 'capturing leads' : pmBrandDNA.mainGoal === 'sell-low' ? 'selling a product' : pmBrandDNA.mainGoal === 'sell-high' ? 'selling high-ticket' : pmBrandDNA.mainGoal === 'launch' ? 'pre-launch' : 'booking calls'}), we recommend the <strong>{getTemplate(selectedTemplate!)?.name}</strong>.
                </p>
              </div>
            )}
            <TemplateSelector onSelect={handleTemplateSelect} selectedId={selectedTemplate || undefined} />
          </div>
        )}

        {/* Step 2: Styling Options */}
        {step === 'styling' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setStep('template')}
                className="text-[#3b82f6] hover:text-white flex items-center gap-1 text-sm"
              >
                ← Back to templates
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-2">Choose Your Style</h2>
            <p className="text-[#94a3b8] mb-8">
              Select a color scheme and font that matches your brand personality.
            </p>

            {/* Color Schemes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => setStyling({ ...styling, colorScheme: scheme.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      styling.colorScheme === scheme.id
                        ? 'border-[#3b82f6] bg-[#132743]'
                        : 'border-[#1e3a5f] bg-[#0d1f35] hover:border-[#3b82f6]/50'
                    }`}
                  >
                    {/* Color Preview */}
                    <div className="flex gap-1 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: scheme.colors.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: scheme.colors.background }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: scheme.colors.surface }}
                      />
                    </div>
                    <div className="font-medium text-white text-sm">{scheme.name}</div>
                    <div className="text-xs text-[#64748b]">{scheme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Font Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setStyling({ ...styling, font: font.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      styling.font === font.id
                        ? 'border-[#3b82f6] bg-[#132743]'
                        : 'border-[#1e3a5f] bg-[#0d1f35] hover:border-[#3b82f6]/50'
                    }`}
                  >
                    <div
                      className="text-2xl font-semibold text-white mb-2"
                      style={{ fontFamily: font.family }}
                    >
                      Aa
                    </div>
                    <div className="font-medium text-white text-sm">{font.name}</div>
                    <div className="text-xs text-[#64748b]">{font.style}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {selectedScheme && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: selectedScheme.colors.background,
                    borderColor: selectedScheme.colors.border,
                    fontFamily: selectedFont?.family,
                  }}
                >
                  <div
                    className="rounded-lg p-4 mb-4"
                    style={{ backgroundColor: selectedScheme.colors.surface }}
                  >
                    <h4
                      className="text-xl font-bold mb-2"
                      style={{ color: selectedScheme.colors.text }}
                    >
                      Your Amazing Headline Here
                    </h4>
                    <p style={{ color: selectedScheme.colors.textMuted }}>
                      This is what your page will look like with these colors.
                    </p>
                  </div>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold"
                    style={{
                      backgroundColor: selectedScheme.colors.primary,
                      color: '#ffffff',
                    }}
                  >
                    Call to Action
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleStylingContinue}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Brand Info
            </button>
          </div>
        )}

        {/* Step 3: Brand Info */}
        {step === 'brand' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setStep('styling')}
                className="text-[#3b82f6] hover:text-white flex items-center gap-1 text-sm"
              >
                ← Back to styling
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-2">Tell us about your brand</h2>
            <p className="text-[#94a3b8] mb-6">
              We'll use this to generate your {getTemplate(selectedTemplate!)?.name}.
            </p>

            <form onSubmit={handleBrandSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={brandInfo.businessName}
                  onChange={(e) => setBrandInfo({ ...brandInfo, businessName: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="FreshPlate Meals"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What does your business do?</label>
                <textarea
                  value={brandInfo.businessDescription}
                  onChange={(e) => setBrandInfo({ ...brandInfo, businessDescription: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="We deliver pre-portioned meal kits with 15-minute recipes to busy professionals."
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Who is your ideal customer?</label>
                <textarea
                  value={brandInfo.idealCustomer}
                  onChange={(e) => setBrandInfo({ ...brandInfo, idealCustomer: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Busy professionals aged 25-45 who want to eat healthy but don't have time to meal plan."
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What problem do you solve?</label>
                <textarea
                  value={brandInfo.problemSolved}
                  onChange={(e) => setBrandInfo({ ...brandInfo, problemSolved: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="We eliminate dinner stress and save 5-10 hours per week on meal planning and shopping."
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What transformation do customers get?</label>
                <textarea
                  value={brandInfo.transformation}
                  onChange={(e) => setBrandInfo({ ...brandInfo, transformation: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="They feel healthier, have more energy, and enjoy cooking without the stress."
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Social Proof (optional)</label>
                <textarea
                  value={brandInfo.socialProof}
                  onChange={(e) => setBrandInfo({ ...brandInfo, socialProof: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="10,000+ meals delivered, 4.8 stars on Trustpilot, Featured in Forbes..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Call to Action</label>
                <input
                  type="text"
                  value={brandInfo.callToAction}
                  onChange={(e) => setBrandInfo({ ...brandInfo, callToAction: e.target.value })}
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Get Your First Week 50% Off"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Generate My Website
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Generating */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Generating your website...</h2>
            <p className="text-[#94a3b8]">This usually takes 10-20 seconds</p>
          </div>
        )}

        {/* Step 5: Preview */}
        {step === 'preview' && (
          <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Preview */}
            <div className="flex-1 bg-[#132743] rounded-xl overflow-hidden">
              <PreviewFrame html={generatedHtml} />
            </div>

            {/* Edit Panel */}
            <div className="w-96 bg-[#132743] rounded-xl p-5 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Make Changes</h3>

              {/* Quick Edits */}
              <div className="mb-4">
                <p className="text-xs text-[#64748b] mb-2">Quick edits:</p>
                <div className="flex flex-wrap gap-2">
                  {quickEdits.map((edit) => (
                    <button
                      key={edit}
                      onClick={() => setEditInstruction(edit)}
                      className="text-xs bg-[#1e3a5f] hover:bg-[#2d4a6f] text-[#94a3b8] hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      {edit}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                className="flex-1 bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none resize-none mb-4"
                placeholder="Describe what you want to change...

Examples:
• Make the headline bigger and bolder
• Change CTA button to green
• Add a testimonial section
• Make it more professional"
              />

              <button
                onClick={handleEdit}
                disabled={isGenerating || !editInstruction.trim()}
                className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
              >
                {isGenerating ? 'Updating...' : 'Apply Changes'}
              </button>

              <div className="border-t border-[#1e3a5f] pt-4 mt-auto">
                <button
                  onClick={() => {
                    // Download HTML
                    const blob = new Blob([generatedHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${brandInfo.businessName.toLowerCase().replace(/\s+/g, '-')}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-medium py-2 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download HTML
                </button>

                <button
                  onClick={handleDeploy}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Deploy to Cloudflare
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Deploying */}
        {step === 'deploying' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Deploying to Cloudflare...</h2>
            <p className="text-[#94a3b8]">Your site will be live in a moment</p>
          </div>
        )}

        {/* Step 7: Deployed */}
        {step === 'deployed' && deployedUrl && (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-3">Your site is live! 🎉</h2>
            <p className="text-[#94a3b8] mb-6">Your website has been deployed to Cloudflare Pages.</p>

            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-8 rounded-lg transition-colors mb-4"
            >
              View Live Site →
            </a>

            <div className="bg-[#132743] rounded-lg p-4 mb-6">
              <p className="text-[#64748b] text-sm mb-1">Your URL:</p>
              <code className="text-[#22c55e] break-all">{deployedUrl}</code>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep('preview')}
                className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Make More Changes
              </button>
              <button
                onClick={() => {
                  setStep('template');
                  setGeneratedHtml('');
                  setDeployedUrl(null);
                }}
                className="text-[#94a3b8] hover:text-white py-2 px-6 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
