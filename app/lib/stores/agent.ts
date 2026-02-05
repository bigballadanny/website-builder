/**
 * Agent Store
 *
 * State management for the AI page building agent workflow.
 * Uses nanostores for lightweight reactivity.
 */

import { atom, computed, map } from 'nanostores';
import type {
  AgentStep,
  AgentMessage,
  PageStructure,
  SectionContent,
  GenerationProgress,
  ModelTier,
  CostEstimate,
  ClarifyingQuestion,
} from '~/lib/agent/types';

// Session state
export const agentSessionId = atom<string | null>(null);
export const agentStatus = atom<'idle' | 'active' | 'paused' | 'complete' | 'error'>('idle');
export const agentStep = atom<AgentStep>('idle');
export const agentModelTier = atom<ModelTier>('standard');

// Messages
export const agentMessages = atom<AgentMessage[]>([]);

// Page structure and content
export const pageStructure = atom<PageStructure | null>(null);
export const sectionContents = map<Record<string, SectionContent>>({});
export const generatedCode = atom<string | null>(null);

// Progress tracking
export const generationProgress = atom<GenerationProgress>({
  step: 'idle',
  progress: 0,
  sectionsComplete: 0,
  sectionsTotal: 0,
  message: '',
});

// Clarifying questions
export const clarifyingQuestions = atom<ClarifyingQuestion[]>([]);

// Cost tracking
export const sessionCost = atom<CostEstimate>({
  inputTokens: 0,
  outputTokens: 0,
  inputCost: 0,
  outputCost: 0,
  totalCost: 0,
  model: 'claude-sonnet-4-20250514',
});

// Streaming state
export const isStreaming = atom<boolean>(false);
export const streamingContent = atom<string>('');

// Panel visibility
export const showAgentPanel = atom<boolean>(false);

// Computed: Is agent ready to generate?
export const canGenerate = computed(
  [agentStatus, pageStructure],
  (status, structure) => status === 'active' && structure !== null,
);

// Computed: Human-readable step name
export const stepDisplayName = computed(agentStep, (step) => {
  const names: Record<AgentStep, string> = {
    idle: 'Ready',
    understanding: 'Understanding your vision',
    clarifying: 'Gathering details',
    'generating-structure': 'Designing page structure',
    'generating-copy': 'Writing compelling copy',
    'applying-styles': 'Applying styles & generating code',
    previewing: 'Preparing preview',
    complete: 'Done!',
    error: 'Error occurred',
  };
  return names[step] || step;
});

// Computed: Progress percentage
export const progressPercent = computed(generationProgress, (p) => p.progress);

// Computed: Cost display string
export const costDisplay = computed(sessionCost, (cost) => {
  if (cost.totalCost < 0.01) {
    return `< $0.01`;
  }

  return `$${cost.totalCost.toFixed(3)}`;
});

// Computed: Tokens display
export const tokensDisplay = computed(sessionCost, (cost) => {
  const total = cost.inputTokens + cost.outputTokens;

  if (total >= 1000) {
    return `${(total / 1000).toFixed(1)}K tokens`;
  }

  return `${total} tokens`;
});

// Actions

/**
 * Start a new agent session
 */
export function startSession(): void {
  agentSessionId.set(crypto.randomUUID());
  agentStatus.set('active');
  agentStep.set('idle');
  agentMessages.set([]);
  pageStructure.set(null);
  sectionContents.set({});
  generatedCode.set(null);
  clarifyingQuestions.set([]);
  sessionCost.set({
    inputTokens: 0,
    outputTokens: 0,
    inputCost: 0,
    outputCost: 0,
    totalCost: 0,
    model: agentModelTier.get() === 'premium' ? 'claude-opus-4-20250514' : 'claude-sonnet-4-20250514',
  });
  generationProgress.set({
    step: 'idle',
    progress: 0,
    sectionsComplete: 0,
    sectionsTotal: 0,
    message: '',
  });
  showAgentPanel.set(true);
}

/**
 * Add a message to the conversation
 */
