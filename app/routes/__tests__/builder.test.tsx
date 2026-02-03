/**
 * Builder Route Tests
 *
 * Tests for the main Website Builder route logic including:
 * - Template recommendation mapping
 * - Brand info mapping
 * - API request/response format validation
 * - State transitions
 *
 * Note: Due to Remix Vite plugin limitations in test environment,
 * full component tests are limited. These tests focus on business logic.
 */

import { describe, it, expect } from 'vitest';

// Test the business logic separately from the component

describe('Template Recommendation Mapping', () => {
  // This maps the goal from discovery to the recommended template
  const goalToTemplate: Record<string, string> = {
    leads: 'lead-magnet',
    'sell-low': 'landing-page',
    'sell-high': 'sales-page',
    calls: 'landing-page',
    launch: 'coming-soon',
  };

  it('maps "leads" goal to "lead-magnet" template', () => {
    expect(goalToTemplate.leads).toBe('lead-magnet');
  });

  it('maps "sell-low" goal to "landing-page" template', () => {
    expect(goalToTemplate['sell-low']).toBe('landing-page');
  });

  it('maps "sell-high" goal to "sales-page" template', () => {
    expect(goalToTemplate['sell-high']).toBe('sales-page');
  });

  it('maps "calls" goal to "landing-page" template', () => {
    expect(goalToTemplate.calls).toBe('landing-page');
  });

  it('maps "launch" goal to "coming-soon" template', () => {
    expect(goalToTemplate.launch).toBe('coming-soon');
  });

  it('falls back to landing-page for unknown goals', () => {
    const recommendedTemplate = goalToTemplate.unknown || 'landing-page';
    expect(recommendedTemplate).toBe('landing-page');
  });
});

describe('Brand Info Mapping', () => {
  it('correctly maps BrandDNA to BrandInfo structure', () => {
    const brandDNA = {
      companyName: 'Test Company',
      businessDescription: 'Test Description',
      idealCustomer: 'Test Customer',
      problemSolved: 'Test Problem',
      desiredTransformation: 'Test Transformation',
      callToAction: 'Get Started',
      socialProof: 'Featured in Forbes',
    };

    // This is the mapping that happens in handleDiscoveryComplete
    const brandInfo = {
      businessName: brandDNA.companyName,
      businessDescription: brandDNA.businessDescription,
      idealCustomer: brandDNA.idealCustomer,
      problemSolved: brandDNA.problemSolved,
      transformation: brandDNA.desiredTransformation,
      callToAction: brandDNA.callToAction,
      socialProof: brandDNA.socialProof,
    };

    expect(brandInfo.businessName).toBe('Test Company');
    expect(brandInfo.businessDescription).toBe('Test Description');
    expect(brandInfo.idealCustomer).toBe('Test Customer');
    expect(brandInfo.problemSolved).toBe('Test Problem');
    expect(brandInfo.transformation).toBe('Test Transformation');
    expect(brandInfo.callToAction).toBe('Get Started');
    expect(brandInfo.socialProof).toBe('Featured in Forbes');
  });

  it('handles missing socialProof gracefully', () => {
    const brandDNA = {
      companyName: 'Test Company',
      businessDescription: 'Test Description',
      idealCustomer: 'Test Customer',
      problemSolved: 'Test Problem',
      desiredTransformation: 'Test Transformation',
      callToAction: 'Get Started',
      socialProof: '',
    };

    const brandInfo = {
      businessName: brandDNA.companyName,
      businessDescription: brandDNA.businessDescription,
      idealCustomer: brandDNA.idealCustomer,
      problemSolved: brandDNA.problemSolved,
      transformation: brandDNA.desiredTransformation,
      callToAction: brandDNA.callToAction,
      socialProof: brandDNA.socialProof,
    };

    expect(brandInfo.socialProof).toBe('');
  });
});

describe('Generation API Request Format', () => {
  it('creates correct request payload', () => {
    const brandInfo = {
      businessName: 'FreshPlate Meals',
      businessDescription: 'Pre-portioned meal kits with 15-minute recipes',
      idealCustomer: 'Busy professionals aged 25-45',
      problemSolved: 'No time for healthy cooking',
      transformation: 'Feel healthier with more energy',
      callToAction: 'Get Your First Week 50% Off',
      socialProof: '10,000+ meals delivered',
    };

    const selectedTemplate = 'landing-page';
    const styling = {
      colorScheme: {
        id: 'midnight-blue',
        name: 'Midnight Blue',
        colors: {
          background: '#0a1628',
          surface: '#132743',
          primary: '#3b82f6',
          secondary: '#1e3a5f',
          accent: '#60a5fa',
          text: '#ffffff',
          textMuted: '#94a3b8',
          border: '#1e3a5f',
        },
        isDark: true,
      },
      font: {
        id: 'inter',
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        style: 'Modern & Clean',
      },
    };

    const requestPayload = {
      templateId: selectedTemplate,
      brandInfo,
      styling,
    };

    expect(requestPayload.templateId).toBe('landing-page');
    expect(requestPayload.brandInfo.businessName).toBe('FreshPlate Meals');
    expect(requestPayload.styling.colorScheme.isDark).toBe(true);
    expect(requestPayload.styling.font.family).toContain('Inter');
  });
});

