/**
 * Agent Panel Component
 *
 * Chat-like interface for AI-powered page building.
 * Shows conversation, progress, and refinement options.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, Wand2, RefreshCw, Check, Zap, Crown, DollarSign } from 'lucide-react';
import {
  agentMessages,
  agentStep,
  agentStatus,
  agentModelTier,
  generationProgress,
  isStreaming,
  streamingContent,
  showAgentPanel,
  costDisplay,
  tokensDisplay,
  stepDisplayName,
  progressPercent,
  toggleAgentPanel,
  startSession,
  setModelTier,
  resetAgent,
} from '~/lib/stores/agent';
import { AgentMessageBubble } from './AgentMessageBubble';
import { AgentProgressBar } from './AgentProgressBar';
import { RefinementCommands } from './RefinementCommands';
import type { AgentMessage, RefinementCommand } from '~/lib/agent/types';

interface AgentPanelProps {
  onSendMessage: (message: string) => Promise<void>;
  onRefinement: (command: RefinementCommand) => Promise<void>;
  onAcceptCode: (code: string) => void;
  onRegenerate: () => void;
  generatedCode?: string | null;
  brandDetails?: {
    businessName: string;
    mainGoal: string;
  };
}

export function AgentPanel({
  onSendMessage,
  onRefinement,
  onAcceptCode,
  onRegenerate,
  generatedCode,
  brandDetails,
}: AgentPanelProps) {
  const messages = useStore(agentMessages);
  const step = useStore(agentStep);
  const status = useStore(agentStatus);
  const modelTier = useStore(agentModelTier);
  const progress = useStore(generationProgress);
  const streaming = useStore(isStreaming);
  const streamContent = useStore(streamingContent);
  const isVisible = useStore(showAgentPanel);
  const cost = useStore(costDisplay);
  const tokens = useStore(tokensDisplay);
  const currentStep = useStore(stepDisplayName);
  const progressPct = useStore(progressPercent);

  const [inputValue, setInputValue] = useState('');
  const [showRefinements, setShowRefinements] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamContent]);

  // Focus input on mount
  useEffect(() => {
    if (isVisible && status === 'active') {
      inputRef.current?.focus();
    }
  }, [isVisible, status]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!inputValue.trim() || streaming) {
        return;
      }

      const message = inputValue.trim();
      setInputValue('');
      await onSendMessage(message);
    },
    [inputValue, streaming, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleAccept = useCallback(() => {
    if (generatedCode) {
      onAcceptCode(generatedCode);
    }
  }, [generatedCode, onAcceptCode]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-[400px] bg-bolt-elements-background-depth-2 border-l border-bolt-elements-borderColor shadow-2xl flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold text-bolt-elements-textPrimary">AI Build Mode</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Model tier toggle */}
          <button
            onClick={() => setModelTier(modelTier === 'standard' ? 'premium' : 'standard')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${modelTier === 'premium'
              ? 'bg-amber-500/20 text-amber-500'
              : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
              }`}
            title={modelTier === 'premium' ? 'Using Opus 4 (Premium)' : 'Using Sonnet 4 (Standard)'}
          >
            {modelTier === 'premium' ? (
              <>
                <Crown className="w-3 h-3" />
                Opus
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                Sonnet
              </>
            )}
          </button>
          <button
            onClick={toggleAgentPanel}
            className="p-1.5 rounded-md hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {status === 'active' && step !== 'idle' && step !== 'complete' && (
          <AgentProgressBar progress={progressPct} step={currentStep} message={progress.message} />
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && status === 'active' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-2">Marketing AI Mode</h3>
            <p className="text-sm text-bolt-elements-textSecondary max-w-xs mx-auto">
              I'm the Pocket Marketer AI, powered by the Bolt engine. I've already indexed your BrandDNA and business goals.
              <br /><br />
              Tell me how you'd like to refine your site, or use the suggestions below!
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {(brandDetails?.businessName
                ? [
                  `Build a ${brandDetails.mainGoal || 'landing'} page for ${brandDetails.businessName}`,
                  `Create a high-converting ${brandDetails.mainGoal || 'lead'} magnet`,
                  'Make the design more premium',
                ]
                : [
                  'Landing page for my coaching business',
                  'Sales page for an online course',
                  'Coming soon page for a new product',
                ]
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs rounded-full bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-4 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <AgentMessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming content */}
        {streaming && streamContent && (
          <AgentMessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamContent,
              timestamp: new Date(),
            }}
            isStreaming
          />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Refinement commands (shown when code is generated) */}
      <AnimatePresence>
        {generatedCode && step === 'complete' && (
          <RefinementCommands
            isOpen={showRefinements}
            onToggle={() => setShowRefinements(!showRefinements)}
            onCommand={onRefinement}
          />
        )}
      </AnimatePresence>

      {/* Action buttons (shown when generation is complete) */}
      {step === 'complete' && generatedCode && (
        <div className="px-4 py-3 border-t border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Accept & Use
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bolt-elements-background-depth-3 hover:bg-bolt-elements-background-depth-4 text-bolt-elements-textPrimary transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              status === 'idle'
                ? 'Start a new session...'
                : step === 'complete'
                  ? 'Ask for changes...'
                  : 'Type your response...'
            }
            disabled={streaming || status === 'idle'}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || streaming || status === 'idle'}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Cost indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-bolt-elements-textTertiary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {cost}
            </span>
            <span>{tokens}</span>
          </div>
          {status === 'idle' ? (
            <button onClick={startSession} className="text-purple-500 hover:text-purple-400 font-medium">
              Start Session
            </button>
          ) : (
            <button
              onClick={resetAgent}
              className="text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
