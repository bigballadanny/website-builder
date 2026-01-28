/**
 * Package version constraints for reliable WebContainer builds
 * These are validated versions that work correctly in the WebContainer environment
 */
export const RECOMMENDED_PACKAGES = {
  // Icons - use lucide-react NOT lucide
  icons: {
    "lucide-react": "^0.460.0"  // Stable version, NOT "lucide" alone
  },
  
  // Core React ecosystem
  react: {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  
  // Build tools
  build: {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  },
  
  // Styling
  styling: {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
};

export const PACKAGE_VERSION_GUIDANCE = `
CRITICAL PACKAGE VERSION RULES:
- For icons: Use "lucide-react" (NOT "lucide" alone) version "^0.460.0"
- For React: Use "react" and "react-dom" version "^18.2.0"
- For Vite: Use "vite" version "^5.0.0"
- For Tailwind: Use "tailwindcss" version "^3.4.0"
- NEVER use version "^0.263.1" for any lucide package - it doesn't exist
`;
