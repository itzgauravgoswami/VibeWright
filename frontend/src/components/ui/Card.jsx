import React from 'react';

export default function Card({ title, badge, action, children, className = '' }) {
  return (
    <div className={`vw-card ${className}`}>
      {(title || badge || action) && (
        <div className="vw-card-header">
          <div className="vw-card-title-group">
            {title && <h3 className="vw-card-title">{title}</h3>}
            {badge && <div className="vw-card-badge-container">{badge}</div>}
          </div>
          {action && <div className="vw-card-action">{action}</div>}
        </div>
      )}
      <div className="vw-card-body">{children}</div>
    </div>
  );
}
