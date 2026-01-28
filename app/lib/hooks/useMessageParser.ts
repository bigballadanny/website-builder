import type { Message } from 'ai';
import { useCallback, useState } from 'react';
import { EnhancedStreamingMessageParser } from '~/lib/runtime/enhanced-message-parser';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('useMessageParser');

const messageParser = new EnhancedStreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      console.log('[ARTIFACT-FLOW] 🎨 onArtifactOpen:', { id: data.id, title: data.title, messageId: data.messageId });
      logger.trace('onArtifactOpen', data);

      workbenchStore.showWorkbench.set(true);
      workbenchStore.addArtifact(data);
    },
    onArtifactClose: (data) => {
      console.log('[ARTIFACT-FLOW] 🎨 onArtifactClose:', { id: data.id, artifactId: data.artifactId });
      logger.trace('onArtifactClose');

      workbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      console.log('[ARTIFACT-FLOW] ⚡ onActionOpen:', {
        type: data.action.type,
        actionId: data.actionId,
        artifactId: data.artifactId,
        filePath: 'filePath' in data.action ? data.action.filePath : undefined,
      });
      logger.trace('onActionOpen', data.action);

      /*
       * File actions are streamed, so we add them immediately to show progress
       * Shell actions are complete when created by enhanced parser, so we wait for close
       */
      if (data.action.type === 'file') {
        workbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      console.log('[ARTIFACT-FLOW] ✅ onActionClose:', {
        type: data.action.type,
        actionId: data.actionId,
        artifactId: data.artifactId,
        filePath: 'filePath' in data.action ? data.action.filePath : undefined,
        contentLength: data.action.content?.length || 0,
      });
      logger.trace('onActionClose', data.action);

      /*
       * Add non-file actions (shell, build, start, etc.) when they close
       * Enhanced parser creates complete shell actions, so they're ready to execute
       */
      if (data.action.type !== 'file') {
        workbenchStore.addAction(data);
      }

      workbenchStore.runAction(data);
    },
    onActionStream: (data) => {
      console.log('[ARTIFACT-FLOW] 📡 onActionStream:', {
        type: data.action.type,
        actionId: data.actionId,
        contentLength: data.action.content?.length || 0,
      });
      logger.trace('onActionStream', data.action);
      workbenchStore.runAction(data, true);
    },
  },
});
const extractTextContent = (message: Message) =>
  Array.isArray(message.content)
    ? (message.content.find((item) => item.type === 'text')?.text as string) || ''
    : message.content;

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({});

  const parseMessages = useCallback((messages: Message[], isLoading: boolean) => {
    console.log('[PARSE-MESSAGES] 📨 parseMessages called:', {
      messageCount: messages.length,
      isLoading,
      roles: messages.map(m => m.role),
    });
    
    let reset = false;

    if (import.meta.env.DEV && !isLoading) {
      console.log('[PARSE-MESSAGES] 🔄 DEV mode & not loading - resetting parser');
      reset = true;
      messageParser.reset();
    }

    for (const [index, message] of messages.entries()) {
      if (message.role === 'assistant' || message.role === 'user') {
        const content = extractTextContent(message);
        console.log('[PARSE-MESSAGES] 📄 Parsing message:', {
          index,
          role: message.role,
          messageId: message.id,
          contentLength: content?.length || 0,
          contentPreview: content?.slice(0, 100),
        });
        const newParsedContent = messageParser.parse(message.id, content);
        setParsedMessages((prevParsed) => ({
          ...prevParsed,
          [index]: !reset ? (prevParsed[index] || '') + newParsedContent : newParsedContent,
        }));
      }
    }
  }, []);

  return { parsedMessages, parseMessages };
}
