import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '~/utils/classNames';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  className?: string;
  showWhenIdle?: boolean;
}

// Global event emitter for save status
class SaveStatusEmitter {
  private listeners: Set<(status: SaveStatus) => void> = new Set();
  private currentStatus: SaveStatus = 'idle';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  subscribe(listener: (status: SaveStatus) => void) {
    this.listeners.add(listener);

    // Immediately notify of current status
    listener(this.currentStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(status: SaveStatus) {
    this.currentStatus = status;
    this.listeners.forEach((listener) => listener(status));

    // Auto-transition from 'saved' back to 'idle' after 3 seconds
    if (status === 'saved') {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.currentStatus = 'idle';
        this.listeners.forEach((listener) => listener('idle'));
      }, 3000);
    }
  }

  getStatus() {
    return this.currentStatus;
  }
}

export const saveStatusEmitter = new SaveStatusEmitter();

// Helper functions to update save status from anywhere
export const setSaving = () => saveStatusEmitter.emit('saving');
export const setSaved = () => saveStatusEmitter.emit('saved');
export const setSaveError = () => saveStatusEmitter.emit('error');

export function AutoSaveIndicator({ className, showWhenIdle = false }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    return saveStatusEmitter.subscribe(setStatus);
  }, []);

  // Don't render anything if idle and showWhenIdle is false
  if (status === 'idle' && !showWhenIdle) {
    return null;
  }

  const statusConfig = {
    idle: {
      icon: 'i-ph:cloud-check',
      text: 'All changes saved',
      color: 'text-gray-400 dark:text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    saving: {
      icon: 'i-ph:cloud-arrow-up animate-pulse',
      text: 'Saving...',
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    },
    saved: {
      icon: 'i-ph:cloud-check',
      text: 'Saved',
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
    },
    error: {
      icon: 'i-ph:cloud-slash',
      text: 'Save failed',
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
    },
  };

  const config = statusConfig[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={classNames(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
          config.color,
          config.bgColor,
          className,
        )}
      >
        <span className={classNames(config.icon, 'w-3.5 h-3.5')} />
        <span>{config.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// Tooltip version for compact display
export function AutoSaveIndicatorCompact({ className }: { className?: string }) {
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    return saveStatusEmitter.subscribe(setStatus);
  }, []);

  const statusConfig = {
    idle: {
      icon: 'i-ph:cloud-check',
      title: 'All changes saved to browser',
      color: 'text-gray-400 dark:text-gray-500',
    },
    saving: {
      icon: 'i-ph:cloud-arrow-up animate-pulse',
      title: 'Saving...',
      color: 'text-blue-500 dark:text-blue-400',
    },
    saved: {
      icon: 'i-ph:cloud-check',
      title: 'Changes saved',
      color: 'text-green-500 dark:text-green-400',
    },
    error: {
      icon: 'i-ph:cloud-slash',
      title: 'Failed to save - Check browser storage',
      color: 'text-red-500 dark:text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        title={config.title}
        className={classNames('flex items-center cursor-help', config.color, className)}
      >
        <span className={classNames(config.icon, 'w-4 h-4')} />
      </motion.div>
    </AnimatePresence>
  );
}
