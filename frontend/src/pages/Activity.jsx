import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, Bot, Layers, Zap } from 'lucide-react';

export default function ActivityPage() {
  const [logs, setLogs] = useState([
    {
      id: 'act-001',
      time: 'Just now',
      action: 'TrendForge Platform Online',
      detail: 'Gemini 3.6 Flash & Swytchcode Execution Kernel active and ready',
      status: 'ACTIVE',
      badgeType: 'success'
    }
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data && data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      })
      .catch(err => console.log('Activity log load:', err.message));
  }, []);

  return (
    <div className="vw-container">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>Execution Activity Log</h2>
          <p>Complete historical audit trail of trend discoveries, RAG retrievals, content generation, and Swytchcode automation.</p>
        </div>
      </div>

      <div className="vw-card">
        {logs.map((item, idx) => (
          <div key={item.id || idx} className="vw-activity-item">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0 mt-0.5">
              <Activity size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-900 text-sm">{item.action}</span>
                <span className={`vw-badge vw-badge-${item.badgeType || 'primary'}`}>{item.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.detail}</p>
              <span className="text-xs text-slate-400 mt-1 block font-medium">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
