/**
 * Text Improvement Popover
 *
 * Appears when user selects text or clicks "Improve with AI"
 * Offers options: Make shorter, longer, more persuasive, simpler
 */

import { useState } from 'react';
import type { ImprovementType, SectionType } from '~/routes/api.pm-copywriting';

interface TextImprovementPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  sectionType?: SectionType;
  onReplace: (newText: string) => void;
  position?: { x: number; y: number };
}

interface ImproveResult {
  improved: string;
  alternatives: string[];
}

const IMPROVEMENTS: { id: ImprovementType; name: string; icon: string; description: string }[] = [
  { id: 'shorter', name: 'Make Shorter', icon: '✂️', description: 'Concise & punchy' },
  { id: 'longer', name: 'Make Longer', icon: '📝', description: 'More detail' },
  { id: 'persuasive', name: 'More Persuasive', icon: '💪', description: 'Drive action' },
  { id: 'simpler', name: 'Simpler', icon: '🎯', description: 'Easy to read' },
  { id: 'urgent', name: 'Add Urgency', icon: '⚡', description: 'Act now' },
  { id: 'emotional', name: 'More Emotional', icon: '💖', description: 'Connect deeper' },
];

export function TextImprovementPopover({
  isOpen,
  onClose,
  selectedText,
  sectionType,
  onReplace,
  position,
}: TextImprovementPopoverProps) {
  const [step, setStep] = useState<'options' | 'results'>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImproveResult | null>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<ImprovementType | null>(null);

  const handleImprove = async (improvement: ImprovementType) => {
    setSelectedImprovement(improvement);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pm-copywriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve',
          text: selectedText,
          improvement,
          sectionType,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as ImproveResult;
      setResult(data);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Improvement failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseResult = (text: string) => {
    onReplace(text);
    handleClose();
  };

  const handleClose = () => {
    setStep('options');
    setResult(null);
    setError(null);
    setSelectedImprovement(null);
    onClose();
  };

  const handleBack = () => {
    setStep('options');
    setResult(null);
  };

  if (!isOpen) return null;

  // Calculate popover position
  const popoverStyle = position
    ? {
        position: 'fixed' as const,
        left: Math.min(position.x, window.innerWidth - 380),
        top: Math.min(position.y + 10, window.innerHeight - 400),
      }
    : {};

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={handleClose} />

      {/* Popover */}
      <div
        className="fixed z-50 bg-[#0a1628] rounded-xl shadow-2xl border border-[#1e3a5f] w-[360px] max-h-[400px] overflow-hidden"
        style={popoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Improve with AI</span>
          </div>
          <button onClick={handleClose} className="text-[#64748b] hover:text-white p-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto max-h-[320px]">
          {step === 'options' ? (
            <>
              {/* Original Text Preview */}
              <div className="mb-3">
                <p className="text-xs text-[#64748b] mb-1">Selected text:</p>
                <div className="bg-[#132743] rounded-lg p-2 text-sm text-[#94a3b8] line-clamp-2">
                  "{selectedText}"
                </div>
              </div>

              {/* Improvement Options */}
              <div className="grid grid-cols-2 gap-2">
                {IMPROVEMENTS.map((imp) => (
                  <button
                    key={imp.id}
                    onClick={() => handleImprove(imp.id)}
                    disabled={isLoading}
                    className="p-2 bg-[#132743] hover:bg-[#1e3a5f] border border-[#1e3a5f] hover:border-[#3b82f6] rounded-lg text-left transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{imp.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-white">{imp.name}</p>
                        <p className="text-[10px] text-[#64748b]">{imp.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-[#94a3b8]">
                  <div className="w-4 h-4 border-2 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin" />
                  Improving...
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-xs">
                  {error}
                </div>
              )}
            </>
          ) : (
            /* Results */
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="text-[#3b82f6] hover:text-white flex items-center gap-1 text-xs mb-3 transition-colors"
              >
                ← Try different improvement
              </button>

              {result && (
                <div className="space-y-2">
                  {/* Primary Result */}
                  <div>
                    <p className="text-xs text-[#64748b] mb-1 flex items-center gap-1">
                      <span className="text-green-400">✓</span> Improved ({IMPROVEMENTS.find((i) => i.id === selectedImprovement)?.name}):
                    </p>
                    <button
                      onClick={() => handleUseResult(result.improved)}
                      className="w-full p-2 bg-[#132743] hover:bg-[#1e3a5f] border border-[#1e3a5f] hover:border-[#22c55e] rounded-lg text-left transition-all group"
                    >
                      <p className="text-sm text-white">{result.improved}</p>
                      <p className="text-[10px] text-[#64748b] group-hover:text-[#22c55e] mt-1">Click to use</p>
                    </button>
                  </div>

                  {/* Alternatives */}
                  {result.alternatives.length > 0 && (
                    <div>
                      <p className="text-xs text-[#64748b] mb-1">Alternatives:</p>
                      <div className="space-y-1">
                        {result.alternatives.map((alt, i) => (
                          <button
                            key={i}
                            onClick={() => handleUseResult(alt)}
                            className="w-full p-2 bg-[#0d1f35] hover:bg-[#132743] border border-[#1e3a5f] hover:border-[#3b82f6] rounded-lg text-left transition-all group"
                          >
                            <p className="text-xs text-[#94a3b8]">{alt}</p>
                            <p className="text-[10px] text-[#64748b] group-hover:text-[#3b82f6] mt-0.5">Click to use</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keep Original */}
                  <button
                    onClick={handleClose}
                    className="w-full p-2 text-xs text-[#64748b] hover:text-white transition-colors"
                  >
                    Keep original
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TextImprovementPopover;
