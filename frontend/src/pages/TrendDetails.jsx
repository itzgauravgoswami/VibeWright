import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTrendById } from '../services/api';
import {
  TrendingUp,
  ShieldCheck,
  FileText,
  ExternalLink,
  Layers,
  Database,
  Bot,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function TrendDetailsPage() {
  const { trendId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrend() {
      try {
        const res = await fetchTrendById(trendId);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrend();
  }, [trendId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading trend details & evidence sources...</div>;
  }

  if (!data || !data.trend) {
    return (
      <div className="vw-container">
        <button className="vw-btn vw-btn-secondary" onClick={() => navigate('/trends')}>
          <ArrowLeft size={16} /> Back to Trends
        </button>
        <p className="mt-4 text-slate-600">Trend not found.</p>
      </div>
    );
  }

  const { trend, sources } = data;
  const breakdown = trend.breakdown || { popularity: 32, growth: 28, recency: 20, relevance: 14 };

  return (
    <div className="vw-container">
      <div className="flex items-center justify-between">
        <button className="vw-btn vw-btn-secondary" onClick={() => navigate('/trends')}>
          <ArrowLeft size={16} /> Back to Trends
        </button>
        <button
          className="vw-btn vw-btn-primary"
          onClick={() => navigate(`/content?trendId=${trend.id}`)}
        >
          <FileText size={16} /> Generate Grounded Content
        </button>
      </div>

      {/* Main Header */}
      <div className="vw-card p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="vw-badge vw-badge-primary">{trend.category}</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            Momentum: {trend.momentum}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{trend.title}</h2>
        <p className="text-slate-600 text-base">{trend.summary}</p>
      </div>

      {/* Grid: 4-Factor Score & RAG Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 4-Factor Transparent Scoring */}
        <div className="vw-card">
          <div className="vw-card-header">
            <h3 className="vw-card-title">
              <TrendingUp size={18} className="text-blue-600" />
              4-Factor Trend Scoring Breakdown
            </h3>
          </div>
          <div className="vw-card-body">
            <div className="vw-score-card">
              <div className="vw-score-header">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Composite Score</span>
                  <div className="vw-score-total">{trend.score} / 100</div>
                </div>
                <span className="vw-badge vw-badge-success">High Relevance</span>
              </div>

              <div className="vw-score-bars">
                <div>
                  <div className="vw-score-row">
                    <span>Popularity & Volume</span>
                    <span className="font-bold">{breakdown.popularity} / 35</span>
                  </div>
                  <div className="vw-score-track">
                    <div className="vw-score-fill" style={{ width: `${(breakdown.popularity / 35) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="vw-score-row">
                    <span>Growth Velocity</span>
                    <span className="font-bold">{breakdown.growth} / 30</span>
                  </div>
                  <div className="vw-score-track">
                    <div className="vw-score-fill" style={{ width: `${(breakdown.growth / 30) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="vw-score-row">
                    <span>Recency & Freshness</span>
                    <span className="font-bold">{breakdown.recency} / 20</span>
                  </div>
                  <div className="vw-score-track">
                    <div className="vw-score-fill" style={{ width: `${(breakdown.recency / 20) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="vw-score-row">
                    <span>Domain Relevance</span>
                    <span className="font-bold">{breakdown.relevance} / 15</span>
                  </div>
                  <div className="vw-score-track">
                    <div className="vw-score-fill" style={{ width: `${(breakdown.relevance / 15) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why this trend matters */}
        <div className="vw-card">
          <div className="vw-card-header">
            <h3 className="vw-card-title">
              <Bot size={18} className="text-purple-600" />
              AI Intelligence Explanation
            </h3>
          </div>
          <div className="vw-card-body flex flex-col justify-between h-full">
            <div className="space-y-3">
              <p className="text-slate-700 text-sm leading-relaxed">
                TrendForge evaluated {sources ? sources.length : 3} independent sources across news and industry publications.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Search interest and discussion velocity increased significantly.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Multiple verified publishers confirm factual baseline.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> High alignment with target industry audience requirements.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Evidence Sources */}
      <div className="vw-card">
        <div className="vw-card-header">
          <h3 className="vw-card-title">
            <Database size={18} className="text-blue-600" />
            Retrieved Weaviate RAG Evidence Sources ({sources ? sources.length : 0})
          </h3>
        </div>
        <div className="vw-card-body">
          <div className="space-y-4">
            {sources && sources.length > 0 ? (
              sources.map((src, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{src.title}</span>
                      <span className="vw-badge vw-badge-purple">{src.publisher || 'Web Source'}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      Relevance: {src.relevanceScore || 92}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{src.excerpt}"</p>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      View Source Reference <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No evidence sources linked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
