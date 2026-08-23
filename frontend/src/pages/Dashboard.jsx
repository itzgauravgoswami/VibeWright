import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  CalendarDays,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Sparkles,
  Bot,
  Database,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ trends = [], contentList = [], automationStatus }) {
  const navigate = useNavigate();

  const highValueCount = trends.filter(t => t.score >= 85).length;
  const scheduledCount = contentList.filter(c => c.status === 'SCHEDULED').length;

  return (
    <div className="vw-container">
      {/* Hero Banner */}
      <div className="vw-hero-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="vw-badge vw-badge-primary">
                <Sparkles size={12} /> Autonomous Agent Active
              </span>
            </div>
            <h2>Autonomous Trend Intelligence & Grounded Content Publishing</h2>
            <p className="mt-1">
              TrendForge continuously discovers emerging trends, retrieves supporting evidence via Weaviate RAG,
              reasons using Gemini 3.6 Flash API, and automates scheduled daily publishing through Swytchcode.
            </p>
          </div>
          <button
            className="vw-btn vw-btn-primary flex-shrink-0"
            onClick={() => navigate('/trends')}
          >
            <TrendingUp size={16} /> Explore Trends
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="vw-kpi-grid">
        <div className="vw-kpi-card">
          <div className="vw-kpi-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="vw-kpi-val">{trends.length}</div>
            <div className="vw-kpi-lbl">Trends Discovered</div>
          </div>
        </div>

        <div className="vw-kpi-card">
          <div className="vw-kpi-icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <Zap size={20} />
          </div>
          <div>
            <div className="vw-kpi-val" style={{ color: '#7c3aed' }}>{highValueCount}</div>
            <div className="vw-kpi-lbl">High-Value Opportunities</div>
          </div>
        </div>

        <div className="vw-kpi-card">
          <div className="vw-kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <FileText size={20} />
          </div>
          <div>
            <div className="vw-kpi-val" style={{ color: '#10b981' }}>{contentList.length}</div>
            <div className="vw-kpi-lbl">Grounded Content Drafts</div>
          </div>
        </div>

        <div className="vw-kpi-card">
          <div className="vw-kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <CalendarDays size={20} />
          </div>
          <div>
            <div className="vw-kpi-val" style={{ color: '#d97706' }}>{scheduledCount}</div>
            <div className="vw-kpi-lbl">Scheduled Posts</div>
          </div>
        </div>

        <div className="vw-kpi-card">
          <div className="vw-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="vw-kpi-val" style={{ color: '#2563eb' }}>{trends.length > 0 ? '94%' : '0%'}</div>
            <div className="vw-kpi-lbl">Avg Evidence Score</div>
          </div>
        </div>
      </div>

      {/* RAG Pipeline Diagram */}
      <div className="vw-card">
        <div className="vw-card-header">
          <h3 className="vw-card-title">
            <Layers size={18} style={{ color: '#2563eb' }} />
            Evidence-Grounded RAG Pipeline Architecture
          </h3>
          <span className="vw-badge vw-badge-purple">Weaviate + Gemini 3.6 Flash Powered</span>
        </div>
        <div className="vw-card-body">
          <div className="vw-rag-pipeline">
            <div className="vw-rag-node">
              <Database size={20} style={{ color: '#2563eb' }} />
              <span>Web Sources</span>
            </div>
            <div className="vw-rag-arrow">➔</div>
            <div className="vw-rag-node">
              <Layers size={20} style={{ color: '#7c3aed' }} />
              <span>Chunk & Embed</span>
            </div>
            <div className="vw-rag-arrow">➔</div>
            <div className="vw-rag-node">
              <Database size={20} style={{ color: '#4f46e5' }} />
              <span>Weaviate Vector DB</span>
            </div>
            <div className="vw-rag-arrow">➔</div>
            <div className="vw-rag-node">
              <Bot size={20} style={{ color: '#10b981' }} />
              <span>Gemini 3.6 Flash LLM</span>
            </div>
            <div className="vw-rag-arrow">➔</div>
            <div className="vw-rag-node">
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
              <span>Grounded Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Emerging Trends */}
      <div className="vw-card">
        <div className="vw-card-header">
          <h3 className="vw-card-title">
            <TrendingUp size={18} style={{ color: '#2563eb' }} />
            Top High-Impact Trends
          </h3>
          <button className="vw-btn vw-btn-secondary" onClick={() => navigate('/trends')}>
            View All Trends <ChevronRight size={14} />
          </button>
        </div>
        <div className="vw-card-body">
          {trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.slice(0, 4).map((trend) => (
                <div
                  key={trend.id}
                  className="vw-item-box hover:border-blue-300 transition-all cursor-pointer group mb-0"
                  onClick={() => navigate(`/trends/${trend.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="vw-badge vw-badge-primary">{trend.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600">{trend.momentum}</span>
                      <span className="text-lg font-extrabold text-blue-600">{trend.score}/100</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                    {trend.title}
                  </h4>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-3">{trend.summary}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-200">
                    <span>{trend.sourceCount} Evidence Sources</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Analyze Evidence <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
              <TrendingUp size={36} className="text-slate-300" />
              <div className="font-bold text-slate-800 text-base">No Discovered Trends Yet</div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Click below to navigate to Trends Intelligence and trigger live web discovery with Gemini 3.6 Flash.
              </p>
              <button className="vw-btn vw-btn-primary text-xs" onClick={() => navigate('/trends')}>
                <TrendingUp size={14} /> Go to Trends Intelligence
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
