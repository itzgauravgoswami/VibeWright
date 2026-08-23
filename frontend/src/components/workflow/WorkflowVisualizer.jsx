import React from 'react';
import Badge from '../ui/Badge';

export default function WorkflowVisualizer({ execution, onApprove, isApproving }) {
  if (!execution) return null;

  const { executionId, status, plan, steps, synthesis, errors } = execution;

  return (
    <div className="vw-workflow-visualizer">
      <div className="vw-visualizer-header">
        <div>
          <div className="vw-execution-id">EXECUTION ID: {executionId}</div>
          {plan && <div className="vw-plan-intent">Intent: {plan.intent}</div>}
        </div>
        <Badge
          type={
            status === 'COMPLETED' ? 'success' :
            status === 'WAITING_FOR_APPROVAL' ? 'warning' :
            status === 'FAILED' ? 'danger' : 'info'
          }
        >
          {status}
        </Badge>
      </div>

      {plan && plan.planSummary && (
        <div className="vw-plan-summary">
          <strong>Plan Summary:</strong> {plan.planSummary}
        </div>
      )}

      {/* Pipeline Steps List */}
      <div className="vw-pipeline-steps">
        <h4 className="vw-section-subtitle">Execution Step Pipeline</h4>
        <div className="vw-steps-flow">
          {steps && steps.length > 0 ? (
            steps.map((step, idx) => (
              <div
                key={idx}
                className={`vw-step-card ${
                  step.status === 'COMPLETED' ? 'completed' :
                  step.status === 'WAITING_APPROVAL' ? 'waiting' :
                  step.status === 'FAILED' ? 'failed' : 'pending'
                }`}
              >
                <div className="vw-step-number">{step.stepIndex || idx + 1}</div>
                <div className="vw-step-info">
                  <div className="vw-step-tool-title">
                    <span className="vw-tool-name">{step.tool}</span>
                    <span className="vw-step-action">{step.action}</span>
                  </div>

                  <div className="vw-step-meta">
                    <span className="vw-step-time">
                      {step.startedAt ? new Date(step.startedAt).toLocaleTimeString() : 'Pending'}
                    </span>
                    {step.data?.badge && (
                      <span className="vw-mock-badge">{step.data.badge}</span>
                    )}
                  </div>

                  {step.resultSummary && (
                    <div className="vw-step-summary">✓ {step.resultSummary}</div>
                  )}

                  {step.status === 'WAITING_APPROVAL' && (
                    <div className="vw-approval-banner">
                      <span>⚠️ Human Approval Required to execute action</span>
                      <button
                        className="vw-btn-approve"
                        onClick={() => onApprove(executionId)}
                        disabled={isApproving}
                      >
                        {isApproving ? 'Approving...' : '✅ Approve & Continue'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="vw-empty-steps">Initializing workflow steps...</div>
          )}
        </div>
      </div>

      {/* Synthesis Summary */}
      {synthesis && (
        <div className="vw-synthesis-box">
          <h4 className="vw-synthesis-title">🧠 Agent Result & Takeaways</h4>
          <p className="vw-synthesis-summary">{synthesis.summary}</p>
          {synthesis.keyTakeaways && (
            <ul className="vw-takeaways-list">
              {synthesis.keyTakeaways.map((takeaway, idx) => (
                <li key={idx}>✓ {takeaway}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {errors && errors.length > 0 && (
        <div className="vw-errors-box">
          <strong>Errors encountered:</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
