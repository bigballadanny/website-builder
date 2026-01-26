/**
 * Pocket Marketer API Client
 * 
 * This client fetches project context from Pocket Marketer.
 * Currently uses mock data - Suhail will replace with real API calls.
 */

import type { PMProjectContext, BrandDNA, BrandAssets, CopyAssets, Testimonial } from './types';

// Configuration
const PM_API_URL = process.env.PM_API_URL || 'https://api.pocketmarketer.app';
const PM_API_KEY = process.env.PM_API_KEY;

/**
 * Fetch complete project context from PM
 */
export async function getProjectContext(projectId: string): Promise<PMProjectContext> {
  // TODO: Replace with real API call when Suhail provides endpoint
  // const response = await fetch(`${PM_API_URL}/api/project/${projectId}/context`, {
  //   headers: { 'Authorization': `Bearer ${PM_API_KEY}` }
  // });
  // return response.json();
  
  // For now, return mock data for development
  return getMockProjectContext(projectId);
}

/**
 * Fetch brand assets from PM Knowledge Base
 */
export async function getProjectAssets(projectId: string): Promise<BrandAssets> {
  // TODO: Real API call
  return getMockAssets();
}

/**
 * Fetch copy from PM Copy Vault
 */
export async function getProjectCopy(projectId: string): Promise<CopyAssets> {
  // TODO: Real API call
  return getMockCopy();
}

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

function getMockProjectContext(projectId: string): PMProjectContext {
  return {
    projectId,
    brandDNA: getMockBrandDNA(),
    assets: getMockAssets(),
    copy: getMockCopy(),
    testimonials: getMockTestimonials(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getMockBrandDNA(): BrandDNA {
  return {
    // Realistic example for a meal prep service
    businessDescription: "We help busy professionals save time with healthy, pre-portioned meal kits delivered weekly.",
    idealCustomer: "Busy professionals aged 25-45 who want to eat healthy but don't have time to meal plan or grocery shop.",
    problemSolved: "We eliminate the stress of figuring out what to eat, grocery shopping, and meal prep - saving our customers 5-10 hours per week.",
    desiredTransformation: "They want to feel healthier, have more energy, and spend less time thinking about food so they can focus on what matters.",
    offering: "Weekly meal kit subscription with pre-portioned ingredients and 15-minute recipes. Plans start at $79/week.",
    differentiators: "Unlike meal delivery services, we teach you to cook. Our recipes are designed for real people - no fancy equipment, no obscure ingredients. Plus, everything is customizable for dietary restrictions.",
    customerAcquisition: "Most customers find us through Instagram or word-of-mouth from friends and family.",
    callToAction: "Get Your First Week 50% Off",
    salesProcess: "They sign up for a free recipe guide, then we nurture them with emails showing how easy our meals are to make. Most convert within 2 weeks.",
    objections: "Some think meal kits are too expensive or that they won't actually cook the meals.",
    socialProof: "Over 10,000 meals delivered. 4.8 stars on Trustpilot. Featured in Women's Health and Good Housekeeping.",
    mainGoal: "Double our subscriber base from 500 to 1,000 in the next 3 months.",
    
    projectName: "FreshPlate Meals",
    companyName: "FreshPlate",
    website: "https://freshplatemeals.com",
    voiceTone: "friendly",
    industry: "Food & Beverage",
  };
}

function getMockAssets(): BrandAssets {
  return {
    logo: {
      id: 'logo-1',
      name: 'freshplate-logo.png',
      url: 'https://placeholder.com/logo.png',
      type: 'image',
      mimeType: 'image/png',
      size: 24000,
    },
    brandColors: ['#22c55e', '#16a34a', '#0a1628', '#ffffff'],
    brandFonts: ['Inter', 'system-ui'],
    productImages: [
      {
        id: 'product-1',
        name: 'meal-kit-hero.jpg',
        url: 'https://placeholder.com/meal-hero.jpg',
        type: 'image',
        mimeType: 'image/jpeg',
        size: 150000,
      },
    ],
  };
}

function getMockCopy(): CopyAssets {
  return {
    headlines: [
      "Stop Stressing About Dinner",
      "Healthy Eating Made Stupidly Simple",
      "From Fridge to Table in 15 Minutes",
      "Finally, Meal Prep That Actually Works",
    ],
    offers: [
      "First Week 50% Off - No Commitment",
      "Free Recipe Guide + $20 Off Your First Box",
    ],
    adCopy: [
      "Tired of the 'what's for dinner?' panic at 6pm? We've got you.",
    ],
  };
}

function getMockTestimonials(): Testimonial[] {
  return [
    {
      id: 'test-1',
      quote: "I've tried every meal kit out there. FreshPlate is the only one I've stuck with for more than a month. The recipes are actually doable after a long day.",
      author: "Sarah M.",
      title: "Marketing Manager",
      rating: 5,
    },
    {
      id: 'test-2',
      quote: "My husband and I used to spend $200/week eating out because we were too tired to cook. Now we cook together 4 nights a week and actually enjoy it.",
      author: "Jennifer K.",
      title: "Working Mom of 2",
      rating: 5,
    },
    {
      id: 'test-3',
      quote: "Lost 15 pounds in 3 months without feeling like I was on a diet. The portions are perfect and the food actually tastes good.",
      author: "Mike T.",
      title: "Software Engineer",
      rating: 5,
    },
  ];
}

// ============================================
// REAL API INTEGRATION NOTES FOR SUHAIL
// ============================================

/**
 * SUHAIL - HERE'S WHAT WE NEED:
 * 
 * 1. GET /api/project/:id/context
 *    Returns: PMProjectContext (see types.ts)
 *    - Pulls from Interview answers
 *    - Pulls from Knowledge Base files
 *    - Pulls from Copy Vault
 * 
 * 2. GET /api/project/:id/assets
 *    Returns: Asset[]
 *    - Logo
 *    - Product images
 *    - Any uploaded files
 * 
 * 3. Auth: We need to share auth with PM
 *    - Same JWT/session token
 *    - Or internal API key for service-to-service
 * 
 * Database queries needed:
 * - Interview answers: probably in a `project_interviews` or similar table
 * - Knowledge Base: `project_files` or `knowledge_base_items`
 * - Copy Vault: `copy_vault_items` with category field
 * 
 * Let us know the actual table/field names and we'll update this client.
 */