export function addMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): void {
  const fullMessage: AgentMessage = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  agentMessages.set([...agentMessages.get(), fullMessage]);
}

/**
 * Update the last assistant message (for streaming)
 */
export function updateLastAssistantMessage(content: string): void {
  const messages = agentMessages.get();
  const lastIndex = messages.length - 1;

  if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
    const updated = [...messages];
    updated[lastIndex] = {
      ...updated[lastIndex],
      content,
    };
    agentMessages.set(updated);
  }
}

/**
 * Set page structure
 */
export function setPageStructure(structure: PageStructure): void {
  pageStructure.set(structure);
  generationProgress.set({
    ...generationProgress.get(),
    sectionsTotal: structure.sections.length,
  });
}

/**
 * Update section content
 */
export function updateSectionContent(sectionId: string, content: SectionContent): void {
  sectionContents.setKey(sectionId, content);
}

/**
 * Set generated code
 */
export function setGeneratedCode(code: string): void {
  generatedCode.set(code);
}

/**
 * Update progress
 */
export function updateProgress(progress: Partial<GenerationProgress>): void {
  generationProgress.set({
    ...generationProgress.get(),
    ...progress,
  });
}

/**
 * Update step
 */
export function updateStep(step: AgentStep): void {
  agentStep.set(step);
  generationProgress.set({
    ...generationProgress.get(),
    step,
  });
}

/**
 * Update cost
 */
export function updateCost(inputTokens: number, outputTokens: number): void {
  const current = sessionCost.get();
  const tier = agentModelTier.get();
  const pricing = tier === 'premium' ? { input: 15.0, output: 75.0 } : { input: 3.0, output: 15.0 };

  const totalInput = current.inputTokens + inputTokens;
  const totalOutput = current.outputTokens + outputTokens;

  sessionCost.set({
    inputTokens: totalInput,
    outputTokens: totalOutput,
    inputCost: (totalInput / 1_000_000) * pricing.input,
    outputCost: (totalOutput / 1_000_000) * pricing.output,
    totalCost: (totalInput / 1_000_000) * pricing.input + (totalOutput / 1_000_000) * pricing.output,
    model: tier === 'premium' ? 'claude-opus-4-20250514' : 'claude-sonnet-4-20250514',
  });
}

/**
 * Set model tier
 */
export function setModelTier(tier: ModelTier): void {
  agentModelTier.set(tier);
}

/**
 * Set streaming state
 */
export function setStreaming(streaming: boolean): void {
  isStreaming.set(streaming);

  if (!streaming) {
    streamingContent.set('');
  }
}

/**
 * Update streaming content
 */
export function appendStreamingContent(content: string): void {
  streamingContent.set(streamingContent.get() + content);
}

/**
 * Complete session
 */
export function completeSession(): void {
  agentStatus.set('complete');
  agentStep.set('complete');
  updateProgress({ progress: 100, message: 'Page generation complete!' });
}

/**
 * Set error state
 */
export function setError(error: string): void {
  agentStatus.set('error');
  agentStep.set('error');
  updateProgress({ message: error });
}

/**
 * Toggle agent panel
 */
export function toggleAgentPanel(): void {
  showAgentPanel.set(!showAgentPanel.get());
}

/**
 * Reset agent state
 */
export function resetAgent(): void {
  agentSessionId.set(null);
  agentStatus.set('idle');
  agentStep.set('idle');
  agentMessages.set([]);
  pageStructure.set(null);
  sectionContents.set({});
  generatedCode.set(null);
  clarifyingQuestions.set([]);
  sessionCost.set({
    inputTokens: 0,
    outputTokens: 0,
    inputCost: 0,
    outputCost: 0,
    totalCost: 0,
    model: 'claude-sonnet-4-20250514',
  });
  generationProgress.set({
    step: 'idle',
    progress: 0,
    sectionsComplete: 0,
    sectionsTotal: 0,
    message: '',
  });
  isStreaming.set(false);
  streamingContent.set('');
}
