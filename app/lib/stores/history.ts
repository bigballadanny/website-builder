import { atom, computed } from 'nanostores';
import type { FileMap } from './files';

export interface HistoryState {
  files: FileMap;
  timestamp: number;
  description?: string;
}

const MAX_HISTORY_SIZE = 50;

// State stacks
export const historyPast = atom<HistoryState[]>([]);
export const historyFuture = atom<HistoryState[]>([]);
export const historyPresent = atom<HistoryState | null>(null);

// Computed flags
export const canUndo = computed(historyPast, (past) => past.length > 0);
export const canRedo = computed(historyFuture, (future) => future.length > 0);
export const historyLength = computed(historyPast, (past) => past.length);

// Deep clone helper for file state
function cloneFiles(files: FileMap): FileMap {
  const clone: FileMap = {};

  for (const [path, dirent] of Object.entries(files)) {
    if (dirent) {
      clone[path] = { ...dirent };
    }
  }

  return clone;
}

// Push a new state to history
export function pushHistoryState(files: FileMap, description?: string): void {
  const present = historyPresent.get();

  if (present) {
    const past = historyPast.get();

    // Limit history size
    const newPast = past.length >= MAX_HISTORY_SIZE ? [...past.slice(1), present] : [...past, present];
    historyPast.set(newPast);
  }

  historyPresent.set({
    files: cloneFiles(files),
    timestamp: Date.now(),
    description,
  });

  // Clear redo stack on new change
  historyFuture.set([]);
}

// Undo - go back one state
export function undo(): HistoryState | null {
  const past = historyPast.get();
  const present = historyPresent.get();

  if (past.length === 0 || !present) {
    return null;
  }

  const previous = past[past.length - 1];
  const newPast = past.slice(0, -1);

  historyPast.set(newPast);
  historyFuture.set([present, ...historyFuture.get()]);
  historyPresent.set(previous);

  return previous;
}

// Redo - go forward one state
export function redo(): HistoryState | null {
  const future = historyFuture.get();
  const present = historyPresent.get();

  if (future.length === 0) {
    return null;
  }

  const next = future[0];
  const newFuture = future.slice(1);

  if (present) {
    historyPast.set([...historyPast.get(), present]);
  }

  historyFuture.set(newFuture);
  historyPresent.set(next);

  return next;
}

// Clear all history
export function clearHistory(): void {
  historyPast.set([]);
  historyFuture.set([]);
  historyPresent.set(null);
}

// Initialize history with current state
export function initHistory(files: FileMap): void {
  historyPresent.set({
    files: cloneFiles(files),
    timestamp: Date.now(),
    description: 'Initial state',
  });
  historyPast.set([]);
  historyFuture.set([]);
}
