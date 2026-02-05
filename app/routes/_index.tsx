import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { useEffect, useState, useCallback } from 'react';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { LoadingScreen, Discovery } from '~/components/pm';
import { webcontainerContext } from '~/lib/webcontainer';
import type { BrandDNA } from '~/lib/pm/types';

export const meta: MetaFunction = () => {
  return [{ title: 'Pocket Marketer' }, { name: 'description', content: 'Your AI Marketing Assistant' }];
};

export const loader = () => json({});

// Storage key for brand context
const BRAND_CONTEXT_KEY = 'pm-brand-context';

// WebContainer boot loading wrapper
function WebContainerLoader({ children }: { children: React.ReactNode }) {
  const [isBooting, setIsBooting] = useState(!webcontainerContext.loaded);

  useEffect(() => {
    if (webcontainerContext.loaded) {
      setIsBooting(false);
      return;
    }

    // Poll for WebContainer boot completion
    const checkInterval = setInterval(() => {
      if (webcontainerContext.loaded) {
        setIsBooting(false);
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      setIsBooting(false);
      clearInterval(checkInterval);
    }, 30000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  if (isBooting) {
    return (
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1 items-center justify-center">
        <LoadingScreen
          message="Starting Pocket Marketer..."
          tips={[
            'Setting up your creative workspace',
            'Initializing the AI engine',
            'Loading design components',
            'Preparing your marketing toolkit',
            'Almost ready to create magic!',
          ]}
          variant="default"
        />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Main Index with Discovery Flow Integration
 * 
 * Flow:
 * 1. Check for existing brand context in localStorage
 * 2. If no context → Show Discovery questionnaire
 * 3. After Discovery → Store brand DNA and show Chat with context
 * 4. User can skip Discovery and go straight to Chat
 */
export default function Index() {
  const [showDiscovery, setShowDiscovery] = useState<boolean | null>(null);
  const [brandContext, setBrandContext] = useState<BrandDNA | null>(null);

  // Check for existing brand context on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAND_CONTEXT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBrandContext(parsed);
        setShowDiscovery(false);
      } else {
        // No existing context - show Discovery for new users
        setShowDiscovery(true);
      }
    } catch {
      // localStorage not available or parse error
      setShowDiscovery(false);
    }
  }, []);

  // Handle Discovery completion
  const handleDiscoveryComplete = useCallback((brandDNA: BrandDNA) => {
    // Store brand context
    try {
      localStorage.setItem(BRAND_CONTEXT_KEY, JSON.stringify(brandDNA));
    } catch {
      // localStorage not available
    }
    
    setBrandContext(brandDNA);
    setShowDiscovery(false);

    // Build initial prompt from brand DNA
    const initialPrompt = buildInitialPrompt(brandDNA);
    
    // Store initial prompt for Chat to pick up
    try {
      sessionStorage.setItem('pm-initial-prompt', initialPrompt);
    } catch {
      // sessionStorage not available
    }
  }, []);

  // Handle Discovery skip
  const handleDiscoverySkip = useCallback(() => {
    setShowDiscovery(false);
  }, []);

  // Still checking localStorage
  if (showDiscovery === null) {
    return (
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1 items-center justify-center">
        <LoadingScreen
          message="Loading..."
          tips={['Checking your workspace...']}
          variant="default"
        />
      </div>
    );
  }

  // Show Discovery questionnaire
  if (showDiscovery) {
    return (
      <Discovery
        onComplete={handleDiscoveryComplete}
        onSkip={handleDiscoverySkip}
        initialData={brandContext || undefined}
      />
    );
  }

  // Show main Chat interface
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>
        {() => (
          <WebContainerLoader>
            <Chat />
          </WebContainerLoader>
        )}
      </ClientOnly>
    </div>
  );
}

/**
 * Build an initial prompt from Brand DNA to kickstart the conversation
 */
function buildInitialPrompt(brandDNA: BrandDNA): string {
  const goalToTemplate: Record<string, string> = {
    leads: 'lead capture landing page',
    'sell-low': 'product landing page',
    'sell-high': 'sales page',
    calls: 'booking landing page',
    launch: 'coming soon page',
  };

  const templateType = goalToTemplate[brandDNA.mainGoal] || 'landing page';

  return `Build me a ${templateType} for my business.

**Business:** ${brandDNA.businessDescription}

**Ideal Customer:** ${brandDNA.idealCustomer}

**Problem I Solve:** ${brandDNA.problemSolved}

**Transformation:** ${brandDNA.desiredTransformation}

**Call to Action:** ${brandDNA.callToAction}

${brandDNA.socialProof ? `**Social Proof:** ${brandDNA.socialProof}` : ''}

${brandDNA.differentiators ? `**What Makes Us Different:** ${brandDNA.differentiators}` : ''}

Please create a high-converting ${templateType} with compelling copy based on this information.`;
}
