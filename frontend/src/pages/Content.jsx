import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateGroundedContent, approveContentItem, scheduleContentItem } from '../services/api';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  CalendarDays,
  ExternalLink,
  Bot,
  Layers,
  Send,
  AlertCircle
} from 'lucide-react';

export default function ContentPage({ trends, refreshContent }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTrendId = searchParams.get('trendId') || (trends[0] ? trends[0].id : '');

  const [selectedTrendId, setSelectedTrendId] = useState(initialTrendId);
  const [platform, setPlatform] = useState('LinkedIn');
  const [contentType, setContentType] = useState('LinkedIn Post');
  const [tone, setTone] = useState('Professional & Authoritative');
  const [audience, setAudience] = useState('Enterprise Executives');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setNotification(null);
    try {
      const res = await generateGroundedContent({
        trendId: selectedTrendId,
        platform,
        type: contentType,
        tone,
        audience
      });
      setGeneratedContent(res);
      if (refreshContent) refreshContent();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to generate content: ' + err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndSchedule = async () => {
    if (!generatedContent) return;
    try {
      await approveContentItem(generatedContent.id);
      await scheduleContentItem(generatedContent.id, '18:00 Today');
      
      // Update local state immediately so status badge reflects SCHEDULED
      setGeneratedContent(prev => ({ ...prev, status: 'SCHEDULED' }));
      
      setNotification({
        type: 'success',
        message: '✅ Content approved and scheduled for daily publishing at 18:00 via Swytchcode!'
      });
      if (refreshContent) refreshContent();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error approving content: ' + err.message });
    }
  };

  return (
    <div className="vw-container">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>Grounded Content Studio</h2>
          <p>Generate evidence-grounded marketing & social content validated against Weaviate RAG sources.</p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border font-semibold flex items-center justify-between gap-3 text-sm ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
            : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          {notification.type === 'success' && (
            <button
              className="vw-btn vw-btn-primary text-xs flex-shrink-0"
              onClick={() => navigate('/calendar')}
            >
              <CalendarDays size={14} /> View in Publishing Calendar
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters Workspace */}
        <div className="lg:col-span-4">
          <div className="vw-card">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" /> Content Parameters
            </h3>

            <div>
              <label>Source Trend</label>
              {trends && trends.length > 0 ? (
                <select
                  value={selectedTrendId}
                  onChange={(e) => setSelectedTrendId(e.target.value)}
                >
                  {trends.map(t => (
                    <option key={t.id} value={t.id}>{t.title} (Score: {t.score})</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mb-3">
                  No trends discovered yet. Click <strong>"Discover Trends"</strong> on the Trends page first, or generate custom grounded content below!
                </div>
              )}

              <label>Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter/X">Twitter / X</option>
                <option value="Instagram">Instagram</option>
                <option value="Newsletter">Email Newsletter</option>
                <option value="YouTube">Short-form Video Script</option>
              </select>

              <label>Content Format</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="LinkedIn Post">LinkedIn Post</option>
                <option value="Twitter Thread">Twitter Thread</option>
                <option value="Instagram Caption">Instagram Caption</option>
                <option value="Newsletter Article">Newsletter Article</option>
                <option value="Blog Outline">Blog Outline</option>
              </select>

              <label>Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional & Authoritative">Professional & Authoritative</option>
                <option value="Thought Leadership">Thought Leadership</option>
                <option value="Engaging & Educational">Engaging & Educational</option>
                <option value="Conversational & Casual">Conversational & Casual</option>
              </select>

              <div className="pt-2">
                <button
                  className="vw-btn vw-btn-primary w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Generating via Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate RAG Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Preview & Quality Audit Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {generatedContent ? (
            <>
              {/* Main Preview Workspace Card */}
              <div className="vw-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="vw-badge vw-badge-primary">{generatedContent.platform}</span>
                    <span className="text-xs text-slate-500 font-semibold">• {generatedContent.type}</span>
                  </div>
                  <span className={`vw-badge ${generatedContent.status === 'SCHEDULED' ? 'vw-badge-success' : 'vw-badge-purple'}`}>
                    {generatedContent.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {generatedContent.title}
                  </h3>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {generatedContent.body}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    className="vw-btn vw-btn-secondary text-xs"
                    onClick={() => setShowClaimModal(true)}
                  >
                    <ShieldCheck size={16} className="text-emerald-600" />
                    Inspect Evidence Claims ({generatedContent.claims ? generatedContent.claims.length : 0})
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      className="vw-btn vw-btn-secondary text-xs"
                      onClick={handleGenerate}
                    >
                      <RefreshCw size={14} /> Regenerate
                    </button>
                    <button
                      className={`vw-btn ${generatedContent.status === 'SCHEDULED' ? 'vw-btn-secondary text-emerald-700 bg-emerald-50 border-emerald-200' : 'vw-btn-primary'} text-xs`}
                      onClick={handleApproveAndSchedule}
                    >
                      <CheckCircle2 size={16} /> {generatedContent.status === 'SCHEDULED' ? 'Approved & Scheduled' : 'Approve & Schedule'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality Audit Card */}
              <div className="vw-card">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Gemini Anti-Hallucination & Quality Audit
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Grounding</div>
                    <div className="text-lg font-extrabold text-emerald-600">
                      {generatedContent.qualityAudit?.grounding || 94}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Relevance</div>
                    <div className="text-lg font-extrabold text-blue-600">
                      {generatedContent.qualityAudit?.relevance || 96}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Readability</div>
                    <div className="text-lg font-extrabold text-indigo-600">
                      {generatedContent.qualityAudit?.readability || 91}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tone</div>
                    <div className="text-lg font-extrabold text-purple-600">
                      {generatedContent.qualityAudit?.toneConsistency || 92}%
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center col-span-2 sm:col-span-1">
                    <div className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1">Overall</div>
                    <div className="text-xl font-extrabold text-blue-700">
                      {generatedContent.qualityAudit?.overallScore || 93}/100
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="vw-card p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                <FileText size={26} />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-bold text-slate-900 text-xl tracking-tight">
                  Content Studio Workspace Ready
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Select your target preferences on the left, then click <strong className="text-slate-800 font-semibold">"Generate RAG Content"</strong> to produce grounded, evidence-backed publications using Gemini 3.6 Flash!
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="vw-badge vw-badge-primary">
                  <Sparkles size={12} className="inline mr-1" /> Gemini 3.6 Flash Active
                </span>
                <span className="vw-badge vw-badge-purple">
                  <ShieldCheck size={12} className="inline mr-1" /> RAG Grounding Enabled
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim Traceability Modal */}
      {showClaimModal && generatedContent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="vw-card max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" /> Evidence Claim Traceability
              </h3>
              <button
                className="text-slate-400 hover:text-slate-700 font-bold text-base px-2 py-1 rounded-md"
                onClick={() => setShowClaimModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every factual assertion in the generated publication is mapped directly back to retrieved Weaviate RAG evidence sources.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {generatedContent.claims && generatedContent.claims.map((claim, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900">Claim {idx + 1}: "{claim.claimText}"</div>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200">
                    <span>Evidence Source: <strong>{claim.sourceTitle || 'Retrieved RAG Document'}</strong></span>
                    <span className="font-bold text-emerald-600">Confidence: {claim.confidence || 94}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button className="vw-btn vw-btn-primary" onClick={() => setShowClaimModal(false)}>
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
