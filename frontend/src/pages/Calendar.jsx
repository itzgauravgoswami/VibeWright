import React, { useState } from 'react';
import { runPublishingCycle } from '../services/api';
import {
  CalendarDays,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function CalendarPage({ contentList = [], automationStatus, refreshData }) {
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState('');

  const handleTestPublish = async () => {
    setIsRunning(true);
    setNotification('');
    try {
      const res = await runPublishingCycle();
      setNotification(`✅ ${res.message || 'Publishing cycle executed successfully via Swytchcode!'}`);
      if (refreshData) refreshData();
    } catch (err) {
      setNotification('Automation Error: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const scheduledPosts = contentList.filter(c => c.status === 'SCHEDULED' || c.status === 'APPROVED');
  const publishedPosts = contentList.filter(c => c.status === 'PUBLISHED');

  return (
    <div className="vw-container">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>Automated Publishing Calendar</h2>
          <p>Daily fixed-time content distribution kernel backed by Swytchcode automation.</p>
        </div>

        <button
          className="vw-btn vw-btn-primary flex-shrink-0"
          onClick={handleTestPublish}
          disabled={isRunning}
        >
          <Play size={16} className={isRunning ? 'animate-spin' : ''} />
          {isRunning ? 'Running Kernel...' : 'Trigger Now (Test Automation)'}
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* Swytchcode Banner */}
      <div className="vw-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Swytchcode Daily Publishing Kernel</h3>
                <span className="vw-badge vw-badge-success">ACTIVE</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5">
                Next Scheduled Run: <strong className="text-blue-700 font-bold">{automationStatus?.nextScheduledRun || '18:00 Today'}</strong> • Daily Schedule: {automationStatus?.publishTime || '18:00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-blue-100 shadow-sm">
            <div>Min Evidence Score: <strong className="text-emerald-600 font-bold">85%</strong></div>
            <div>Min Trend Score: <strong className="text-blue-600 font-bold">80</strong></div>
          </div>
        </div>
      </div>

      {/* Queue & History Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Queue Column */}
        <div className="vw-card">
          <h3 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-200 pb-3 flex items-center gap-2">
            <Clock size={16} className="text-amber-600" />
            Scheduled Queue ({scheduledPosts.length})
          </h3>

          <div>
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div key={post.id} className="vw-item-box">
                  <div className="flex items-center justify-between mb-2">
                    <span className="vw-badge vw-badge-primary">{post.platform}</span>
                    <span className="text-xs font-semibold text-slate-500">{post.scheduledTime || '18:00 Today'}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{post.title}</h4>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{post.body}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                <CalendarDays size={28} className="mx-auto text-slate-300 mb-2" />
                <div className="font-semibold text-slate-600">No scheduled posts in queue.</div>
                <div>Approve content in Content Studio to add to the daily Swytchcode queue!</div>
              </div>
            )}
          </div>
        </div>

        {/* Published History Column */}
        <div className="vw-card">
          <h3 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-200 pb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Published History ({publishedPosts.length})
          </h3>

          <div>
            {publishedPosts.length > 0 ? (
              publishedPosts.map((post) => (
                <div key={post.id} className="vw-item-box">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{post.title}</h4>
                    <span className="vw-badge vw-badge-success">{post.platform}</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Published via Swytchcode • {post.publishedTime || 'Just now'}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                <CheckCircle2 size={28} className="mx-auto text-slate-300 mb-2" />
                <div className="font-semibold text-slate-600">No published posts yet.</div>
                <div>Click "Trigger Now" above to execute the daily Swytchcode publishing workflow!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
