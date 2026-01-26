/**
 * Pocket Marketer Integration Types
 * 
 * These types represent the data we'll pull from PM's existing
 * Interview, Knowledge Base, and Copy Vault features.
 */

/**
 * Brand DNA - Core identity extracted from PM Interview
 */
export interface BrandDNA {
  // From Interview Questions
  businessDescription: string;      // "What does your business do, in one sentence?"
  idealCustomer: string;            // "Who is your ideal customer?"
  problemSolved: string;            // "What specific problem do you solve for them?"
  desiredTransformation: string;    // "What result or transformation do they want most?"
  offering: string;                 // "What exactly are you selling them?"
  differentiators: string;          // "Why should they choose you over someone else?"
  customerAcquisition: string;      // "How do customers usually find you?"
  callToAction: string;             // "What do you want them to do when they find you?"
  salesProcess: string;             // "How do you usually make the sale?"
  objections: string;               // "What makes people hesitate or say 'no'?"
  socialProof: string;              // "Do you have any reviews, testimonials, or proof?"
  mainGoal: string;                 // "What's your biggest goal right now?"
  
  // From Project Setup
  projectName: string;
  companyName: string;
  website?: string;
  
  // Extracted/derived
  voiceTone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  industry?: string;
}

/**
 * Brand Assets - From Knowledge Base
 */
export interface BrandAssets {
  logo?: Asset;
  brandColors?: string[];           // Hex colors
  brandFonts?: string[];            // Font names
  productImages?: Asset[];
  teamPhotos?: Asset[];
  certifications?: Asset[];
  guidelines?: Asset;               // Brand guidelines PDF
}

/**
 * Copy Assets - From Copy Vault
 */
export interface CopyAssets {
  strategyDoc?: string;
  headlines?: string[];             // From "Hooks and Headlines"
  promotionalEmails?: string[];
  followUpEmails?: string[];
  offers?: string[];                // From "Offers and Promotions"
  adCopy?: string[];
  socialContent?: string[];
  salesCopy?: string[];
}

/**
 * Testimonial structure
 */
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string;
  rating?: number;                  // 1-5 stars
}

/**
 * Asset (file reference)
 */
export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'video' | 'other';
  mimeType: string;
  size: number;
}

/**
 * Complete PM Project Context
 * Everything we need to generate a website
 */
export interface PMProjectContext {
  projectId: string;
  brandDNA: BrandDNA;
  assets: BrandAssets;
  copy: CopyAssets;
  testimonials: Testimonial[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Website Project (our creation)
 */
export interface WebsiteProject {
  id: string;
  pmProjectId: string;              // Link to PM project
  userId: string;
  
  // Config
  name: string;
  template: 'landing-page' | 'sales-page' | 'lead-magnet' | 'coming-soon';
  customDomain?: string;
  
  // Generated content
  pages: WebsitePage[];
  
  // Deployment
  cloudflareProjectId?: string;
  liveUrl?: string;
  lastDeployed?: Date;
  
  // History
  versions: WebsiteVersion[];
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Website Page
 */
export interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  
  // Content
  html: string;                     // Generated HTML
  css?: string;                     // Page-specific CSS
  
  // SEO
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

/**
 * Version history
 */
export interface WebsiteVersion {
  id: string;
  timestamp: Date;
  changes: string;
  snapshot: string;                 // HTML snapshot
}

/**
 * Generation request
 */
export interface GenerationRequest {
  pmProjectId: string;
  template: WebsiteProject['template'];
  customizations?: {
    sections?: string[];            // Which sections to include
    style?: Record<string, string>; // Style overrides
    content?: Record<string, string>; // Content overrides
  };
}

/**
 * Edit request
 */
export interface EditRequest {
  websiteProjectId: string;
  pageId: string;
  instruction: string;              // Natural language instruction
  // e.g., "Make the headline more urgent"
  // e.g., "Change the CTA button to green"
  // e.g., "Add a testimonial section after the benefits"
}
