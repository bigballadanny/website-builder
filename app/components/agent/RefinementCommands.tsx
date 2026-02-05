/**
 * Refinement Commands Component
 *
 * Quick refinement buttons for iterating on generated content.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  Minimize2,
  Maximize2,
  Briefcase,
  Coffee,
  Zap,
  Heart,
  Smile,
  FileText,
  TrendingUp,
  Award,
} from 'lucide-react';
import type { RefinementCommand } from '~/lib/agent/types';

interface RefinementCommandsProps {
  isOpen: boolean;
  onToggle: () => void;
  onCommand: (command: RefinementCommand) => void;
}

const REFINEMENT_OPTIONS: Array<{
  command: RefinementCommand;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    command: 'make_shorter',
    label: 'Make shorter',
    icon: Minimize2,
    description: 'Cut the fluff, keep the punch',
  },
  {
    command: 'make_longer',
    label: 'Make longer',
    icon: Maximize2,
    description: 'Add more detail and depth',
  },
  {
    command: 'make_formal',
    label: 'More formal',
    icon: Briefcase,
    description: 'Professional tone',
  },
  {
    command: 'make_casual',
    label: 'More casual',
    icon: Coffee,
    description: 'Conversational tone',
  },
  {
    command: 'make_urgent',
    label: 'Add urgency',
    icon: Zap,
    description: 'Create FOMO',
  },
  {
    command: 'make_friendly',
    label: 'Warmer tone',
    icon: Heart,
    description: 'More approachable',
  },
  {
    command: 'add_humor',
    label: 'Add humor',
    icon: Smile,
    description: 'Lighten it up',
  },
  {
    command: 'simplify',
    label: 'Simplify',
    icon: FileText,
    description: 'Easier to read',
  },
  {
    command: 'emphasize_benefits',
    label: 'More benefits',
    icon: TrendingUp,
    description: 'Focus on value',
  },
  {
    command: 'add_social_proof',
    label: 'Add proof',
    icon: Award,
    description: 'Trust signals',
  },
];

export function RefinementCommands({ isOpen, onToggle, onCommand }: RefinementCommandsProps) {
  return (
    <div className="border-t border-bolt-elements-borderColor">
      {/* Toggle header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center justify-between text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 transition-colors"
      >
        <span className="font-medium">Refinements</span>
        <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {/* Commands grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 grid grid-cols-2 gap-2">
              {REFINEMENT_OPTIONS.map(({ command, label, icon: Icon, description }) => (
                <button
                  key={command}
                  onClick={() => onCommand(command)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bolt-elements-background-depth-3 hover:bg-bolt-elements-background-depth-4 text-left transition-colors group"
                >
                  <Icon className="w-4 h-4 text-bolt-elements-textTertiary group-hover:text-purple-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-bolt-elements-textPrimary truncate">{label}</div>
                    <div className="text-[10px] text-bolt-elements-textTertiary truncate">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
