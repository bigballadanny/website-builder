import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';
import { cleanStackTrace } from '~/utils/stacktrace';

interface WebContainerContext {
  loaded: boolean;
}

export const webcontainerContext: WebContainerContext = import.meta.hot?.data.webcontainerContext ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (!import.meta.env.SSR) {
  webcontainer =
    import.meta.hot?.data.webcontainer ??
    Promise.resolve()
      .then(() => {
        console.log('[WebContainer] 🚀 Booting WebContainer...');
        console.log('[WebContainer] 📋 Browser:', navigator.userAgent);
        console.log('[WebContainer] 📋 SharedArrayBuffer available:', typeof SharedArrayBuffer !== 'undefined');
        console.log('[WebContainer] 📋 crossOriginIsolated:', crossOriginIsolated);
        return WebContainer.boot({
          coep: 'credentialless',
          workdirName: WORK_DIR_NAME,
          forwardPreviewErrors: true, // Enable error forwarding from iframes
        });
      })
      .then(async (wc) => {
        console.log('[WebContainer] ✅ WebContainer booted successfully');
        console.log('[WebContainer] 📁 Working directory:', wc.workdir);
        webcontainerContext.loaded = true;

        // Add listener for port events
        wc.on('port', (port, type, url) => {
          console.log('[WebContainer] 🔌 Port event:', { port, type, url });
        });

        wc.on('server-ready', (port, url) => {
          console.log('[WebContainer] 🌐 Server ready:', { port, url });
        });

        const { workbenchStore } = await import('~/lib/stores/workbench');

        try {
          const response = await fetch('/inspector-script.js');
          const inspectorScript = await response.text();
          await wc.setPreviewScript(inspectorScript);
        } catch (err) {
          console.warn('[WebContainer] ⚠️ Failed to load inspector script:', err);
        }

        // Listen for preview errors
        wc.on('preview-message', (message) => {
          console.log('WebContainer preview message:', message);

          // Handle both uncaught exceptions and unhandled promise rejections
          if (message.type === 'PREVIEW_UNCAUGHT_EXCEPTION' || message.type === 'PREVIEW_UNHANDLED_REJECTION') {
            const isPromise = message.type === 'PREVIEW_UNHANDLED_REJECTION';
            const title = isPromise ? 'Unhandled Promise Rejection' : 'Uncaught Exception';
            workbenchStore.actionAlert.set({
              type: 'preview',
              title,
              description: 'message' in message ? message.message : 'Unknown error',
              content: `Error occurred at ${message.pathname}${message.search}${message.hash}\nPort: ${message.port}\n\nStack trace:\n${cleanStackTrace(message.stack || '')}`,
              source: 'preview',
            });
          }
        });

        return wc;
      })
      .catch((err) => {
        console.error('[WebContainer] ❌ BOOT FAILED:', err);
        console.error('[WebContainer] 📋 crossOriginIsolated:', typeof crossOriginIsolated !== 'undefined' ? crossOriginIsolated : 'N/A');
        console.error('[WebContainer] 📋 SharedArrayBuffer:', typeof SharedArrayBuffer !== 'undefined');
        console.error('[WebContainer] This usually means:');
        console.error('[WebContainer]   1. Headers COOP/COEP are missing');
        console.error('[WebContainer]   2. Browser does not support SharedArrayBuffer');
        console.error('[WebContainer]   3. Another WebContainer instance is already running in another tab');
        throw err;
      });

  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = webcontainer;
  }
}
