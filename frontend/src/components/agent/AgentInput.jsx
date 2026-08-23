import React, { useState } from 'react';

const PRESET_TEMPLATES = [
  {
    label: '🔍 Pattern 1: Web Research & RAG',
    prompt: 'Research the latest developments in AI healthcare and synthesize an evidence-grounded summary.'
  },
  {
    label: '⚡ Pattern 2: Discover & Decide',
    prompt: 'Discover top news regarding Quantum Computing breakthroughs and decide key summary points.'
  },
  {
    label: '🎯 Pattern 3: One Idea Multi-Output',
    prompt: 'Generate an executive announcement for our product update and draft a notification payload.'
  },
  {
    label: '🛡️ Pattern 4: AI Human Approval',
    prompt: 'Draft an email report for weekly metrics and request human approval before sending to Slack.'
  },
  {
    label: '📅 Pattern 5: Scheduled Automation',
    prompt: 'Schedule a research task to query news every morning and alert the team calendar.'
  },
  {
    label: '📚 Pattern 6: GitHub + Drive + Notion RAG',
    prompt: 'Query our GitHub codebase, Notion specs, and Drive docs to retrieve vector memory from Weaviate.'
  }
];

export default function AgentInput({ onSubmit, isLoading }) {
  const [inputPrompt, setInputPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSubmit(inputPrompt.trim());
  };

  return (
    <div className="vw-agent-input-container">
      <form onSubmit={handleSubmit} className="vw-agent-form">
        <div className="vw-input-wrapper">
          <textarea
            className="vw-agent-textarea"
            rows="3"
            placeholder="What would you like TrendForge to orchestrate? (e.g. Research AI healthcare and send summary)"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="vw-btn-primary vw-run-btn"
          >
            {isLoading ? (
              <>
                <span className="vw-spinner" /> Planning & Executing...
              </>
            ) : (
              <>🚀 Execute Agent Workflow</>
            )}
          </button>
        </div>
      </form>

      <div className="vw-preset-templates">
        <span className="vw-preset-label">Quick Patterns:</span>
        <div className="vw-template-pills">
          {PRESET_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              className="vw-template-pill"
              onClick={() => setInputPrompt(tmpl.prompt)}
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
