import { memo } from 'react';
import { useStore } from '@nanostores/react';
import { saveStatus, lastSavedText, markSaved, saveError, markError, markUnsaved } from '~/lib/stores/autosave';
import { classNames } from '~/utils/classNames';

// Export functions for external control
export const setSaving = () => markUnsaved();
export const setSaved = () => markSaved();
export const setSaveError = (error?: string) => markError(error);

export const AutosaveIndicator = memo(() => {
  const status = useStore(saveStatus);
  const timeText = useStore(lastSavedText);
  const errorMsg = useStore(saveError);

  const statusConfig = {
    saved: {
      icon: 'i-ph:cloud-check',
      text: 'Saved',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    saving: {
      icon: 'i-svg-spinners:90-ring-with-bg',
      text: 'Saving...',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    unsaved: {
      icon: 'i-ph:cloud-arrow-up',
      text: 'Unsaved',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    error: {
      icon: 'i-ph:cloud-x',
      text: 'Save failed',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  };

  const config = statusConfig[status];
  const tooltipText = status === 'error' && errorMsg 
    ? `${config.text}: ${errorMsg}` 
    : `${config.text} • ${timeText}`;

  return (
    <div
      className={classNames(
        'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
        config.bgColor,
        config.color
      )}
      title={tooltipText}
    >
      <div className={classNames(config.icon, 'w-3.5 h-3.5')} />
      <span className="hidden sm:inline">{config.text}</span>
      {status === 'saved' && (
        <span className="hidden md:inline text-bolt-elements-textTertiary">
          • {timeText}
        </span>
      )}
    </div>
  );
});

AutosaveIndicator.displayName = 'AutosaveIndicator';
