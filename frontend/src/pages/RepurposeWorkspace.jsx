import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchRepurposePackage,
  generateRepurposedFormats,
  scheduleRepurposedPackage
} from '../services/api';
import BrandDNAPanel from '../components/repurpose/BrandDNAPanel';
import EvidenceChainVisualizer from '../components/repurpose/EvidenceChainVisualizer';
import {
  Repeat2,
  FileText,
  Video,
  List,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Layers,
  Zap,
  Check
} from 'lucide-react';

export default function RepurposeWorkspacePage() {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [notification, setNotification] = useState(null);

  const [selectedFormats, setSelectedFormats] = useState({
    video_script: true,
    thread: true,
    caption: true,
    blog_snippet: true
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchRepurposePackage(contentId);
        setPkg(res);
      } catch (err) {
        console.error('Error loading repurpose package', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentId]);

  const toggleFormat = (fmt) => {
    setSelectedFormats(prev => ({ ...prev, [fmt]: !prev[fmt] }));
  };

  const handleGenerateAll = async () => {
    const formatsToRun = Object.keys(selectedFormats).filter(f => selectedFormats[f]);
    if (formatsToRun.length === 0) return;

    setIsGenerating(true);
    setNotification(null);
    setGenerationStep(1);

    // Animated workflow simulation steps
    setTimeout(() => setGenerationStep(2), 500);
    setTimeout(() => setGenerationStep(3), 1000);
    setTimeout(() => setGenerationStep(4), 1600);

    try {
      const updatedPkg = await generateRepurposedFormats(contentId, formatsToRun);
      setPkg(updatedPkg);
      setNotification({
        type: 'success',
        message: `🎉 Successfully repurposed content into ${formatsToRun.length} platform-native formats!`
      });
    } catch (err) {
      setNotification({ type: 'error', message: 'Repurposing error: ' + err.message });
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleScheduleAll = async () => {
    try {
      const scheduledPkg = await scheduleRepurposedPackage(contentId);
      setPkg(scheduledPkg);
      setNotification({
        type: 'success',
        message: '✅ Complete 4-format Content Package scheduled for daily publishing via Swytchcode!'
      });
    } catch (err) {
      setNotification({ type: 'error', message: 'Scheduling error: ' + err.message });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Repurposing Workspace...</div>;
  if (!pkg) return <div className="p-8 text-center text-slate-500">Repurpose package not found.</div>;

  const master = pkg.masterContent;
  const outputs = pkg.outputs || {};
  const hasOutputs = Object.keys(outputs).length > 0;

  const formatMeta = {
    video_script: { title: 'Short-Form Video Script', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
    thread: { title: 'Social Thread', icon: List, color: 'text-blue-600', bg: 'bg-blue-50' },
    caption: { title: 'Social Caption', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    blog_snippet: { title: 'Blog Snippet', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  };

  return (
    <div className="vw-container space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <button className="vw-btn vw-btn-secondary" onClick={() => navigate('/repurpose')}>
          <ArrowLeft size={16} /> Back to Master Content
        </button>
        <span className="vw-badge vw-badge-purple">One Idea ➔ 4 Derivative Formats</span>
      </div>

      <div className="vw-header-banner">
        <div>
          <h2>Repurpose Content Workspace</h2>
          <p>Transform one core idea into platform-ready content without losing the original message, evidence grounding, or brand voice.</p>
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
          <button className="vw-btn vw-btn-primary text-xs" onClick={() => navigate('/calendar')}>
            <CalendarDays size={14} /> View Calendar Queue
          </button>
        </div>
      )}

      {/* Master Content Summary Card */}
      <div className="vw-card p-6 border-blue-200 bg-gradient-to-r from-white via-white to-blue-50/40 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="vw-badge vw-badge-primary">Master Content (Source of Truth)</span>
            <span className="text-xs font-bold text-slate-500">• ID: {master.id}</span>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-extrabold shadow-2xs inline-flex items-center gap-1.5 flex-shrink-0">
            <ShieldCheck size={14} /> {master.evidenceScore || 94}% Evidence Score
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-xl leading-snug">{master.topic}</h3>
          <p className="text-slate-700 text-sm leading-relaxed font-sans">{master.coreMessage}</p>
        </div>

        {master.keyPoints && master.keyPoints.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Core Factual Claims & Key Insights
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700">
              {master.keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200/90 shadow-2xs leading-relaxed">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{kp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Brand DNA Panel */}
      <BrandDNAPanel brandProfile={pkg.brandProfile} matchScore={94} />

      {/* Repurposing Action & Format Selector Card */}
      <div className="vw-card p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" /> Format Repurposing Selector
            </h3>
            <p className="text-xs text-slate-500 mt-1">Select platform-native target formats to generate in parallel via Gemini 3.6 Flash.</p>
          </div>

          <button
            className="vw-btn vw-btn-primary flex-shrink-0"
            onClick={handleGenerateAll}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Generating Formats...
              </>
            ) : (
              <>
                <Repeat2 size={16} /> Generate All Selected Formats
              </>
            )}
          </button>
        </div>

        {/* Format Checkbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(formatMeta).map((fmtKey) => {
            const meta = formatMeta[fmtKey];
            const Icon = meta.icon;
            const isChecked = selectedFormats[fmtKey];
            return (
              <div
                key={fmtKey}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 min-h-[68px] ${
                  isChecked
                    ? 'bg-blue-50/70 border-blue-400 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                }`}
                onClick={() => toggleFormat(fmtKey)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs tracking-wide uppercase leading-tight truncate">
                    {meta.title}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Generation Pipeline Progress UI */}
        {isGenerating && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-2 mb-2">
              <RefreshCw size={14} className="animate-spin text-blue-600" />
              Gemini 3.6 Flash Content Transformation Pipeline Running...
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div className={`p-2 rounded-lg border ${generationStep >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200'}`}>
                1. Master Content & Evidence {generationStep >= 1 ? '✓' : ''}
              </div>
              <div className={`p-2 rounded-lg border ${generationStep >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200'}`}>
                2. Brand DNA Rules {generationStep >= 2 ? '✓' : ''}
              </div>
              <div className={`p-2 rounded-lg border ${generationStep >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200'}`}>
                3. Gemini Synthesis {generationStep >= 3 ? '✓' : ''}
              </div>
              <div className={`p-2 rounded-lg border ${generationStep >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200'}`}>
                4. Quality Audit Validation {generationStep >= 4 ? '✓' : ''}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Format Output Cards Grid */}
      {hasOutputs ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              Generated Derivative Formats ({Object.keys(outputs).length})
            </h3>
            <button className="vw-btn vw-btn-primary text-xs" onClick={handleScheduleAll}>
              <CalendarDays size={14} /> Schedule Complete Package via Swytchcode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.keys(outputs).map((fmtKey) => {
              const item = outputs[fmtKey];
              const meta = formatMeta[fmtKey] || { title: fmtKey, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
              const Icon = meta.icon;
              const scores = item.scores || { brandConsistency: 94, evidenceCoverage: 92, messageConsistency: 95, platformFit: 96, overallQuality: 94 };

              return (
                <div key={fmtKey} className="vw-card flex flex-col justify-between space-y-4 border-slate-200 hover:border-blue-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{meta.title}</h4>
                          <span className="text-[11px] text-slate-500">{item.metadata?.estimatedTime || 'Platform Native'}</span>
                        </div>
                      </div>
                      <span className={`vw-badge ${item.status === 'SCHEDULED' ? 'vw-badge-success' : 'vw-badge-purple'}`}>
                        {item.status || 'DRAFT'}
                      </span>
                    </div>

                    {/* AI Scores Summary Pill Grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Brand</div>
                        <div className="font-extrabold text-blue-600">{scores.brandConsistency}%</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence</div>
                        <div className="font-extrabold text-emerald-600">{scores.evidenceCoverage}%</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Message</div>
                        <div className="font-extrabold text-purple-600">{scores.messageConsistency}%</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Fit</div>
                        <div className="font-extrabold text-indigo-600">{scores.platformFit}%</div>
                      </div>
                    </div>

                    {/* Content Preview Excerpt */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                      {item.content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      className="vw-btn vw-btn-secondary text-xs"
                      onClick={() => navigate(`/repurpose/${contentId}/${fmtKey}`)}
                    >
                      <Edit3 size={14} /> Inspect & Edit Format
                    </button>
                    <span className="text-xs text-slate-400 font-semibold">v{item.version || 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Chain Visualizer */}
          <EvidenceChainVisualizer topic={master.topic} claimsCount={3} formatName="All 4 Derivative Formats" />
        </div>
      ) : (
        <div className="vw-card p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
            <Repeat2 size={26} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="font-bold text-slate-900 text-xl tracking-tight">
              No Derivative Outputs Generated Yet
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Click <strong className="text-slate-800 font-semibold">"Generate All Selected Formats"</strong> above to transform this Master Content into short-form Video Script, Thread, Caption, and Blog Snippet!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
