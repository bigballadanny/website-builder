/**
 * Agent Message Bubble Component
 *
 * Renders individual messages in the agent conversation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { AgentMessage } from '~/lib/agent/types';

interface AgentMessageBubbleProps {
  message: AgentMessage;
  isStreaming?: boolean;
}

export function AgentMessageBubble({ message, isStreaming }: AgentMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-500'
            : isSystem
            ? 'bg-amber-500'
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isSystem ? (
          <Sparkles className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex-1 max-w-[85%] ${
          isUser ? 'text-right' : 'text-left'
        }`}
      >
        <div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-sm'
              : isSystem
              ? 'bg-amber-500/10 border border-amber-500/30 text-bolt-elements-textPrimary rounded-bl-sm'
              : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary rounded-bl-sm'
          }`}
        >
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Custom code block rendering
                code({ className, children, ...props }) {
                  // Check if it's inline by looking at the parent
                  const isInline = !className?.includes('language-');
                  if (isInline) {
                    return (
                      <code
                        className="px-1 py-0.5 rounded bg-bolt-elements-background-depth-4 text-purple-400 text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="mt-2 p-3 rounded-lg bg-bolt-elements-background-depth-4 overflow-x-auto">
                      <code className={`text-xs ${className || ''}`} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // Custom paragraph to avoid extra margins
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                // Custom list styling
                ul({ children }) {
                  return <ul className="mb-2 pl-4 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="mb-2 pl-4 space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-sm">{children}</li>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Streaming indicator */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse rounded-sm" />
          )}
        </div>

        {/* Metadata */}
        {message.metadata && !isStreaming && (
          <div className="mt-1 text-xs text-bolt-elements-textTertiary">
            {message.metadata.tokensUsed && (
              <span>{message.metadata.tokensUsed.toLocaleString()} tokens</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
