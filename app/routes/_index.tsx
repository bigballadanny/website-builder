import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { useEffect, useState } from 'react';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { LoadingScreen } from '~/components/pm';
import { webcontainerContext } from '~/lib/webcontainer';

export const meta: MetaFunction = () => {
  return [{ title: 'Pocket Marketer' }, { name: 'description', content: 'Your AI Marketing Assistant' }];
};

export const loader = () => json({});

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
 * Landing page component for Pocket Marketer
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
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