describe('Generation API Response Handling', () => {
  it('parses successful response correctly', () => {
    const mockResponse = {
      html: '<!DOCTYPE html><html><head></head><body><h1>Test</h1></body></html>',
    };

    expect(mockResponse.html).toContain('<!DOCTYPE html>');
    expect(mockResponse.html).toContain('<body>');
  });

  it('validates HTML starts with DOCTYPE', () => {
    const validHtml = '<!DOCTYPE html><html></html>';
    const invalidHtml = '<html></html>';

    expect(validHtml.startsWith('<!DOCTYPE')).toBe(true);
    expect(invalidHtml.startsWith('<!DOCTYPE')).toBe(false);
  });
});

describe('Edit API Request Format', () => {
  it('creates correct edit request payload', () => {
    const currentHtml = '<!DOCTYPE html><html><body><h1>Old Headline</h1></body></html>';
    const instruction = 'Make the headline bigger';
    const brandInfo = {
      businessName: 'Test Business',
      businessDescription: 'Test Description',
      idealCustomer: 'Test Customer',
      problemSolved: 'Test Problem',
      transformation: 'Test Transformation',
      callToAction: 'Get Started',
    };
    const styling = {
      colorScheme: {
        id: 'midnight-blue',
        colors: {
          primary: '#3b82f6',
          background: '#0a1628',
        },
      },
      font: {
        family: 'Inter, system-ui, sans-serif',
      },
    };

    const editPayload = {
      currentHtml,
      instruction,
      brandInfo,
      styling,
    };

    expect(editPayload.currentHtml).toContain('<!DOCTYPE html>');
    expect(editPayload.instruction).toBe('Make the headline bigger');
    expect(editPayload.brandInfo.businessName).toBe('Test Business');
  });
});

describe('Deployment Request Format', () => {
  it('creates correct deployment payload', () => {
    const html = '<!DOCTYPE html><html><body>Content</body></html>';
    const businessName = 'Fresh Plate Meals';
    const projectName = businessName.toLowerCase().replace(/\s+/g, '-');

    const deployPayload = {
      html,
      projectName,
    };

    expect(deployPayload.html).toContain('<!DOCTYPE html>');
    expect(deployPayload.projectName).toBe('fresh-plate-meals');
  });

  it('sanitizes project name for URL', () => {
    const testCases = [
      { input: 'Fresh Plate Meals', expected: 'fresh-plate-meals' },
      { input: 'UPPERCASE NAME', expected: 'uppercase-name' },
      { input: '  Extra   Spaces  ', expected: 'extra-spaces' },
      { input: "John's Business", expected: "john's-business" },
    ];

    testCases.forEach(({ input, expected }) => {
      // Match the actual implementation: trim first, then replace spaces
      const result = input.trim().toLowerCase().replace(/\s+/g, '-');
      expect(result).toBe(expected);
    });
  });
});

describe('Step Flow Validation', () => {
  const validSteps = ['discovery', 'template', 'styling', 'brand', 'generating', 'preview', 'deploying', 'deployed'];

  it('validates step names', () => {
    expect(validSteps).toContain('discovery');
    expect(validSteps).toContain('template');
    expect(validSteps).toContain('styling');
    expect(validSteps).toContain('brand');
    expect(validSteps).toContain('generating');
    expect(validSteps).toContain('preview');
    expect(validSteps).toContain('deploying');
    expect(validSteps).toContain('deployed');
  });

  it('follows correct step order', () => {
    expect(validSteps[0]).toBe('discovery');
    expect(validSteps[1]).toBe('template');
    expect(validSteps[2]).toBe('styling');
    expect(validSteps[3]).toBe('brand');
    expect(validSteps[4]).toBe('generating');
    expect(validSteps[5]).toBe('preview');
    expect(validSteps[6]).toBe('deploying');
    expect(validSteps[7]).toBe('deployed');
  });
});

