/**
 * AI Build Button Component
 *
 * Floating button to launch AI Build mode.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showAgentPanel, toggleAgentPanel, startSession, agentStatus } from '~/lib/stores/agent';

export function AIBuildButton() {
  const isOpen = useStore(showAgentPanel);
  const status = useStore(agentStatus);

  const handleClick = () => {
    if (!isOpen) {
      if (status === 'idle') {
        startSession();
      }

      toggleAgentPanel();
    } else {
      toggleAgentPanel();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-colors z-40 ${
        isOpen
          ? 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      }`}
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-semibold">{isOpen ? 'Hide AI' : 'AI Build'}</span>
    </motion.button>
  );
}
