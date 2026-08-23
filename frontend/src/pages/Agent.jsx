import React, { useState } from 'react';
import AgentInput from '../components/agent/AgentInput';
import WorkflowVisualizer from '../components/workflow/WorkflowVisualizer';
import Card from '../components/ui/Card';
import { runAgentPrompt, approveExecutionStep } from '../services/api';

export default function AgentPage({ currentExecution, setCurrentExecution, refreshExecutions }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRunAgent = async (prompt) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await runAgentPrompt(prompt);
      setCurrentExecution(result);
      if (refreshExecutions) refreshExecutions();
    } catch (err) {
      setErrorMessage(err.message || 'Execution error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveStep = async (executionId) => {
    setIsApproving(true);
    try {
      const result = await approveExecutionStep(executionId);
      setCurrentExecution(result);
      if (refreshExecutions) refreshExecutions();
    } catch (err) {
      setErrorMessage(err.message || 'Approval error');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="vw-page-container">
      <div className="vw-page-header">
        <h2>AI Agent Command Center</h2>
        <p>Submit natural language instructions to orchestrate Discovery, Vector RAG, LLM reasoning, and Swytchcode execution.</p>
      </div>

      {errorMessage && (
        <div className="vw-alert-error">
          ⚠️ {errorMessage}
        </div>
      )}

      <Card title="Orchestrator Prompt">
        <AgentInput onSubmit={handleRunAgent} isLoading={isLoading} />
      </Card>

      {currentExecution && (
        <Card title="Live Workflow Execution">
          <WorkflowVisualizer
            execution={currentExecution}
            onApprove={handleApproveStep}
            isApproving={isApproving}
          />
        </Card>
      )}
    </div>
  );
}
