import React, { useState } from 'react';
import { updateAutomationSettings } from '../services/api';
import BrandProfileTab from './BrandProfileTab';
import { Settings, Bot, Clock, ShieldCheck, CheckCircle2, Palette } from 'lucide-react';

export default function SettingsPage({ automationStatus, refreshData }) {
  const [activeTab, setActiveTab] = useState('brand'); // Default to Brand DNA tab
  const [publishTime, setPublishTime] = useState(automationStatus?.publishTime || '18:00');
  const [minTrendScore, setMinTrendScore] = useState(automationStatus?.minTrendScore || 80);
  const [minEvidenceScore, setMinEvidenceScore] = useState(automationStatus?.minEvidenceScore || 85);
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(automationStatus?.autoPublishEnabled ?? true);
  const [notification, setNotification] = useState('');

  const handleSaveAutomation = async (e) => {
    e.preventDefault();
    try {
      await updateAutomationSettings({
        publishTime,
        minTrendScore,
        minEvidenceScore,
        autoPublishEnabled
      });
      setNotification('✅ System automation settings updated successfully!');
      if (refreshData) refreshData();
    } catch (err) {
      setNotification('Failed to update settings: ' + err.message);
    }
  };

  return (
    <div className="vw-container max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="vw-header-banner">
        <div>
          <h2>System Settings & Brand DNA Configuration</h2>
          <p>Configure persistent Brand Identity rules, Gemini AI models, Weaviate RAG safety thresholds, and Swytchcode daily timers.</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'brand'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('brand')}
        >
          <Palette size={16} /> Brand Profile & DNA Rules
        </button>

        <button
          className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'automation'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('automation')}
        >
          <Clock size={16} /> Swytchcode & AI Automation Controls
        </button>
      </div>

      {activeTab === 'brand' ? (
        <BrandProfileTab />
      ) : (
        <div>
          {notification && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              {notification}
            </div>
          )}

          <form onSubmit={handleSaveAutomation} className="space-y-5">
            {/* Gemini API Card */}
            <div className="vw-card">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                <Bot size={18} className="text-blue-600" />
                Gemini AI Model Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label>Primary LLM Provider</label>
                  <input
                    type="text"
                    disabled
                    className="bg-slate-100 font-semibold"
                    value="Google Gemini API (Primary)"
                  />
                </div>

                <div>
                  <label>Active Model Version</label>
                  <select>
                    <option value="gemini-3.6-flash">Gemini 3.6 Flash (Primary Flagship)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Analysis)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Swytchcode Automation Card */}
            <div className="vw-card">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                <Clock size={18} className="text-purple-600" />
                Swytchcode Publishing Schedule & Safety Controls
              </h3>

              <div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Automated Daily Publishing</div>
                    <div className="text-xs text-slate-500">Automatically publish candidate posts at fixed daily schedule</div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer mb-0"
                    checked={autoPublishEnabled}
                    onChange={(e) => setAutoPublishEnabled(e.target.checked)}
                  />
                </div>

                <div>
                  <label>Daily Fixed Publishing Time</label>
                  <input
                    type="text"
                    value={publishTime}
                    onChange={(e) => setPublishTime(e.target.value)}
                    placeholder="18:00"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  <div>
                    <label className="normal-case text-xs font-bold text-slate-600">
                      Min Trend Score Threshold: <span className="text-blue-600 font-extrabold">{minTrendScore}</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      className="w-full accent-blue-600 mb-0"
                      value={minTrendScore}
                      onChange={(e) => setMinTrendScore(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="normal-case text-xs font-bold text-slate-600">
                      Min Evidence Safety Threshold: <span className="text-emerald-600 font-extrabold">{minEvidenceScore}%</span>
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="95"
                      className="w-full accent-emerald-600 mb-0"
                      value={minEvidenceScore}
                      onChange={(e) => setMinEvidenceScore(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right pt-1">
              <button type="submit" className="vw-btn vw-btn-primary px-7 py-2.5">
                Save System Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
