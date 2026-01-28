'use client';

import { useState, useEffect, useCallback, CSSProperties } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  /** Custom tips to display (uses defaults if not provided) */
  tips?: string[];
  /** Interval between tip changes in ms (default: 4000) */
  tipInterval?: number;
  /** Show progress dots (default: true) */
  showProgress?: boolean;
  /** Custom message above tips */
  message?: string;
  /** Variant: 'default' | 'compact' | 'minimal' */
  variant?: 'default' | 'compact' | 'minimal';
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

// CSS Keyframes as a style tag
const keyframes = `
  @keyframes pm-glow-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes pm-ring-expand {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes pm-logo-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes pm-wave {
    0%, 100% { height: 8px; }
    50% { height: 24px; }
  }
  @keyframes pm-dot-pulse {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1.2); opacity: 1; }
  }
  @keyframes pm-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes pm-screen-enter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export function LoadingScreen({
  tips = DEFAULT_TIPS,
  tipInterval = 4000,
  showProgress = true,
  message = "Creating your landing page...",
  variant = 'default',
}: LoadingScreenProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Rotate tips with smooth transitions
  const rotateTip = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      setIsTransitioning(false);
    }, 300);
  }, [tips.length]);

  useEffect(() => {
    const interval = setInterval(rotateTip, tipInterval);
    return () => clearInterval(interval);
  }, [rotateTip, tipInterval]);

  const isCompact = variant === 'compact';

  // Minimal variant - just dots
  if (variant === 'minimal') {
    const dotStyle: CSSProperties = {
      width: 6,
      height: 6,
      background: '#a855f7',
      borderRadius: '50%',
      animation: 'pm-dot-pulse 1.4s ease-in-out infinite',
    };

    return (
      <>
        <style>{keyframes}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 16 }}>
          <span style={{ ...dotStyle }} />
          <span style={{ ...dotStyle, animationDelay: '0.2s' }} />
          <span style={{ ...dotStyle, animationDelay: '0.4s' }} />
        </div>
      </>
    );
  }

  // Styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isCompact ? 280 : 400,
    padding: isCompact ? '32px 20px' : '48px 24px',
    background: '#0a0a0a',
    borderRadius: 16,
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  };

  const logoContainerStyle: CSSProperties = {
    position: 'relative',
    width: isCompact ? 60 : 80,
    height: isCompact ? 60 : 80,
    marginBottom: isCompact ? 24 : 32,
  };

  const glowStyle: CSSProperties = {
    position: 'absolute',
    inset: -20,
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pm-glow-pulse 2s ease-in-out infinite',
    filter: 'blur(20px)',
  };

  const ringBaseStyle: CSSProperties = {
    position: 'absolute',
    inset: -8,
    border: '2px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '50%',
    animation: 'pm-ring-expand 2s ease-out infinite',
  };

  const logoImageStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    animation: 'pm-logo-float 3s ease-in-out infinite',
    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
  };

  const shimmerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
    animation: 'pm-shimmer 2s infinite',
    borderRadius: '50%',
  };

  const messageStyle: CSSProperties = {
    fontSize: isCompact ? 16 : 18,
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: '-0.02em',
  };

  const tipsContainerStyle: CSSProperties = {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isCompact ? 24 : 32,
    overflow: 'hidden',
  };

  const tipStyle: CSSProperties = {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 1.5,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(-8px)' : 'translateY(0)',
  };

  const waveContainerStyle: CSSProperties = {
    display: 'flex',
    gap: 4,
    alignItems: 'flex-end',
    height: 24,
  };

  const waveBarStyle = (delay: number): CSSProperties => ({
    width: 4,
    background: 'linear-gradient(to top, #a855f7, #ec4899)',
    borderRadius: 2,
    animation: `pm-wave 1s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  });

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        {/* Animated Logo */}
        <div style={logoContainerStyle}>
          <div style={glowStyle} />
          <div style={ringBaseStyle} />
          <div style={{ ...ringBaseStyle, animationDelay: '0.5s' }} />
          <div style={{ ...ringBaseStyle, animationDelay: '1s' }} />
          <div style={logoImageStyle}>
            <Image
              src="/pm-logo-white.png"
              alt="Pocket Marketer"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
            <div style={shimmerStyle} />
          </div>
        </div>

        {/* Message */}
        <p style={messageStyle}>{message}</p>

        {/* Rotating Tips */}
        <div style={tipsContainerStyle}>
          <p style={tipStyle}>
            <span style={{ display: 'inline-block', marginRight: 6, color: '#a855f7' }}>💡</span>
            {tips[currentTipIndex]}
          </p>
        </div>

        {/* Progress Indicator */}
        {showProgress && (
          <div style={waveContainerStyle}>
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
              <div key={i} style={waveBarStyle(delay)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default LoadingScreen;
