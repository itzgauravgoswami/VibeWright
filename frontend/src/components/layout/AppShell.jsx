import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppShell({ backendStatus, automationStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="vw-app-shell">
      <Sidebar
        automationStatus={automationStatus}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="vw-main-wrapper">
        <TopNavbar
          backendStatus={backendStatus}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="vw-page-content">
          <Outlet />
        </main>
        <footer className="vw-footer">
          TrendForge Autonomous Trend Intelligence & Publishing Platform • Swytchcode & Weaviate RAG Powered
        </footer>
      </div>
    </div>
  );
}
