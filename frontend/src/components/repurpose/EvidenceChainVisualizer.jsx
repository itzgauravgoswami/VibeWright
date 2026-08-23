import React from 'react';
import { Database, Layers, ShieldCheck, FileText, Repeat2, ChevronRight } from 'lucide-react';

export default function EvidenceChainVisualizer({ topic, claimsCount = 3, formatName = 'Derivative Format' }) {
  return (
    <div className="vw-card">
      <div className="vw-card-header border-b border-slate-100 pb-3 mb-3">
        <h4 className="vw-card-title text-sm font-bold flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          End-to-End Evidence Chain Verification
        </h4>
        <span className="vw-badge vw-badge-purple">100% Traceable</span>
      </div>

      <div className="vw-card-body p-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs overflow-x-auto">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0">
            <Database size={16} className="text-blue-600" />
            <div>
              <div className="font-bold text-slate-900">Web Source</div>
              <div className="text-[10px] text-slate-500">TechInsight & Papers</div>
            </div>
          </div>

          <div className="text-slate-400 font-bold hidden md:block">➔</div>

          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0">
            <Layers size={16} className="text-purple-600" />
            <div>
              <div className="font-bold text-slate-900">Weaviate RAG</div>
              <div className="text-[10px] text-slate-500">Vector Embeddings</div>
            </div>
          </div>

          <div className="text-slate-400 font-bold hidden md:block">➔</div>

          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0">
            <FileText size={16} className="text-indigo-600" />
            <div>
              <div className="font-bold text-slate-900">Master Content</div>
              <div className="text-[10px] text-slate-500">Source of Truth</div>
            </div>
          </div>

          <div className="text-slate-400 font-bold hidden md:block">➔</div>

          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 shadow-2xs flex-shrink-0">
            <Repeat2 size={16} className="text-emerald-700" />
            <div>
              <div className="font-bold text-emerald-900">{formatName}</div>
              <div className="text-[10px] text-emerald-700">{claimsCount} Grounded Claims</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
