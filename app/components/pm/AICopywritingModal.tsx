/**
 * AI Copywriting Modal
 *
 * Generates marketing copy with AI based on:
 * - User's description of what they want to say
 * - Tone selection (Professional, Casual, Bold, Friendly)
 * - Section type (Hero, Features, CTA, About, etc.)
 *
 * Returns headline options, subheadline, body copy, and CTA text
 */

import { useState } from 'react';
import type { ToneType, SectionType } from '~/routes/api.pm-copywriting';

interface AICopywritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (copy: InsertableCopy) => void;
  businessName?: string;
  businessDescription?: string;
  currentSectionType?: SectionType;
}

export interface InsertableCopy {
  headline: string;
  subheadline: string;
  bodyCopy: string;
  ctaText: string;
}

interface CopyResult {
  headlines: string[];
  subheadline: string;
  bodyCopy: string;
  ctaText: string;
}

const TONES: { id: ToneType; name: string; description: string; emoji: string }[] = [
  { id: 'professional', name: 'Professional', description: 'Polished & authoritative', emoji: '💼' },
  { id: 'casual', name: 'Casual', description: 'Friendly & conversational', emoji: '😊' },
  { id: 'bold', name: 'Bold', description: 'Direct & attention-grabbing', emoji: '🔥' },
  { id: 'friendly', name: 'Friendly', description: 'Warm & welcoming', emoji: '🤝' },
];

const SECTIONS: { id: SectionType; name: string; icon: string }[] = [
  { id: 'hero', name: 'Hero', icon: '🎯' },
  { id: 'features', name: 'Features', icon: '✨' },
  { id: 'benefits', name: 'Benefits', icon: '🎁' },
  { id: 'cta', name: 'Call to Action', icon: '👆' },
  { id: 'about', name: 'About', icon: '👋' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
  { id: 'pricing', name: 'Pricing', icon: '💰' },
  { id: 'faq', name: 'FAQ', icon: '❓' },
];

export function AICopywritingModal({
  isOpen,
  onClose,
  onInsert,
  businessName,
  businessDescription,
  currentSectionType,
}: AICopywritingModalProps) {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [sectionType, setSectionType] = useState<SectionType>(currentSectionType || 'hero');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CopyResult | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState(0);

  const handleGenerate = async () => {
    if (!description.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/pm-copywriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          description,
          tone,
          sectionType,
          businessName,
          businessDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as CopyResult;
      setResult(data);
      setSelectedHeadline(0);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (!result) {
      return;
    }

    onInsert({
      headline: result.headlines[selectedHeadline],
      subheadline: result.subheadline,
      bodyCopy: result.bodyCopy,
      ctaText: result.ctaText,
    });

    handleClose();
  };

  const handleClose = () => {
    setStep('input');
    setDescription('');
    setResult(null);
    setError(null);
    onClose();
  };

  const handleBack = () => {
    setStep('input');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={handleClose}>
      <div
        className="bg-[#0a1628] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#1e3a5f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Copywriter</h2>
              <p className="text-sm text-[#94a3b8]">Generate compelling marketing copy</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-[#94a3b8] hover:text-white p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'input' ? (
            <div className="space-y-5">
              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  What do you want to say? <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., We help busy professionals save time with our meal delivery service. Emphasize convenience and health benefits."
                  className="w-full bg-[#132743] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none"
                  rows={3}
                />
                <p className="mt-1 text-xs text-[#64748b]">Describe your message, key points, or value proposition</p>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        tone === t.id
                          ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white'
                          : 'bg-[#132743] border-[#1e3a5f] text-[#94a3b8] hover:border-[#3b82f6]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{t.emoji}</span>
                        <span className="font-medium text-sm">{t.name}</span>
                      </div>
                      <p className="text-xs text-[#64748b]">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Section Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSectionType(s.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        sectionType === s.id
                          ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white'
                          : 'bg-[#132743] border-[#1e3a5f] text-[#94a3b8] hover:border-[#3b82f6]/50'
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <p className="text-xs mt-1">{s.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">{error}</div>
              )}
            </div>
          ) : (
            /* Results Step */
            <div className="space-y-5">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="text-[#3b82f6] hover:text-white flex items-center gap-1 text-sm transition-colors"
              >
                ← Generate different copy
              </button>

              {result && (
                <>
                  {/* Headlines */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Choose a Headline</label>
                    <div className="space-y-2">
                      {result.headlines.map((headline, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedHeadline(i)}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            selectedHeadline === i
                              ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white'
                              : 'bg-[#132743] border-[#1e3a5f] text-[#94a3b8] hover:border-[#3b82f6]/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedHeadline === i ? 'border-[#3b82f6] bg-[#3b82f6]' : 'border-[#64748b]'
                              }`}
                            >
                              {selectedHeadline === i && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">{headline}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subheadline */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Subheadline</label>
                    <div className="bg-[#132743] border border-[#1e3a5f] rounded-lg p-3 text-[#94a3b8]">
                      {result.subheadline}
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Body Copy</label>
                    <div className="bg-[#132743] border border-[#1e3a5f] rounded-lg p-3 text-[#94a3b8] text-sm whitespace-pre-wrap">
                      {result.bodyCopy}
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">CTA Button Text</label>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-medium">{result.ctaText}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#1e3a5f]">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-[#94a3b8] hover:text-white transition-colors font-medium"
          >
            Cancel
          </button>
          {step === 'input' ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Copy
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleInsert}
              className="px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Use This Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AICopywritingModal;
