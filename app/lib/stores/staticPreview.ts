import { atom } from 'nanostores';
import type { FileMap } from './files';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('StaticPreview');

export interface StaticPreviewState {
  url: string | null;
  isActive: boolean;
  lastUpdated: number;
  error: string | null;
}

// Atom for static preview state
export const staticPreviewState = atom<StaticPreviewState>({
  url: null,
  isActive: false,
  lastUpdated: 0,
  error: null,
});

// Track the current blob URL to revoke it when creating a new one
let currentBlobUrl: string | null = null;

/**
 * Extracts the body content from an HTML string
 */
function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (bodyMatch) {
    return bodyMatch[1];
  }

  // If no body tag, return the whole content (might be a partial)
  return html;
}

/**
 * Extracts existing style and script tags from HTML head
 */
function extractHeadContent(html: string): { styles: string; scripts: string } {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    return { styles: '', scripts: '' };
  }

  const headContent = headMatch[1];

  // Extract style tags
  const styleMatches = headContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  const styles = styleMatches.join('\n');

  // Extract inline scripts (not external)
  const scriptMatches = headContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  const scripts = scriptMatches.filter((s) => !s.includes('src=')).join('\n');

  return { styles, scripts };
}

/**
 * Finds CSS content from files
 */
function findCssContent(files: FileMap): string {
  const cssFiles: string[] = [];

  // Priority order for CSS files
  const cssPatterns = [/\/style\.css$/, /\/styles\.css$/, /\/index\.css$/, /\/main\.css$/, /\/app\.css$/, /\.css$/];

  for (const [path, file] of Object.entries(files)) {
    if (file?.type === 'file' && path.endsWith('.css') && !file.isBinary) {
      cssFiles.push(path);
    }
  }

  // Sort by priority
  cssFiles.sort((a, b) => {
    for (const pattern of cssPatterns) {
      const aMatch = pattern.test(a);
      const bMatch = pattern.test(b);

      if (aMatch && !bMatch) {
        return -1;
      }

      if (!aMatch && bMatch) {
        return 1;
      }
    }
    return 0;
  });

  // Combine all CSS content
  return cssFiles
    .map((path) => {
      const file = files[path];

      if (file?.type === 'file' && !file.isBinary) {
        return `/* ${path} */\n${file.content}`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Finds JavaScript content from files
 */
function findJsContent(files: FileMap): string {
  const jsFiles: string[] = [];

  // Priority order for JS files
  const jsPatterns = [/\/main\.js$/, /\/script\.js$/, /\/app\.js$/, /\/index\.js$/, /\.js$/];

  // Exclude patterns (framework files, node_modules, etc.)
  const excludePatterns = [/node_modules/, /\.config\./, /\.min\.js$/, /vite/, /react/, /vue/];

  for (const [path, file] of Object.entries(files)) {
    if (file?.type === 'file' && path.endsWith('.js') && !file.isBinary) {
      // Skip excluded patterns
      if (excludePatterns.some((p) => p.test(path))) {
        continue;
      }

      jsFiles.push(path);
    }
  }

  // Sort by priority
  jsFiles.sort((a, b) => {
    for (const pattern of jsPatterns) {
      const aMatch = pattern.test(a);
      const bMatch = pattern.test(b);

      if (aMatch && !bMatch) {
        return -1;
      }

      if (!aMatch && bMatch) {
        return 1;
      }
    }
    return 0;
  });

  // Combine all JS content
  return jsFiles
    .map((path) => {
      const file = files[path];

      if (file?.type === 'file' && !file.isBinary) {
        return `// ${path}\n${file.content}`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Finds the main HTML file
 */
function findHtmlFile(files: FileMap): { path: string; content: string } | null {
  // Priority order for HTML files
  const htmlPatterns = [/\/index\.html$/, /\/main\.html$/, /\/home\.html$/, /\.html$/];

  const htmlFiles: string[] = [];

  for (const [path, file] of Object.entries(files)) {
    if (file?.type === 'file' && path.endsWith('.html') && !file.isBinary) {
      htmlFiles.push(path);
    }
  }

  if (htmlFiles.length === 0) {
    return null;
  }

  // Sort by priority
  htmlFiles.sort((a, b) => {
    for (const pattern of htmlPatterns) {
      const aMatch = pattern.test(a);
      const bMatch = pattern.test(b);

      if (aMatch && !bMatch) {
        return -1;
      }

      if (!aMatch && bMatch) {
        return 1;
      }
    }
    return 0;
  });

  const path = htmlFiles[0];
  const file = files[path];

  if (file?.type === 'file' && !file.isBinary) {
    return { path, content: file.content };
  }

  return null;
}

/**
 * Detects if the project uses a framework that requires a build step
 */
function detectFramework(files: FileMap): string | null {
  for (const path of Object.keys(files)) {
    if (path.includes('package.json')) {
      const file = files[path];

      if (file?.type === 'file' && !file.isBinary) {
        const content = file.content.toLowerCase();

        if (content.includes('"react"') || content.includes('"next"')) {
          return 'React';
        }

        if (content.includes('"vue"')) {
          return 'Vue';
        }

        if (content.includes('"svelte"')) {
          return 'Svelte';
        }

        if (content.includes('"angular"')) {
          return 'Angular';
        }
      }
    }

    // Check for JSX/TSX files
    if (path.endsWith('.jsx') || path.endsWith('.tsx')) {
      return 'React';
    }

    if (path.endsWith('.vue')) {
      return 'Vue';
    }

    if (path.endsWith('.svelte')) {
      return 'Svelte';
    }
  }
  return null;
}

/**
 * Creates a static preview from the generated files
 * Returns a blob URL that can be used in an iframe
 */
export function createStaticPreview(files: FileMap): string | null {
  logger.debug('Creating static preview from files:', Object.keys(files).length);

  // Check for framework that requires build
  const framework = detectFramework(files);

  if (framework) {
    logger.debug(`Detected ${framework} framework - static preview may be limited`);

    // We still try to create a preview, but warn the user
  }

  // Find HTML file
  const htmlFile = findHtmlFile(files);

  if (!htmlFile) {
    logger.debug('No HTML file found for static preview');
    staticPreviewState.set({
      url: null,
      isActive: false,
      lastUpdated: Date.now(),
      error: 'No HTML file found',
    });

    return null;
  }

  logger.debug('Found HTML file:', htmlFile.path);

  // Extract HTML parts
  const bodyContent = extractBodyContent(htmlFile.content);
  const { styles: headStyles, scripts: headScripts } = extractHeadContent(htmlFile.content);

  // Find CSS and JS from separate files
  const cssContent = findCssContent(files);
  const jsContent = findJsContent(files);

  logger.debug('CSS content length:', cssContent.length);
  logger.debug('JS content length:', jsContent.length);

  // Build the combined HTML
  const combinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  ${headStyles}
  <style>
    ${cssContent}
  </style>
</head>
<body>
  ${bodyContent}
  ${headScripts}
  <script>
    try {
      ${jsContent}
    } catch (e) {
      console.error('Static preview JS error:', e);
    }
  </script>
</body>
</html>`;

  // Revoke old blob URL if exists
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  // Create new blob URL
  const blob = new Blob([combinedHtml], { type: 'text/html' });
  currentBlobUrl = URL.createObjectURL(blob);

  logger.debug('Created static preview blob URL');

  // Update state
  staticPreviewState.set({
    url: currentBlobUrl,
    isActive: true,
    lastUpdated: Date.now(),
    error: framework ? `Note: ${framework} project detected - some features may require WebContainer` : null,
  });

  return currentBlobUrl;
}

/**
 * Clears the static preview and revokes the blob URL
 */
export function clearStaticPreview(): void {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  staticPreviewState.set({
    url: null,
    isActive: false,
    lastUpdated: Date.now(),
    error: null,
  });

  logger.debug('Cleared static preview');
}

/**
 * Gets the current static preview URL
 */
export function getStaticPreviewUrl(): string | null {
  return staticPreviewState.get().url;
}

/**
 * Checks if static preview is currently active
 */
export function isStaticPreviewActive(): boolean {
  return staticPreviewState.get().isActive;
}
