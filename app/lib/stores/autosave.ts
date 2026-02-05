import { atom, computed } from 'nanostores';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export const saveStatus = atom<SaveStatus>('saved');
export const lastSaved = atom<Date | null>(null);
export const saveError = atom<string | null>(null);

// Computed: Human-readable time since last save
export const lastSavedText = computed(lastSaved, (date) => {
  if (!date) {
    return 'Never saved';
  }

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 10) {
    return 'Just now';
  }

  if (diff < 60) {
    return `${diff}s ago`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  return date.toLocaleDateString();
});

// Track debounce timer
let saveTimer: NodeJS.Timeout | null = null;
const AUTOSAVE_DELAY = 5000; // 5 seconds

// Mark content as unsaved
export function markUnsaved(): void {
  saveStatus.set('unsaved');

  // Clear existing timer
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  // Schedule autosave
  saveTimer = setTimeout(() => {
    triggerAutosave();
  }, AUTOSAVE_DELAY);
}

// Trigger the autosave
async function triggerAutosave(): Promise<void> {
  /*
   * This will be called by the workbench when content changes
   * The actual save is handled by workbench.saveCurrentDocument()
   * We just set the status here
   */
  saveStatus.set('saving');
}

// Called when save completes
export function markSaved(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  saveStatus.set('saved');
  lastSaved.set(new Date());
  saveError.set(null);
}

// Called when save fails
export function markError(error?: string): void {
  saveStatus.set('error');
  saveError.set(error || 'Save failed');
}

// Cancel pending autosave
export function cancelAutosave(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}
