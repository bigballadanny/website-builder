/**
 * Agent Container Component
 *
 * Integrates the agent panel with the workbench.
 */

import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { toast } from 'react-toastify';
import { AgentPanel } from './AgentPanel';
import { AIBuildButton } from './AIBuildButton';
import { useAgent } from '~/lib/hooks/useAgent';
import { showAgentPanel, generatedCode as generatedCodeStore } from '~/lib/stores/agent';
import type { RefinementCommand } from '~/lib/agent/types';

interface AgentContainerProps {
  onCodeGenerated?: (code: string) => void;
  brandDNA?: any;
  styling?: any;
}

export function AgentContainer({ onCodeGenerated, brandDNA, styling }: AgentContainerProps) {
  const isVisible = useStore(showAgentPanel);
  const code = useStore(generatedCodeStore);

  const { sendMessage, applyRefinement, regenerate, setContext } = useAgent({
    onCodeGenerated: (generatedCode) => {
      onCodeGenerated?.(generatedCode);
      toast.success('🎉 Page generated! Review it in the preview.');
    },
    onError: (error) => {
      toast.error(`AI Error: ${error}`);
    },
  });

  // Sync context when brandDNA or styling changes
  React.useEffect(() => {
    if (brandDNA || styling) {
      setContext({
        brandDNA: JSON.stringify(brandDNA),
        styling: JSON.stringify(styling),
        businessDescription: brandDNA?.businessDescription,
        idealCustomer: brandDNA?.idealCustomer,
        companyName: brandDNA?.companyName,
      });
    }
  }, [brandDNA, styling, setContext]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      await sendMessage(message);
    },
    [sendMessage],
  );

  const handleRefinement = useCallback(
    async (command: RefinementCommand) => {
      await applyRefinement(command);
    },
    [applyRefinement],
  );

  const handleAcceptCode = useCallback(
    (acceptedCode: string) => {
      onCodeGenerated?.(acceptedCode);
      toast.success('Code accepted! Applied to your page.');
    },
    [onCodeGenerated],
  );

  const handleRegenerate = useCallback(async () => {
    await regenerate();
  }, [regenerate]);

  return (
    <>
      {/* Floating AI Build button */}
      <AIBuildButton />

      {/* Agent panel */}
      <AnimatePresence>
        {isVisible && (
          <AgentPanel
            onSendMessage={handleSendMessage}
            onRefinement={handleRefinement}
            onAcceptCode={handleAcceptCode}
            onRegenerate={handleRegenerate}
            generatedCode={code}
            brandDetails={
              brandDNA
                ? {
                  businessName: brandDNA.companyName,
                  mainGoal: brandDNA.mainGoal,
                }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
