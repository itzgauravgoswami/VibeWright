import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  CalendarDays,
  BarChart3,
  Database,
  Activity,
  Settings,
  Bot,
  Zap,
  X
} from 'lucide-react';

export default function Sidebar({ automationStatus, isOpen, onClose }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trends', label: 'Trends Intelligence', icon: TrendingUp },
    { to: '/content', label: 'Content Studio', icon: FileText },
    { to: '/calendar', label: 'Publishing Calendar', icon: CalendarDays },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/sources', label: 'Source Knowledge', icon: Database },
    { to: '/activity', label: 'Activity Logs', icon: Activity },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`vw-sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          <div className="vw-brand">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-white">
              <img src="/logo.png" alt="TrendForge Logo" className="w-full h-full object-cover" />
            </div>
            <div className="vw-brand-text">
              <span className="vw-brand-title">TrendForge</span>
              <span className="vw-brand-subtitle">AUTONOMOUS PLATFORM</span>
            </div>

            {/* Close button for mobile drawer */}
            <button
              className="lg:hidden ml-auto p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="vw-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `vw-nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="vw-sidebar-footer">
          <div className="vw-agent-widget">
            <div className="vw-agent-header">
              <span className="vw-agent-title">
                <Bot size={14} className="text-blue-600" />
                Agent Status
              </span>
              <span className="vw-badge vw-badge-success">ACTIVE</span>
            </div>
            <p className="vw-agent-sub">
              Monitoring trends • Next scan {automationStatus?.publishTime || '18:00'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
