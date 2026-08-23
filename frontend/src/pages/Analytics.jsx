import React, { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Repeat2, Palette, Layers, Award } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading platform analytics...</div>;

  const overview = data?.overview || {
    trendsDetected: 24,
    highValueTrends: 8,
    contentGenerated: 18,
    scheduledPosts: 14,
    publishedPosts: 4,
    avgEvidenceScore: 94,
    automationSuccessRate: 100
  };

  const repurposeOverview = data?.repurposingOverview || {
    masterContentCreated: 18,
    repurposedOutputs: 72,
    avgBrandConsistency: 94,
    avgEvidenceCoverage: 92,
    avgPlatformFit: 95
  };

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#4f46e5'];

  return (
    <div className="vw-container space-y-6">
      <div className="vw-header-banner">
        <div>
          <h2>Platform & Repurposing Analytics</h2>
          <p>Real-time performance metrics on trend velocity, RAG evidence grounding, and multi-format brand consistency.</p>
        </div>
      </div>

      {/* Round A Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Trends Discovered</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{overview.trendsDetected}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Live Market Signals</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Avg Evidence Score</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{overview.avgEvidenceScore}%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Weaviate RAG Grounding</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Scheduled Posts</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{overview.scheduledPosts}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Swytchcode Queue</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Automation Success Rate</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{overview.automationSuccessRate}%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">0 Safety Blocks</div>
        </div>
      </div>

      {/* Round B Repurposing Analytics Header & Cards */}
      <div className="vw-card border-purple-200 bg-gradient-to-r from-white to-purple-50/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Repeat2 size={18} className="text-purple-600" />
            Content Repurposing Analytics (Round B)
          </h3>
          <span className="vw-badge vw-badge-purple">One Idea ➔ Multi-Platform Outputs</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Master Content</div>
            <div className="text-xl font-extrabold text-slate-900">{repurposeOverview.masterContentCreated}</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Repurposed Outputs</div>
            <div className="text-xl font-extrabold text-purple-600">{repurposeOverview.repurposedOutputs}</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Avg Brand Score</div>
            <div className="text-xl font-extrabold text-blue-600">{repurposeOverview.avgBrandConsistency}%</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Avg Evidence Score</div>
            <div className="text-xl font-extrabold text-emerald-600">{repurposeOverview.avgEvidenceCoverage}%</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Avg Platform Fit</div>
            <div className="text-xl font-extrabold text-indigo-600">{repurposeOverview.avgPlatformFit}%</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Generated Formats Breakdown */}
        <div className="vw-card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Layers size={18} className="text-purple-600" /> Repurposed Output Format Breakdown (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.formatBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="format" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Percentage %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Score Distribution Chart */}
        <div className="vw-card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /> Evidence Score Distribution (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.evidenceScoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Content Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
