import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';

export default function BrandDNAPanel({ brandProfile, matchScore = 94 }) {
  const profile = brandProfile || {
    identity: { brandName: 'TrendForge', industry: 'AI & Tech', targetAudience: 'Executives & Tech Leaders' },
    voices: ['Professional', 'Authoritative', 'Educational'],
    rules: { sentenceLength: 'Medium & Concise', preferredCTA: 'Thought-provoking call to discussion' }
  };

  return (
    <div className="vw-card p-6 bg-gradient-to-br from-white via-white to-blue-50/40 border-blue-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
            <Palette size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base leading-tight">Brand DNA Alignment</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">{profile.identity?.brandName || 'TrendForge'} Voice Constraints & Policy</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold shadow-2xs">
          <CheckCircle2 size={14} /> {matchScore}% Match
        </div>
      </div>

      {/* Grid Cards with Clear Vertical Text Separation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-center space-y-2 min-h-[76px]">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">
            Primary Voice
          </div>
          <div className="text-xs font-bold text-slate-900 leading-normal truncate">
            {(profile.voices || []).join(', ') || 'Professional, Authoritative'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-center space-y-2 min-h-[76px]">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">
            Audience
          </div>
          <div className="text-xs font-bold text-slate-900 leading-normal truncate">
            {profile.identity?.targetAudience || 'Enterprise Executives & Tech Leaders'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-center space-y-2 min-h-[76px]">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">
            Writing Style
          </div>
          <div className="text-xs font-bold text-slate-900 leading-normal truncate">
            {profile.rules?.sentenceLength || 'Medium & Concise'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-center space-y-2 min-h-[76px]">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">
            CTA Policy
          </div>
          <div className="text-xs font-bold text-blue-600 leading-normal truncate">
            {profile.rules?.preferredCTA || 'Thought-provoking call to discussion'}
          </div>
        </div>
      </div>
    </div>
  );
}
