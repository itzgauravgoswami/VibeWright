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
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Zap, Award } from 'lucide-react';

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
    trendsDetected: 0,
    highValueTrends: 0,
    contentGenerated: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    avgEvidenceScore: 0,
    automationSuccessRate: 0
  };

  return (
    <div className="vw-container">
      <div className="vw-header-banner">
        <div>
          <h2>Platform Analytics & Performance</h2>
          <p>Real-time metrics on trend velocity, RAG evidence score distribution, and publishing automation.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Trends Discovered</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{overview.trendsDetected}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Live Market Signals</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Avg Evidence Score</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{overview.avgEvidenceScore > 0 ? `${overview.avgEvidenceScore}%` : 'N/A'}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Weaviate RAG Grounding</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Published Content</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{overview.publishedPosts}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Swytchcode Kernel</div>
        </div>

        <div className="vw-card p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Automation Rate</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{overview.automationSuccessRate}%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">0 Safety Blocks</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="vw-card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> Discovered Trend Category Breakdown
          </h3>
          <div className="h-64">
            {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Trend Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No trend categories recorded yet. Discover trends to populate analytics!
              </div>
            )}
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
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Content Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
