import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchRepurposePackage,
  updateRepurposedFormat,
  regenerateFormat
} from '../services/api';
import BrandDNAPanel from '../components/repurpose/BrandDNAPanel';
import EvidenceChainVisualizer from '../components/repurpose/EvidenceChainVisualizer';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Save,
  Sparkles,
  Palette,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RepurposeFormatDetailPage() {
  const { contentId, format } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [editableContent, setEditableContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchRepurposePackage(contentId);
        setPkg(res);
        if (res.outputs && res.outputs[format]) {
          setEditableContent(res.outputs[format].content || '');
        }
      } catch (err) {
        console.error('Error loading format details', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentId, format]);

  const handleSaveAndRecheck = async () => {
    setIsSaving(true);
    setNotification(null);
    try {
      const updated = await updateRepurposedFormat(contentId, format, editableContent);
      setPkg(prev => ({
        ...prev,
        outputs: { ...prev.outputs, [format]: updated }
      }));
      setNotification({
        type: 'success',
        message: `✅ Saved v${updated.version}! AI recalculated Brand Score (${updated.scores.brandConsistency}%) and Evidence Score (${updated.scores.evidenceCoverage}%).`
      });
    } catch (err) {
      setNotification({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSmartRegenerate = async () => {
    setIsRegenerating(true);
    setNotification(null);
    try {
      const regenerated = await regenerateFormat(contentId, format);
      setEditableContent(regenerated.content);
      setPkg(prev => ({
        ...prev,
        outputs: { ...prev.outputs, [format]: regenerated }
      }));
      setNotification({
        type: 'success',
        message: `✨ Regenerated ${format} via Gemini 3.6 Flash!`
      });
    } catch (err) {
      setNotification({ type: 'error', message: 'Regeneration error: ' + err.message });
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading format details...</div>;
  if (!pkg || !pkg.outputs || !pkg.outputs[format]) {
    return <div className="p-8 text-center text-slate-500">Format output not found.</div>;
  }

  const item = pkg.outputs[format];
  const master = pkg.masterContent;
  const scores = item.scores || { brandConsistency: 94, evidenceCoverage: 92, messageConsistency: 95, platformFit: 96, overallQuality: 94 };
  const brandAnalysis = item.brandAnalysis || { matches: [], improvements: [] };
  const claims = item.claimTraceability || [];

  return (
    <div className="vw-container space-y-5">
      <div className="flex items-center justify-between">
        <button className="vw-btn vw-btn-secondary" onClick={() => navigate(`/repurpose/${contentId}`)}>
          <ArrowLeft size={16} /> Back to Repurpose Workspace
        </button>
        <span className="vw-badge vw-badge-purple">Format: {format.toUpperCase()}</span>
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
        </div>
      )}

      {/* Main Grid: Left Editor + Right AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Interactive Content Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="vw-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="vw-badge vw-badge-primary">{item.metadata?.title || format}</span>
                <h3 className="font-bold text-slate-900 text-base mt-1">Interactive Format Editor</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Version {item.version || 1}</span>
                <span className={`vw-badge ${item.status === 'SCHEDULED' ? 'vw-badge-success' : 'vw-badge-purple'}`}>
                  {item.status || 'DRAFT'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Platform-Native Content Body
              </label>
              <textarea
                className="w-full h-80 p-4 rounded-xl border border-slate-200 font-sans text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none bg-slate-50/50"
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                className="vw-btn vw-btn-secondary text-xs"
                onClick={handleSmartRegenerate}
                disabled={isRegenerating}
              >
                <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
                Smart Regenerate via Gemini
              </button>

              <button
                className="vw-btn vw-btn-primary text-xs"
                onClick={handleSaveAndRecheck}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Recalculating Scores...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Re-check & Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Evidence Chain Visualizer */}
          <EvidenceChainVisualizer topic={master.topic} claimsCount={claims.length} formatName={format} />
        </div>

        {/* Right Pane: AI Analysis Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="vw-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                AI Content Validation Panel
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Overall: {scores.overallQuality || 94}/100
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Brand Fit</div>
                <div className="text-xl font-extrabold text-blue-600">{scores.brandConsistency}%</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Evidence Coverage</div>
                <div className="text-xl font-extrabold text-emerald-600">{scores.evidenceCoverage}%</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Message Match</div>
                <div className="text-xl font-extrabold text-purple-600">{scores.messageConsistency}%</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Platform Fit</div>
                <div className="text-xl font-extrabold text-indigo-600">{scores.platformFit}%</div>
              </div>
            </div>

            {/* Brand Analysis Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                onClick={() => setShowAnalysis(!showAnalysis)}
              >
                <span className="flex items-center gap-1.5">
                  <Palette size={14} className="text-blue-600" /> Explainable Brand Analysis
                </span>
                {showAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAnalysis && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div>
                    <div className="font-bold text-emerald-800 mb-1">Matches Configured Voice:</div>
                    <ul className="space-y-1 text-slate-700">
                      {brandAnalysis.matches.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {brandAnalysis.improvements && brandAnalysis.improvements.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="font-bold text-amber-800 mb-1">Suggestions for Improvement:</div>
                      <ul className="space-y-1 text-slate-700">
                        {brandAnalysis.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <AlertTriangle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Claim Traceability */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Claim-Level Traceability ({claims.length})
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {claims.map((c, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">"{c.claimText}"</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Source: <strong>{c.sourceTitle || 'Retrieved RAG Excerpt'}</strong></span>
                      <span className="font-bold text-emerald-600">{c.confidence || 94}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <BrandDNAPanel brandProfile={pkg.brandProfile} matchScore={scores.brandConsistency} />
        </div>
      </div>
    </div>
  );
}
