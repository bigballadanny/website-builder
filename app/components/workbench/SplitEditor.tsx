import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { toast } from 'react-toastify';
import * as Tabs from '@radix-ui/react-tabs';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { IconButton } from '~/components/ui/IconButton';
import { AutosaveIndicator } from '~/components/ui/AutoSaveIndicator';
import type { FileMap } from '~/lib/stores/files';
import type { FileHistory } from '~/types/actions';
import { themeStore } from '~/lib/stores/theme';
import { WORK_DIR } from '~/utils/constants';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';
import { classNames } from '~/utils/classNames';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import { ComponentPalette } from './ComponentPalette';
import { StylePanel } from './StylePanel';
import { Preview } from './Preview';
import { workbenchStore } from '~/lib/stores/workbench';
import { canUndo, canRedo, undo, redo, pushHistoryState } from '~/lib/stores/history';
import { markUnsaved, markSaved } from '~/lib/stores/autosave';
import type { ElementInfo } from './Inspector';

interface SplitEditorProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  fileHistory?: Record<string, FileHistory>;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
  setSelectedElement?: (element: ElementInfo | null) => void;
}

const editorSettings: EditorSettings = { tabSize: 2 };

type SidebarTab = 'files' | 'components' | 'styles';
type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const SplitEditor = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    fileHistory,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
    setSelectedElement,
  }: SplitEditorProps) => {
    renderLogger.trace('SplitEditor');

    const theme = useStore(themeStore);
    const undoAvailable = useStore(canUndo);
    const redoAvailable = useStore(canRedo);

    const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');
    const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
    const [showPreview, setShowPreview] = useState(true);
    const [selectedElementPath, setSelectedElementPath] = useState<string | undefined>();

    // Active file tracking
    const activeFileSegments = editorDocument?.filePath.split('/');
    const activeFileUnsaved =
      editorDocument && unsavedFiles instanceof Set && unsavedFiles.has(editorDocument.filePath);

    // Handle keyboard shortcuts for undo/redo
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Undo: Ctrl+Z (or Cmd+Z on Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        }

        // Redo: Ctrl+Shift+Z (or Cmd+Shift+Z on Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
          e.preventDefault();
          handleRedo();
        }

        // Alternative Redo: Ctrl+Y
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undoAvailable, redoAvailable]);

    const handleUndo = useCallback(() => {
      if (!undoAvailable) {
        return;
      }

      const state = undo();

      if (state) {
        // Apply the restored state
        toast.info('Undo', { autoClose: 1000 });
      }
    }, [undoAvailable]);

    const handleRedo = useCallback(() => {
      if (!redoAvailable) {
        return;
      }

      const state = redo();

      if (state) {
        toast.info('Redo', { autoClose: 1000 });
      }
    }, [redoAvailable]);

    // Wrap the editor change to track history
    const handleEditorChange = useCallback<OnEditorChange>(
      (update) => {
        markUnsaved();
        onEditorChange?.(update);

        // Push state to history (debounced internally)
        if (files) {
          pushHistoryState(files, 'Edit');
        }
      },
      [onEditorChange, files],
    );

    // Handle file save with autosave status
    const handleFileSave = useCallback(() => {
      onFileSave?.();
      markSaved();
    }, [onFileSave]);

    // Insert component HTML - copies to clipboard for easy pasting
    const handleInsertComponent = useCallback((html: string, componentName: string) => {
      // Copy HTML to clipboard for user to paste where they want
      navigator.clipboard
        .writeText(html)
        .then(() => {
          toast.success(`📋 ${componentName} copied! Paste where you want it.`, {
            autoClose: 3000,
          });
        })
        .catch(() => {
          toast.error('Failed to copy component');
        });
    }, []);

    // Handle style changes
    const handleStyleChange = useCallback((css: string) => {
      navigator.clipboard.writeText(css).then(() => {
        toast.success('Styles copied to clipboard!', { autoClose: 2000 });
      });
    }, []);

    // Preview size based on mode
    const getPreviewWidth = () => {
      switch (previewMode) {
        case 'mobile':
          return '375px';
        case 'tablet':
          return '768px';
        case 'desktop':
        default:
          return '100%';
      }
    };

    return (
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar */}
        <Panel
          defaultSize={18}
          minSize={12}
          maxSize={30}
          collapsible
          className="border-r border-bolt-elements-borderColor"
        >
          <div className="h-full flex flex-col">
            <Tabs.Root
              value={sidebarTab}
              onValueChange={(v) => setSidebarTab(v as SidebarTab)}
              className="flex flex-col h-full"
            >
              <PanelHeader className="w-full text-sm font-medium text-bolt-elements-textSecondary px-1">
                <Tabs.List className="h-full flex-shrink-0 flex items-center">
                  <Tabs.Trigger
                    value="files"
                    className={classNames(
                      'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-xs font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                    )}
                  >
                    <span className="i-ph:folder-open mr-1" />
                    Files
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="components"
                    className={classNames(
                      'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-xs font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                    )}
                  >
                    <span className="i-ph:squares-four mr-1" />
                    Blocks
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="styles"
                    className={classNames(
                      'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-xs font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                    )}
                  >
                    <span className="i-ph:paint-brush mr-1" />
                    Styles
                  </Tabs.Trigger>
                </Tabs.List>
              </PanelHeader>

              <Tabs.Content value="files" className="flex-grow overflow-auto focus-visible:outline-none">
                <FileTree
                  className="h-full"
                  files={files}
                  hideRoot
                  unsavedFiles={unsavedFiles}
                  fileHistory={fileHistory}
                  rootFolder={WORK_DIR}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                />
              </Tabs.Content>

              <Tabs.Content value="components" className="flex-grow overflow-hidden focus-visible:outline-none">
                <ComponentPalette onInsert={handleInsertComponent} />
              </Tabs.Content>

              <Tabs.Content value="styles" className="flex-grow overflow-hidden focus-visible:outline-none">
                <StylePanel onStyleChange={handleStyleChange} selectedElement={selectedElementPath} />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-bolt-elements-borderColor hover:bg-accent-500 transition-colors" />

        {/* Editor Panel */}
        <Panel defaultSize={showPreview ? 40 : 82} minSize={25}>
          <div className="h-full flex flex-col">
            <PanelHeader className="overflow-x-auto gap-2">
              {/* Undo/Redo buttons */}
              <div className="flex items-center gap-1 mr-2">
                <IconButton
                  icon="i-ph:arrow-counter-clockwise"
                  onClick={handleUndo}
                  disabled={!undoAvailable}
                  title="Undo (Ctrl+Z)"
                  className={classNames(!undoAvailable && 'opacity-40')}
                />
                <IconButton
                  icon="i-ph:arrow-clockwise"
                  onClick={handleRedo}
                  disabled={!redoAvailable}
                  title="Redo (Ctrl+Shift+Z)"
                  className={classNames(!redoAvailable && 'opacity-40')}
                />
              </div>

              {/* Breadcrumb */}
              {activeFileSegments?.length && (
                <div className="flex items-center flex-1 text-sm">
                  <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                  {activeFileUnsaved && (
                    <div className="flex gap-1 ml-auto -mr-1.5">
                      <PanelHeaderButton onClick={handleFileSave}>
                        <div className="i-ph:floppy-disk-duotone" />
                        Save
                      </PanelHeaderButton>
                      <PanelHeaderButton onClick={onFileReset}>
                        <div className="i-ph:clock-counter-clockwise-duotone" />
                        Reset
                      </PanelHeaderButton>
                    </div>
                  )}
                </div>
              )}

              {/* Autosave indicator */}
              <AutosaveIndicator />

              {/* Preview toggle */}
              <IconButton
                icon={showPreview ? 'i-ph:eye' : 'i-ph:eye-slash'}
                onClick={() => setShowPreview(!showPreview)}
                title={showPreview ? 'Hide Preview' : 'Show Preview'}
              />
            </PanelHeader>

            <div className="h-full flex-1 overflow-hidden">
              <CodeMirrorEditor
                theme={theme}
                editable={!isStreaming && editorDocument !== undefined}
                settings={editorSettings}
                doc={editorDocument}
                autoFocusOnDocumentChange={!isMobile()}
                onScroll={onEditorScroll}
                onChange={handleEditorChange}
                onSave={handleFileSave}
              />
            </div>
          </div>
        </Panel>

        {/* Preview Panel */}
        {showPreview && (
          <>
            <PanelResizeHandle className="w-1 bg-bolt-elements-borderColor hover:bg-accent-500 transition-colors" />
            <Panel defaultSize={42} minSize={25}>
              <div className="h-full flex flex-col">
                {/* Preview controls */}
                <PanelHeader className="gap-2">
                  <span className="text-xs font-medium text-bolt-elements-textSecondary">Live Preview</span>
                  <div className="flex-1" />

                  {/* Responsive toggles */}
                  <div className="flex items-center gap-1 bg-bolt-elements-background-depth-2 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={classNames(
                        'p-1.5 rounded-md transition-colors',
                        previewMode === 'desktop'
                          ? 'bg-accent-500 text-white'
                          : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
                      )}
                      title="Desktop"
                    >
                      <span className="i-ph:desktop text-sm" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={classNames(
                        'p-1.5 rounded-md transition-colors',
                        previewMode === 'tablet'
                          ? 'bg-accent-500 text-white'
                          : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
                      )}
                      title="Tablet (768px)"
                    >
                      <span className="i-ph:device-tablet text-sm" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={classNames(
                        'p-1.5 rounded-md transition-colors',
                        previewMode === 'mobile'
                          ? 'bg-accent-500 text-white'
                          : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
                      )}
                      title="Mobile (375px)"
                    >
                      <span className="i-ph:device-mobile text-sm" />
                    </button>
                  </div>
                </PanelHeader>

                {/* Preview iframe */}
                <div className="flex-1 overflow-auto bg-bolt-elements-background-depth-1 flex justify-center">
                  <div
                    style={{
                      width: getPreviewWidth(),
                      maxWidth: '100%',
                      transition: 'width 0.3s ease',
                    }}
                    className={classNames(
                      'h-full',
                      previewMode !== 'desktop' && 'border-x border-bolt-elements-borderColor shadow-lg',
                    )}
                  >
                    <Preview setSelectedElement={setSelectedElement} />
                  </div>
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    );
  },
);

SplitEditor.displayName = 'SplitEditor';
