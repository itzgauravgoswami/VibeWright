import React from 'react';

export default function Badge({ type = 'neutral', children }) {
  const badgeClasses = {
    success: 'vw-badge vw-badge-success',
    warning: 'vw-badge vw-badge-warning',
    danger: 'vw-badge vw-badge-danger',
    info: 'vw-badge vw-badge-info',
    purple: 'vw-badge vw-badge-purple',
    neutral: 'vw-badge vw-badge-neutral'
  };

  return (
    <span className={badgeClasses[type] || badgeClasses.neutral}>
      {children}
    </span>
  );
}
