import { atom } from 'nanostores';

export type PreviewStage = 'idle' | 'installing' | 'starting' | 'waiting-for-port' | 'ready' | 'error';

export interface PreviewStatus {
  stage: PreviewStage;
  message: string;
  progress: number; // 0-100
  error?: string;
  startTime?: number;
  retryCount?: number;
}

const DEFAULT_STATUS: PreviewStatus = {
  stage: 'idle',
  message: 'Waiting to start...',
  progress: 0,
};

export const previewStatus = atom<PreviewStatus>(DEFAULT_STATUS);

export function setPreviewStage(stage: PreviewStage, message?: string, error?: string) {
  const progressMap: Record<PreviewStage, number> = {
    idle: 0,
    installing: 25,
    starting: 50,
    'waiting-for-port': 75,
    ready: 100,
    error: 0,
  };

  const messageMap: Record<PreviewStage, string> = {
    idle: 'Waiting to start...',
    installing: 'Installing dependencies...',
    starting: 'Starting development server...',
    'waiting-for-port': 'Waiting for server to be ready...',
    ready: 'Preview ready!',
    error: 'An error occurred',
  };

  const current = previewStatus.get();

  previewStatus.set({
    ...current,
    stage,
    message: message || messageMap[stage],
    progress: progressMap[stage],
    error: error || undefined,
    startTime: stage === 'installing' ? Date.now() : current.startTime,
  });

  console.log('[PreviewStatus] Stage changed:', stage, message || messageMap[stage]);
}

export function incrementRetryCount() {
  const current = previewStatus.get();
  previewStatus.set({
    ...current,
    retryCount: (current.retryCount || 0) + 1,
  });
}

export function resetPreviewStatus() {
  previewStatus.set(DEFAULT_STATUS);
}

// Helper to check if we've been in a stage too long
export function getStageElapsedTime(): number {
  const current = previewStatus.get();

  if (!current.startTime) {
    return 0;
  }

  return Date.now() - current.startTime;
}
