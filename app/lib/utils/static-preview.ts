/**
 * Static Preview Utility
 * Combines generated files into a single HTML document for instant preview
 * No WebContainer or dev server needed!
 */

export interface GeneratedFiles {
  'index.html'?: string;
  'style.css'?: string;
  'main.js'?: string;
  [key: string]: string | undefined;
}

export function combineToStaticHtml(files: GeneratedFiles): string {
  const html = files['index.html'] || '';
  const css = files['style.css'] || '';
  const js = files['main.js'] || '';
  
  // If HTML already complete, inject CSS and JS
  if (html.includes('<!DOCTYPE') || html.includes('<html')) {
    let result = html;
    
    // Inject CSS before </head>
    if (css && result.includes('</head>')) {
      result = result.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }
    
    // Inject JS before </body>
    if (js && result.includes('</body>')) {
      // Remove import statements (not needed in static context)
      const cleanJs = js.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
      result = result.replace('</body>', `<script>\n${cleanJs}\n</script>\n</body>`);
    }
    
    return result;
  }
  
  // Build complete document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <style>
    ${css}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${js.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')}
  </script>
</body>
</html>`;
}

export function createBlobUrl(html: string): string {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}
