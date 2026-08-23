import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sparkles, ShieldCheck, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Executive Dashboard',
  '/dashboard': 'Executive Dashboard',
  '/trends': 'Emerging Trend Intelligence',
  '/content': 'Grounded Content Studio',
  '/calendar': 'Automated Publishing Calendar',
  '/analytics': 'Platform Performance Analytics',
  '/sources': 'Source Knowledge Base & RAG Index',
  '/activity': 'Execution Audit Activity Log',
  '/settings': 'System Settings & Integration Credentials'
};

export default function TopNavbar({ backendStatus, onToggleMobileMenu }) {
  const location = useLocation();
  const currentTitle = PAGE_TITLES[location.pathname] || 'TrendForge Platform';

  return (
    <header className="vw-top-navbar">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          onClick={onToggleMobileMenu}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="vw-page-title-group">
          <h1>{currentTitle}</h1>
        </div>
      </div>

      <div className="vw-navbar-actions">
        <div className="vw-search-box hidden sm:flex">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            className="vw-search-input"
            placeholder="Search trends, sources, claims..."
          />
        </div>

        <span className="vw-demo-badge hidden md:inline-flex">
          <Sparkles size={12} className="inline mr-1" />
          Demo Mode Ready
        </span>

        <button className="vw-btn vw-btn-secondary p-2" title="Notifications">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className={backendStatus ? 'text-emerald-600' : 'text-rose-500'} />
        </div>
      </div>
    </header>
  );
}
