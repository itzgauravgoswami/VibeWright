import React from 'react';
import IntegrationGrid from '../components/integrations/IntegrationGrid';

export default function IntegrationsPage({ capabilities }) {
  return (
    <div className="vw-page-container">
      <div className="vw-page-header">
        <h2>Capabilities & Integrations Matrix</h2>
        <p>Verified status of active integrations across LLM reasoning, Swytchcode execution, Web Discovery, RAG, and Communication.</p>
      </div>

      <IntegrationGrid capabilities={capabilities} />
    </div>
  );
}
