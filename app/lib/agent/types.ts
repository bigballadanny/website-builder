/**
 * Claude Agent SDK Types
 *
 * Types for the AI-powered page building agent workflow
 */

// Agent workflow steps
export type AgentStep =
  | 'idle'
  | 'understanding'
  | 'clarifying'
  | 'generating-structure'
  | 'generating-copy'
  | 'applying-styles'
  | 'previewing'
  | 'complete'
  | 'error';

// Model tiers
export type ModelTier = 'standard' | 'premium';

// Agent message types
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  step?: AgentStep;
  metadata?: {
    tokensUsed?: number;
    estimatedCost?: number;
    model?: string;
  };
}

// Clarifying question from agent
export interface ClarifyingQuestion {
  id: string;
  question: string;
  options?: string[]; // Quick select options
  required?: boolean;
}

// Page section definition
export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  content?: SectionContent;
  status: 'pending' | 'generating' | 'complete' | 'error';
}

// Available section types
export type SectionType =
  | 'hero'
  | 'features'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'about'
  | 'team'
  | 'contact'
  | 'gallery'
  | 'stats'
  | 'process'
  | 'comparison'
  | 'custom';

// Section content
export interface SectionContent {
  headline?: string;
  subheadline?: string;
  body?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
  cta?: {
    text: string;
    url?: string;
  };
  images?: string[];
}

// Page structure output from agent
export interface PageStructure {
  title: string;
  description: string;
  sections: PageSection[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    headingFont: string;
    bodyFont: string;
  };
}

// Generation progress
export interface GenerationProgress {
  step: AgentStep;
  progress: number; // 0-100
  currentSection?: string;
  sectionsComplete: number;
  sectionsTotal: number;
  message: string;
}

// Agent session state
export interface AgentSession {
  id: string;
  status: 'active' | 'paused' | 'complete' | 'error';
  startedAt: Date;
  messages: AgentMessage[];
  pageStructure?: PageStructure;
  generatedCode?: string;
  clarifyingQuestions?: ClarifyingQuestion[];
  progress: GenerationProgress;
  modelTier: ModelTier;
  totalTokensUsed: number;
  estimatedCost: number;
}

// Agent request
export interface AgentRequest {
  sessionId?: string;
  message: string;
  context?: {
    brandDNA?: Record<string, string>;
    existingCode?: string;
    selectedSections?: SectionType[];
  };
  modelTier?: ModelTier;
}

// Agent response (streamed)
export interface AgentStreamEvent {
  type:
    | 'message_start'
    | 'message_delta'
    | 'message_complete'
    | 'step_change'
    | 'progress_update'
    | 'section_complete'
    | 'code_chunk'
    | 'clarifying_question'
    | 'error';
  data: unknown;
}

// Refinement commands
export type RefinementCommand =
  | 'make_shorter'
  | 'make_longer'
  | 'make_formal'
  | 'make_casual'
  | 'make_urgent'
  | 'make_friendly'
  | 'add_humor'
  | 'simplify'
  | 'emphasize_benefits'
  | 'add_social_proof';

// Cost estimates
export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  model: string;
}

// Token pricing (per 1M tokens)
export const TOKEN_PRICING = {
  'claude-sonnet-4-20250514': {
    input: 3.0, // $3 per 1M input tokens
    output: 15.0, // $15 per 1M output tokens
  },
  'claude-opus-4-20250514': {
    input: 15.0, // $15 per 1M input tokens
    output: 75.0, // $75 per 1M output tokens
  },
} as const;
