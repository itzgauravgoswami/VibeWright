import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRepurposeMasterList, fetchBrandProfile } from '../services/api';
import BrandDNAPanel from '../components/repurpose/BrandDNAPanel';
import {
  Repeat2,
  FileText,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Video,
  List,
  MessageSquare
} from 'lucide-react';

export default function RepurposeListPage({ trends = [] }) {
  const navigate = useNavigate();
  const [masters, setMasters] = useState([]);
  const [brandProfile, setBrandProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mRes, bRes] = await Promise.all([
          fetchRepurposeMasterList().catch(() => ({ masters: [] })),
          fetchBrandProfile().catch(() => null)
        ]);

        if (mRes && mRes.masters && mRes.masters.length > 0) {
          setMasters(mRes.masters);
        } else if (trends.length > 0) {
          setMasters(trends.map(t => ({
            id: t.id,
            trendId: t.id,
            topic: t.title,
            coreMessage: t.summary,
            evidenceScore: t.score || 94,
            status: 'READY'
          })));
        } else {
          // Fallback master item for instant demo
          setMasters([
            {
              id: 'tr-101',
              topic: 'Autonomous Multi-Agent Orchestration & Real-Time RAG',
              coreMessage: 'Enterprise AI adoption is shifting towards real-time multi-agent orchestration architectures grounded in vector knowledge bases.',
              evidenceScore: 94,
              status: 'READY'
            }
          ]);
        }

        setBrandProfile(bRes);
      } catch (err) {
        console.error('Repurpose list error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trends]);

  return (
    <div className="vw-container space-y-6">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>Content Repurposing Engine</h2>
          <p>Transform one authoritative Master Content idea into platform-native Video Scripts, Threads, Captions, and Blog Snippets while remaining 100% on-brand.</p>
        </div>
      </div>

      {/* Brand DNA Panel */}
      <BrandDNAPanel brandProfile={brandProfile} matchScore={94} />

      {/* Master Content Selection Section */}
      <div className="vw-card">
        <div className="vw-card-header border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
          <h3 className="vw-card-title text-base font-bold flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Eligible Master Content ({masters.length})
          </h3>
          <span className="vw-badge vw-badge-purple">One Idea ➔ Multi-Platform Outputs</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
            <RefreshCw size={16} className="animate-spin text-blue-600" /> Loading Master Content list...
          </div>
        ) : masters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masters.map((master) => (
              <div
                key={master.id}
                className="vw-item-box hover:border-blue-300 transition-all cursor-pointer group mb-0 flex flex-col justify-between"
                onClick={() => navigate(`/repurpose/${master.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="vw-badge vw-badge-primary">Master Content</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck size={13} /> {master.evidenceScore}% Evidence
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors leading-snug">
                    {master.topic}
                  </h4>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
                    {master.coreMessage}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <Video size={13} /> <List size={13} /> <MessageSquare size={13} /> <FileText size={13} />
                    <span>4 Formats Ready</span>
                  </div>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Repurpose Content <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <Repeat2 size={26} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-bold text-slate-900 text-xl tracking-tight">
                No Master Content Ready
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Generate grounded content or discover fresh trends first to make content available for multi-format repurposing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