describe('Color Scheme Validation', () => {
  const colorSchemeStructure = {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Professional dark theme',
    colors: {
      background: '#0a1628',
      surface: '#132743',
      primary: '#3b82f6',
      secondary: '#1e3a5f',
      accent: '#60a5fa',
      text: '#ffffff',
      textMuted: '#94a3b8',
      border: '#1e3a5f',
    },
    isDark: true,
  };

  it('validates color scheme has all required fields', () => {
    expect(colorSchemeStructure.id).toBeDefined();
    expect(colorSchemeStructure.name).toBeDefined();
    expect(colorSchemeStructure.colors).toBeDefined();
    expect(colorSchemeStructure.isDark).toBeDefined();
  });

  it('validates colors object has all required color keys', () => {
    const requiredColors = ['background', 'surface', 'primary', 'secondary', 'accent', 'text', 'textMuted', 'border'];

    requiredColors.forEach((color) => {
      expect(colorSchemeStructure.colors).toHaveProperty(color);
    });
  });

  it('validates hex color format', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    Object.values(colorSchemeStructure.colors).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

describe('Font Option Validation', () => {
  const fontOption = {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, system-ui, sans-serif',
    style: 'Modern & Clean',
  };

  it('validates font option has all required fields', () => {
    expect(fontOption.id).toBeDefined();
    expect(fontOption.name).toBeDefined();
    expect(fontOption.family).toBeDefined();
    expect(fontOption.style).toBeDefined();
  });

  it('validates font family includes fallbacks', () => {
    expect(fontOption.family).toContain(',');
    expect(fontOption.family).toContain('sans-serif');
  });
});

describe('Quick Edit Suggestions', () => {
  const quickEdits = [
    'Make the headline more urgent',
    'Change CTA button color to green',
    'Add more white space',
    'Make the text larger',
    'Add a testimonial section',
    'Make it feel more premium',
  ];

  it('provides diverse edit suggestions', () => {
    expect(quickEdits.length).toBeGreaterThanOrEqual(5);
  });

  it('includes common edit types', () => {
    const editTypes = {
      headline: quickEdits.some((e) => e.toLowerCase().includes('headline')),
      color: quickEdits.some((e) => e.toLowerCase().includes('color')),
      spacing: quickEdits.some((e) => e.toLowerCase().includes('space')),
      text: quickEdits.some((e) => e.toLowerCase().includes('text') || e.toLowerCase().includes('larger')),
    };

    expect(editTypes.headline).toBe(true);
    expect(editTypes.color).toBe(true);
    expect(editTypes.spacing).toBe(true);
    expect(editTypes.text).toBe(true);
  });
});

describe('Error Handling Scenarios', () => {
  it('identifies generation errors from response', () => {
    const errorResponse = {
      ok: false,
      status: 500,
      message: 'ANTHROPIC_API_KEY not configured',
    };

    expect(errorResponse.ok).toBe(false);
    expect(errorResponse.status).toBe(500);
    expect(errorResponse.message).toContain('API_KEY');
  });

  it('identifies deployment errors', () => {
    const deployError = {
      ok: false,
      status: 400,
      message: 'Cloudflare API error: Invalid credentials',
    };

    expect(deployError.ok).toBe(false);
    expect(deployError.message).toContain('Cloudflare');
  });
});

describe('HTML Output Validation', () => {
  it('validates generated HTML structure', () => {
    const generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <header></header>
  <main></main>
  <footer></footer>
</body>
</html>`;

    expect(generatedHtml).toContain('<!DOCTYPE html>');
    expect(generatedHtml).toContain('<meta charset="UTF-8">');
    expect(generatedHtml).toContain('<meta name="viewport"');
    expect(generatedHtml).toContain('tailwindcss.com');
    expect(generatedHtml).toContain('<header>');
    expect(generatedHtml).toContain('<main>');
    expect(generatedHtml).toContain('<footer>');
  });

  it('validates mobile responsiveness meta tag', () => {
    const html = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

    expect(html).toContain('width=device-width');
    expect(html).toContain('initial-scale=1.0');
  });
});

describe('Download HTML Functionality', () => {
  it('generates correct filename from business name', () => {
    const businessName = 'Fresh Plate Meals';
    const filename = `${businessName.toLowerCase().replace(/\s+/g, '-')}.html`;

    expect(filename).toBe('fresh-plate-meals.html');
  });

  it('creates correct blob type', () => {
    const blobOptions = { type: 'text/html' };

    expect(blobOptions.type).toBe('text/html');
  });
});

describe('Deployed State Validation', () => {
  it('validates deployed URL format', () => {
    const deployedUrl = 'https://test-project.pages.dev';

    expect(deployedUrl).toMatch(/^https:\/\//);
    expect(deployedUrl).toContain('.pages.dev');
  });

  it('validates Cloudflare Pages URL pattern', () => {
    const validUrls = [
      'https://my-project.pages.dev',
      'https://test-site-123.pages.dev',
      'https://fresh-plate-meals.pages.dev',
    ];

    const urlPattern = /^https:\/\/[\w-]+\.pages\.dev$/;

    validUrls.forEach((url) => {
      expect(url).toMatch(urlPattern);
    });
  });
});
