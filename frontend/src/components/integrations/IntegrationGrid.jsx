import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function IntegrationGrid({ capabilities }) {
  if (!capabilities || capabilities.length === 0) {
    return <div className="vw-empty-integrations">Loading capabilities matrix...</div>;
  }

  return (
    <div className="vw-integrations-grid">
      {capabilities.map((cap) => (
        <Card
          key={cap.id}
          title={cap.name}
          badge={
            <Badge type={cap.mode === 'REAL' ? 'success' : 'purple'}>
              {cap.mode}
            </Badge>
          }
        >
          <div className="vw-integration-card-content">
            <div className="vw-integration-category">{cap.category}</div>
            <p className="vw-integration-desc">{cap.description}</p>
            <div className="vw-integration-footer">
              <span className={`vw-status-indicator ${cap.configured ? 'configured' : 'unconfigured'}`}>
                {cap.configured ? '● Credential Configured' : '○ Mock Mode Ready'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
