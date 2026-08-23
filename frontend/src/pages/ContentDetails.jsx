import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContentById, approveContentItem, scheduleContentItem } from '../services/api';
import { ArrowLeft, ShieldCheck, CheckCircle2, CalendarDays, ExternalLink, Sparkles, Repeat2 } from 'lucide-react';

export default function ContentDetailsPage() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchContentById(contentId);
        setItem(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentId]);

  const handleApprove = async () => {
    try {
      const approved = await approveContentItem(contentId);
      await scheduleContentItem(contentId, '18:00 Today');
      setItem({ ...approved, status: 'SCHEDULED' });
      setNotification({
        type: 'success',
        message: '✅ Content item approved and scheduled for daily publishing at 18:00 via Swytchcode!'
      });
    } catch (err) {
      setNotification({ type: 'error', message: 'Approval error: ' + err.message });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading content item...</div>;
  if (!item) return <div className="p-8 text-center text-slate-500">Content item not found.</div>;

  return (
    <div className="vw-container space-y-4">
      <div className="flex items-center justify-between">
        <button className="vw-btn vw-btn-secondary" onClick={() => navigate('/content')}>
          <ArrowLeft size={16} /> Back to Content Studio
        </button>
        <div className="flex items-center gap-2">
          <button
            className="vw-btn vw-btn-secondary border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
            onClick={() => navigate(`/repurpose/${contentId}`)}
          >
            <Repeat2 size={16} /> Repurpose into 4 Formats
          </button>
          <button
            className={`vw-btn ${item.status === 'SCHEDULED' ? 'vw-btn-secondary text-emerald-700 bg-emerald-50 border-emerald-200' : 'vw-btn-primary'}`}
            onClick={handleApprove}
          >
            <CheckCircle2 size={16} /> {item.status === 'SCHEDULED' ? 'Approved & Scheduled' : 'Approve & Schedule'}
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border font-semibold flex items-center justify-between gap-3 text-sm ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
            : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            className="vw-btn vw-btn-primary text-xs flex-shrink-0"
            onClick={() => navigate('/calendar')}
          >
            <CalendarDays size={14} /> View in Publishing Calendar
          </button>
        </div>
      )}

      <div className="vw-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="vw-badge vw-badge-primary">{item.platform}</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{item.title}</h2>
          </div>
          <span className={`vw-badge ${item.status === 'SCHEDULED' ? 'vw-badge-success' : 'vw-badge-purple'}`}>
            {item.status}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
          {item.body}
        </div>

        {/* Claim Traceability */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" /> Evidence Claims ({item.claims ? item.claims.length : 0})
          </h4>
          <div className="space-y-2">
            {item.claims && item.claims.map((claim, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-900">Claim: "{claim.claimText}"</div>
                <div className="text-slate-500 mt-1">Source: {claim.sourceTitle || 'Retrieved Evidence'} • Confidence: {claim.confidence || 94}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
