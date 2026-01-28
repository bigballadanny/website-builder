import { useState, useEffect, useCallback } from 'react';

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isVisible: boolean;
  /** Custom tips to display */
  tips?: string[];
  /** Interval between tip changes in ms */
  tipInterval?: number;
  /** Custom message */
  message?: string;
  /** Progress percentage (0-100), shows determinate progress if provided */
  progress?: number;
  /** Stage label (e.g., "Analyzing prompt...", "Generating code...") */
  stage?: string;
  /** Callback when animation completes (for exit transitions) */
  onExitComplete?: () => void;
  /** Z-index for the overlay */
  zIndex?: number;
  /** Show backdrop blur */
  blur?: boolean;
}

const DEFAULT_TIPS = [
  "Pro tip: Be specific about your target audience",
  "Include color preferences for better results",
  "Mention your industry for tailored copy",
  "Ask for mobile-first design for best results",
  "Describe your brand personality for matching tone",
  "Specify any must-have sections or features",
  "Reference competitors you admire for inspiration",
  "Include your call-to-action goals upfront",
];

export function LoadingOverlay({
  isVisible,
  tips = DEFAULT_TIPS,
  tipInterval = 4000,
  message = "Creating your landing page",
  progress,
  stage,
  onExitComplete,
  zIndex = 50,
  blur = true,
}: LoadingOverlayProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onExitComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldRender, onExitComplete]);

  // Rotate tips
  const rotateTip = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      setIsTransitioning(false);
    }, 300);
  }, [tips.length]);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(rotateTip, tipInterval);
    return () => clearInterval(interval);
  }, [rotateTip, tipInterval, isVisible]);

  if (!shouldRender) return null;

  const isDeterminate = typeof progress === 'number';

  return (
    <>
      <style>{`
        @keyframes pm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pm-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pm-pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes pm-float-logo {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes pm-gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pm-progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes pm-overlay-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pm-overlay-exit {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div 
        className={`fixed inset-0 flex flex-col items-center justify-center p-6 ${blur ? 'backdrop-blur-sm' : ''}`}
        style={{ 
          zIndex,
          background: blur ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.98)',
          animation: isExiting ? 'pm-overlay-exit 0.5s ease forwards' : 'pm-overlay-enter 0.4s ease forwards'
        }}
      >
        {/* Animated Logo */}
        <div className="relative w-[100px] h-[100px] mb-10">
          {/* Outer spinning ring */}
          <div 
            className="absolute -inset-5 border-3 border-transparent border-t-purple-500 rounded-full"
            style={{ animation: 'pm-spin 1.5s linear infinite' }}
          />
          {/* Middle reverse-spinning ring */}
          <div 
            className="absolute -inset-3 border-2 border-transparent border-b-pink-500 rounded-full"
            style={{ animation: 'pm-spin-reverse 2s linear infinite' }}
          />
          {/* Inner glow */}
          <div 
            className="absolute -inset-2 bg-gradient-radial from-purple-500/30 to-transparent rounded-full"
            style={{ animation: 'pm-pulse-glow 2s ease-in-out infinite' }}
          />
          {/* Logo */}
          <div 
            className="relative w-full h-full"
            style={{ 
              animation: 'pm-float-logo 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))'
            }}
          >
            <img
              src="/pm-logo-white.png"
              alt="Pocket Marketer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-tight">
          {message}
        </h2>
        
        {/* Stage Label */}
        {stage && (
          <p className="text-base text-purple-500 mb-6 text-center font-medium">
            {stage}
          </p>
        )}

        {/* Progress Bar */}
        <div className="w-full max-w-xs mb-8">
          <div className="h-1 bg-zinc-800 rounded overflow-hidden">
            <div 
              className="h-full rounded"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)',
                backgroundSize: '200% 100%',
                width: isDeterminate ? `${progress}%` : '30%',
                transition: 'width 0.3s ease',
                animation: isDeterminate 
                  ? 'pm-gradient-shift 2s linear infinite'
                  : 'pm-progress-slide 1.5s ease-in-out infinite, pm-gradient-shift 2s linear infinite'
              }}
            />
          </div>
          {isDeterminate && (
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
              <span>Progress</span>
              <span>{Math.round(progress!)}%</span>
            </div>
          )}
        </div>

        {/* Rotating Tips */}
        <div className="max-w-md h-15 flex items-center justify-center">
          <div 
            className={`flex items-center gap-2 px-5 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-400 text-center transition-all duration-300 ${isTransitioning ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
            <span className="text-lg">💡</span>
            <span>{tips[currentTipIndex]}</span>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="absolute bottom-6 flex items-center gap-2 text-xs text-zinc-600">
          Press <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-[11px]">Esc</span> to cancel
        </div>
      </div>
    </>
  );
}

export default LoadingOverlay;
