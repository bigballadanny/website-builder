/**
 * useAgent Hook
 *
 * React hook for interacting with the AI page building agent.
 */

import { useCallback, useRef } from 'react';
import { useStore } from '@nanostores/react';
import {
  agentMessages,
  agentStep,
  agentStatus,
  agentModelTier,
  pageStructure,
  sectionContents,
  generatedCode,
  isStreaming,
  streamingContent,
  showAgentPanel,
  addMessage,
  updateLastAssistantMessage,
  setPageStructure,
  updateSectionContent,
  setGeneratedCode,
  updateProgress,
  updateStep,
  updateCost,
  setStreaming,
  appendStreamingContent,
  completeSession,
  setError,
  startSession,
  resetAgent,
  toggleAgentPanel,
  setModelTier,
} from '~/lib/stores/agent';
import { extractCodeFromResponse, parsePageStructure, parseSectionContent } from '~/lib/agent/agent-service';
import type {
  AgentMessage,
  ModelTier,
  RefinementCommand,
  SectionContent,
  PageStructure as PageStructureType,
} from '~/lib/agent/types';

interface UseAgentOptions {
  onCodeGenerated?: (code: string) => void;
  onError?: (error: string) => void;
}

export function useAgent(options: UseAgentOptions = {}) {
  const messages = useStore(agentMessages);
  const step = useStore(agentStep);
  const status = useStore(agentStatus);
  const modelTier = useStore(agentModelTier);
  const structure = useStore(pageStructure);
  const contents = useStore(sectionContents);
  const code = useStore(generatedCode);
  const streaming = useStore(isStreaming);
  const streamContent = useStore(streamingContent);
  const isPanelVisible = useStore(showAgentPanel);

  const abortControllerRef = useRef<AbortController | null>(null);
  const contextRef = useRef<Record<string, string>>({});

  /**
   * Send a message to the agent API and handle streaming response
   */
  const streamFromAPI = useCallback(
    async (action: string, payload: Record<string, unknown>): Promise<string> => {
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setStreaming(true);

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            modelTier,
            ...payload,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(errorData.error || 'API request failed');
        }

        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullContent = '';

        // Add a placeholder assistant message for streaming
        addMessage({ role: 'assistant', content: '' });

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              continue;
            }

            try {
              const event = JSON.parse(data);

              switch (event.type) {
                case 'start':
                  // Stream started
                  break;

                case 'delta':
                  fullContent += event.text;
                  appendStreamingContent(event.text);
                  updateLastAssistantMessage(fullContent);
                  break;

                case 'complete':
                  if (event.usage) {
                    updateCost(event.usage.input_tokens, event.usage.output_tokens);
                  }

                  break;

                case 'error':
                  throw new Error(event.error);
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                continue;
              } // Skip malformed JSON

              throw e;
            }
          }
        }

        return fullContent;
      } finally {
        setStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [modelTier],
  );

  /**
   * Send a chat message to the agent
   */
  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!message.trim() || streaming) {
        return;
      }

      // Add user message
      addMessage({ role: 'user', content: message });

      try {
        // Determine action based on current step
        let action = 'chat';
        const payload: Record<string, unknown> = {
          message,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          context: contextRef.current,
        };

        // If this is the first message, start understanding
        if (step === 'idle' || messages.length === 0) {
          action = 'understand';
          updateStep('understanding');
          updateProgress({ progress: 5, message: 'Understanding your vision...' });
        }

        const response = await streamFromAPI(action, payload);

        // Check if response contains page structure JSON
        const { json } = extractCodeFromResponse(response);

        if (json) {
          const parsedStructure = parsePageStructure(json);

          if (parsedStructure) {
            setPageStructure(parsedStructure);
            // Automatically transition to full generation flow
            await generateFullPage(message);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [messages, step, streaming, streamFromAPI, options],
  );

  /**
   * Generate the full page (structure → copy → code)
   */
  const generateFullPage = useCallback(
    async (userDescription: string): Promise<void> => {
      try {
        // Step 1: Understanding
        updateStep('understanding');
        updateProgress({ progress: 5, message: 'Understanding your vision...' });

        addMessage({ role: 'user', content: userDescription });

        // Get clarifying response
        const understandingResponse = await streamFromAPI('understand', {
          message: userDescription,
          context: contextRef.current,
        });

        // Step 2: Generate structure
        updateStep('generating-structure');
        updateProgress({ progress: 15, message: 'Designing page structure...' });

        const structureResponse = await streamFromAPI('structure', {
          message: 'Now create the page structure based on our discussion.',
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          context: contextRef.current,
        });

        // Parse structure
        const { json: structureJson } = extractCodeFromResponse(structureResponse);

        if (!structureJson) {
          throw new Error('Failed to generate page structure');
        }

        const parsedStructure = parsePageStructure(structureJson);

        if (!parsedStructure) {
          throw new Error('Failed to parse page structure');
        }

        setPageStructure(parsedStructure);

        // Step 3: Generate copy for each section
        updateStep('generating-copy');

        const sectionContentsMap: Record<string, SectionContent> = {};

        for (let i = 0; i < parsedStructure.sections.length; i++) {
          const section = parsedStructure.sections[i];
          const progress = 20 + (i / parsedStructure.sections.length) * 40;

          updateProgress({
            progress,
            currentSection: section.title,
            sectionsComplete: i,
            sectionsTotal: parsedStructure.sections.length,
            message: `Writing copy for ${section.title}...`,
          });

          const copyResponse = await streamFromAPI('copy', {
            sectionType: section.type,
            sectionTitle: section.title,
            sectionIndex: i,
            totalSections: parsedStructure.sections.length,
            pageStructure: parsedStructure,
            context: contextRef.current,
          });

          const { json: copyJson } = extractCodeFromResponse(copyResponse);

          if (copyJson) {
            const content = parseSectionContent(copyJson);

            if (content) {
              sectionContentsMap[section.id] = content;
              updateSectionContent(section.id, content);
            }
          }
        }

        // Step 4: Generate final code
        updateStep('applying-styles');
        updateProgress({ progress: 70, message: 'Generating code...' });

        const codeResponse = await streamFromAPI('code', {
          pageStructure: parsedStructure,
          sectionContents: sectionContentsMap,
          context: contextRef.current,
        });

        const { tsx } = extractCodeFromResponse(codeResponse);

        if (tsx) {
          setGeneratedCode(tsx);
          options.onCodeGenerated?.(tsx);
        }

        // Complete
        updateStep('complete');
        completeSession();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [messages, streamFromAPI, options],
  );

  /**
   * Apply a refinement command
   */
  const applyRefinement = useCallback(
    async (command: RefinementCommand, targetSection?: string): Promise<void> => {
      if (!code) {
        return;
      }

      try {
        updateProgress({ progress: 0, message: `Applying: ${command}...` });

        const response = await streamFromAPI('refine', {
          currentCode: code,
          refinementCommand: command,
          targetSection,
          context: contextRef.current,
        });

        const { tsx } = extractCodeFromResponse(response);

        if (tsx) {
          setGeneratedCode(tsx);
          options.onCodeGenerated?.(tsx);
        }

        updateProgress({ progress: 100, message: 'Refinement complete!' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [code, streamFromAPI, options],
  );

  /**
   * Regenerate the page
   */
  const regenerate = useCallback(async (): Promise<void> => {
    if (!structure) {
      return;
    }

    try {
      updateStep('generating-copy');
      updateProgress({ progress: 20, message: 'Regenerating...' });

      // Regenerate code with existing structure
      const codeResponse = await streamFromAPI('code', {
        pageStructure: structure,
        sectionContents: contents,
        context: contextRef.current,
      });

      const { tsx } = extractCodeFromResponse(codeResponse);

      if (tsx) {
        setGeneratedCode(tsx);
        options.onCodeGenerated?.(tsx);
      }

      updateStep('complete');
      completeSession();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(errorMessage);
    }
  }, [structure, contents, streamFromAPI, options]);

  /**
   * Set context for the agent
   */
  const setContext = useCallback((context: Record<string, string>): void => {
    contextRef.current = { ...contextRef.current, ...context };
  }, []);

  /**
   * Stop current generation
   */
  const stop = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setStreaming(false);
  }, []);

  return {
    // State
    messages,
    step,
    status,
    modelTier,
    structure,
    contents,
    code,
    streaming,
    streamContent,
    isPanelVisible,

    // Actions
    sendMessage,
    generateFullPage,
    applyRefinement,
    regenerate,
    setContext,
    setModelTier,
    stop,
    startSession,
    resetAgent,
    toggleAgentPanel,
  };
}
