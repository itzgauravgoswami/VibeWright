import React from 'react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header className="vw-navbar">
      <div className="vw-navbar-brand" onClick={() => setActiveTab('dashboard')}>
        <div className="vw-logo-icon">⚡</div>
        <div className="vw-brand-title">
          <span className="vw-title-main">TrendForge</span>
          <span className="vw-title-tag">AGENT PLATFORM</span>
        </div>
      </div>

      <nav className="vw-nav-links">
        <button
          className={`vw-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`vw-nav-item ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          🧠 AI Command Center
        </button>
        <button
          className={`vw-nav-item ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          🔌 Capabilities Matrix
        </button>
        <button
          className={`vw-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📜 Execution History
        </button>
      </nav>

      <div className="vw-navbar-status">
        <div className={`vw-status-dot ${backendStatus ? 'online' : 'offline'}`} />
        <span className="vw-status-text">
          {backendStatus ? 'ORCHESTRATOR ONLINE' : 'DISCONNECTED'}
        </span>
      </div>
    </header>
  );
}
