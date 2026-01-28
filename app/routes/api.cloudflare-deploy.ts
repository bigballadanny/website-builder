/**
 * Cloudflare Pages Deployment API
 *
 * Deploys generated HTML to Cloudflare Pages using Direct Upload.
 *
 * Required env vars:
 * - CLOUDFLARE_API_TOKEN: API token with Pages access
 * - CLOUDFLARE_ACCOUNT_ID: Your Cloudflare account ID
 */

import type { ActionFunction } from '@remix-run/cloudflare';

interface CloudflareEnv {
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { html, projectName } = body as {
      html: string;
      projectName: string;
    };

    // Sanitize project name for Cloudflare
    const sanitizedName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 63);

    // Get credentials
    const env = (context?.cloudflare?.env || process.env) as CloudflareEnv;
    const apiToken = env.CLOUDFLARE_API_TOKEN;
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;

    // If no credentials, return mock deployment (for development)
    if (!apiToken || !accountId) {
      console.log('Cloudflare credentials not configured - returning mock deployment');

      // Store HTML locally for preview in dev mode
      const mockId = Date.now().toString(36);
      const mockUrl = `https://${sanitizedName}.pages.dev`;

      return new Response(
        JSON.stringify({
          success: true,
          url: mockUrl,
          projectId: mockId,
          message: 'Mock deployment (no Cloudflare credentials configured)',
          mock: true,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // === REAL CLOUDFLARE DEPLOYMENT ===

    // Step 1: Check if project exists, create if not
    const projectsUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`;

    const existingProject = await fetch(`${projectsUrl}/${sanitizedName}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!existingProject.ok && existingProject.status !== 404) {
      throw new Error(`Failed to check project: ${await existingProject.text()}`);
    }

    // Create project if it doesn't exist
    if (existingProject.status === 404) {
      const createResp = await fetch(projectsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedName,
          production_branch: 'main',
        }),
      });

      if (!createResp.ok) {
        const error = await createResp.text();
        throw new Error(`Failed to create project: ${error}`);
      }
    }

    /*
     * Step 2: Create deployment using Direct Upload
     * We need to create a deployment with our HTML file
     */

    // Create the file manifest
    const files = new Map<string, string>();
    files.set('/index.html', html);

    // Upload using the simpler form-based approach
    const formData = new FormData();

    // Create a Blob for the HTML file
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('file', htmlBlob, 'index.html');

    // For Direct Upload, we use the deployment endpoint
    const deployUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${sanitizedName}/deployments`;

    const deployResp = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: formData,
    });

    if (!deployResp.ok) {
      const error = await deployResp.text();
      throw new Error(`Deployment failed: ${error}`);
    }

    const deployResult = (await deployResp.json()) as {
      success: boolean;
      result?: {
        id: string;
        url: string;
        project_name: string;
      };
      errors?: Array<{ message: string }>;
    };

    if (!deployResult.success) {
      throw new Error(deployResult.errors?.[0]?.message || 'Deployment failed');
    }

    const deployedUrl = deployResult.result?.url || `https://${sanitizedName}.pages.dev`;

    return new Response(
      JSON.stringify({
        success: true,
        url: deployedUrl,
        projectId: deployResult.result?.id,
        projectName: sanitizedName,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};

/**
 * GET handler to check deployment status
 */
export const loader = async ({ request, context }: { request: Request; context: any }) => {
  const url = new URL(request.url);
  const projectName = url.searchParams.get('project');

  if (!projectName) {
    return new Response(JSON.stringify({ configured: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = (context?.cloudflare?.env || process.env) as CloudflareEnv;
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;

  return new Response(
    JSON.stringify({
      configured: !!(apiToken && accountId),
      accountId: accountId ? accountId.slice(0, 8) + '...' : null,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
