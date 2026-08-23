import React, { useState, useEffect } from 'react';
import { fetchBrandProfile, updateBrandProfile } from '../services/api';
import BrandDNAPanel from '../components/repurpose/BrandDNAPanel';
import { Palette, Save, CheckCircle2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

export default function BrandProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [brandName, setBrandName] = useState('TrendForge');
  const [industry, setIndustry] = useState('AI & Technology');
  const [targetAudience, setTargetAudience] = useState('Enterprise Executives & Tech Leaders');
  const [description, setDescription] = useState('');
  const [sentenceLength, setSentenceLength] = useState('Medium & Concise');
  const [formality, setFormality] = useState('High');
  const [preferredCTA, setPreferredCTA] = useState('Thought-provoking call to discussion');
  const [customInstructions, setCustomInstructions] = useState('');

  const voiceOptions = ['Professional', 'Authoritative', 'Educational', 'Confident', 'Thought Leadership', 'Conversational', 'Technical'];
  const [selectedVoices, setSelectedVoices] = useState(['Professional', 'Authoritative', 'Educational']);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchBrandProfile();
        if (res) {
          setProfile(res);
          setBrandName(res.identity?.brandName || 'TrendForge');
          setIndustry(res.identity?.industry || 'AI & Technology');
          setTargetAudience(res.identity?.targetAudience || 'Enterprise Executives');
          setDescription(res.identity?.description || '');
          setSelectedVoices(res.voices || ['Professional', 'Authoritative']);
          setSentenceLength(res.rules?.sentenceLength || 'Concise');
          setFormality(res.rules?.formality || 'High');
          setPreferredCTA(res.rules?.preferredCTA || 'Thought-provoking');
          setCustomInstructions(res.customInstructions || '');
        }
      } catch (err) {
        console.error('Brand profile load error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleVoice = (v) => {
    setSelectedVoices(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotification(null);
    try {
      const updated = await updateBrandProfile({
        identity: { brandName, industry, targetAudience, description },
        voices: selectedVoices,
        rules: { sentenceLength, formality, preferredCTA },
        customInstructions
      });
      setProfile(updated);
      setNotification({ type: 'success', message: '✅ Brand Profile and DNA rules saved successfully!' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Loading Brand Profile settings...</div>;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          {notification.message}
        </div>
      )}

      {/* Brand DNA Panel Preview */}
      <BrandDNAPanel brandProfile={{ identity: { brandName, industry, targetAudience }, voices: selectedVoices, rules: { sentenceLength, preferredCTA } }} matchScore={96} />

      <div className="vw-card space-y-5">
        <div className="vw-card-header border-b border-slate-200 pb-3">
          <h3 className="vw-card-title text-base font-bold flex items-center gap-2">
            <Palette size={18} className="text-blue-600" />
            Brand Identity & Persona Settings
          </h3>
          <span className="vw-badge vw-badge-purple">Controls AI Content Voice</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. TrendForge"
            />
          </div>

          <div>
            <label>Industry / Sector</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. AI & Technology"
            />
          </div>

          <div className="md:col-span-2">
            <label>Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Technology Professionals, Enterprise Founders, Tech Executives"
            />
          </div>

          <div className="md:col-span-2">
            <label>Brand Value Proposition</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of your brand offering..."
            />
          </div>
        </div>

        {/* Brand Voice Chips */}
        <div className="pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Brand Voice Characteristics (Select Multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {voiceOptions.map((v) => {
              const selected = selectedVoices.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  onClick={() => toggleVoice(v)}
                >
                  {selected ? `✓ ${v}` : `+ ${v}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Writing Rules */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Sentence Length & Structure</label>
            <select value={sentenceLength} onChange={(e) => setSentenceLength(e.target.value)}>
              <option value="Short & High-Impact">Short & High-Impact</option>
              <option value="Medium & Concise">Medium & Concise</option>
              <option value="Detailed & Explanatory">Detailed & Explanatory</option>
            </select>
          </div>

          <div>
            <label>Preferred CTA Style</label>
            <select value={preferredCTA} onChange={(e) => setPreferredCTA(e.target.value)}>
              <option value="Thought-provoking call to discussion">Thought-provoking call to discussion</option>
              <option value="Direct invitation to learn more">Direct invitation to learn more</option>
              <option value="Subtle thought leadership conclusion">Subtle thought leadership conclusion</option>
            </select>
          </div>
        </div>

        {/* Free-text Brand Instructions */}
        <div className="pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Custom Brand Instructions (Prompt Guardrails)
          </label>
          <textarea
            rows="3"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Describe specific rules, style preferences, or words to emphasize..."
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button className="vw-btn vw-btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Saving Profile...
              </>
            ) : (
              <>
                <Save size={16} /> Save Brand Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
