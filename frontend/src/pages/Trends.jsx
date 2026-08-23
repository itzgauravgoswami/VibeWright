import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function TrendsPage({ trends, onTriggerDiscovery, isDiscovering }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Technology', 'Healthcare', 'Marketing', 'Cybersecurity'];

  // Filter trends cleanly
  const filteredTrends = trends.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="vw-container">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>Emerging Trends Intelligence</h2>
          <p>Real-time trend scoring evaluated across Popularity, Growth, Recency, and Relevance.</p>
        </div>
        <button
          className="vw-btn vw-btn-primary flex-shrink-0"
          onClick={onTriggerDiscovery}
          disabled={isDiscovering}
        >
          <RefreshCw size={16} className={isDiscovering ? 'animate-spin' : ''} />
          {isDiscovering ? 'Scanning Web...' : 'Scan Fresh Web Trends'}
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="vw-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <SlidersHorizontal size={16} className="text-slate-400 flex-shrink-0 mr-1" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex-shrink-0">
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="vw-search-box w-full md:w-64">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              className="vw-search-input"
              placeholder="Search trend topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Trend Cards Grid */}
      {filteredTrends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className="vw-card flex flex-col justify-between hover:border-blue-300 transition-all cursor-pointer group"
              onClick={() => navigate(`/trends/${trend.id}`)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="vw-badge vw-badge-primary">{trend.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">{trend.momentum}</span>
                    <span className="text-xl font-extrabold text-blue-600">{trend.score}/100</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {trend.title}
                </h3>

                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
                  {trend.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                {/* Score Progress Bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2.5">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${trend.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <span>{trend.sourceCount} Evidence Sources</span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Analyze Evidence <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="vw-card p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <TrendingUp size={26} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="font-bold text-slate-900 text-xl tracking-tight">
              No Trends Currently Discovered
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Click <strong className="text-slate-800 font-semibold">"Scan Fresh Web Trends"</strong> below to evaluate emerging market signals via Gemini 3.6 Flash and Weaviate RAG!
            </p>
          </div>
          <button
            className="vw-btn vw-btn-primary"
            onClick={onTriggerDiscovery}
            disabled={isDiscovering}
          >
            <RefreshCw size={16} className={isDiscovering ? 'animate-spin' : ''} />
            {isDiscovering ? 'Scanning Web...' : 'Scan Fresh Web Trends Now'}
          </button>
        </div>
      )}
    </div>
  );
}
