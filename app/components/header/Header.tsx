import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { Link } from '@remix-run/react';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { AutoSaveIndicatorCompact } from '~/components/ui/AutoSaveIndicator';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center gap-2">
          <img src="/pm-logo-dark.png" alt="Pocket Marketer" className="h-8 inline-block dark:hidden" />
          <img src="/pm-logo-white.png" alt="Pocket Marketer" className="h-8 inline-block hidden dark:block" />
        </a>
      </div>

      {/* Website Builder link - always visible */}
      {!chat.started && (
        <div className="flex-1 flex justify-end">
          <Link
            to="/builder"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Website Builder
          </Link>
        </div>
      )}
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary flex items-center justify-center gap-2">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
            <ClientOnly>{() => <AutoSaveIndicatorCompact />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
