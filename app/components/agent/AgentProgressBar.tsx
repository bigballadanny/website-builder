/**
 * Agent Progress Bar Component
 *
 * Shows generation progress with step indicator.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AgentProgressBarProps {
  progress: number;
  step: string;
  message?: string;
}

export function AgentProgressBar({ progress, step, message }: AgentProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-bolt-elements-borderColor"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">{step}</span>
        </div>
        <span className="text-xs text-bolt-elements-textSecondary">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-bolt-elements-background-depth-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Status message */}
      {message && <p className="mt-2 text-xs text-bolt-elements-textSecondary">{message}</p>}
    </motion.div>
  );
}
