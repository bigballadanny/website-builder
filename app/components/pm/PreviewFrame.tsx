/**
 * Preview Frame Component
 * Shows the generated website in an iframe with device switching
 */

import { useState, useRef, useEffect } from 'react';

interface PreviewFrameProps {
  html: string;
  css?: string;
  deviceWidth?: 'desktop' | 'tablet' | 'mobile';
}

const deviceWidths = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export function PreviewFrame({ html, css, deviceWidth = 'desktop' }: PreviewFrameProps) {
  const [device, setDevice] = useState(deviceWidth);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build complete HTML document
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${css || ''}
    /* PM Base Styles */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
`;

  // Update iframe content when html changes
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;

      if (doc) {
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [fullHtml]);

  return (
    <div className="pm-preview-container flex flex-col h-full">
      {/* Device Switcher */}
      <div className="flex items-center justify-between p-3 bg-[#0d1f35] border-b border-[#1e3a5f]">
        <div className="pm-device-switcher flex gap-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded transition-colors ${
              device === 'desktop' ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8] hover:text-white'
            }`}
            title="Desktop"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded transition-colors ${
              device === 'tablet' ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8] hover:text-white'
            }`}
            title="Tablet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded transition-colors ${
              device === 'mobile' ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8] hover:text-white'
            }`}
            title="Mobile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* URL Bar (cosmetic) */}
        <div className="flex-1 mx-4">
          <div className="bg-[#132743] rounded-lg px-3 py-1.5 text-sm text-[#64748b] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            yoursite.pocketmarketer.site
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="p-2 text-[#94a3b8] hover:text-white transition-colors" title="Refresh">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button className="p-2 text-[#94a3b8] hover:text-white transition-colors" title="Open in new tab">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#1e1e1e] overflow-auto flex justify-center p-4">
        <div
          className="pm-preview-frame bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: deviceWidths[device],
            maxWidth: '100%',
            height: device === 'mobile' ? '667px' : device === 'tablet' ? '1024px' : 'auto',
            minHeight: device === 'desktop' ? '600px' : undefined,
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state when no preview is available
 */
export function PreviewEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 mb-4 text-[#3b82f6] opacity-50">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-white font-medium mb-2">No Preview Yet</h3>
      <p className="text-[#64748b] text-sm max-w-xs">
        Select a template and describe what you want to build. Your website preview will appear here.
      </p>
    </div>
  );
}
