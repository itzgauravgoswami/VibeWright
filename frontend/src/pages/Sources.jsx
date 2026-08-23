import React, { useState, useEffect } from 'react';
import { Database, ExternalLink, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/sources')
      .then(res => res.json())
      .then(data => {
        if (data && data.sources) {
          setSources(data.sources);
        }
      })
      .catch(err => console.error('Sources error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vw-container">
      <div className="vw-header-banner">
        <div>
          <h2>Source Knowledge Base & RAG Index</h2>
          <p>Weaviate vector database index status for real-time web discovery & evidence attribution.</p>
        </div>
      </div>

      <div className="vw-card">
        <div className="vw-card-header">
          <h3 className="vw-card-title">
            <Database size={18} className="text-blue-600" />
            Indexed Knowledge Sources ({sources.length})
          </h3>
          <span className="vw-badge vw-badge-purple">Weaviate Vector DB</span>
        </div>
        <div className="vw-card-body p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
              <RefreshCw size={16} className="animate-spin text-blue-600" /> Loading indexed vector sources...
            </div>
          ) : sources.length > 0 ? (
            <table className="vw-table">
              <thead>
                <tr>
                  <th>Source Title</th>
                  <th>Publisher</th>
                  <th>Type</th>
                  <th>Published</th>
                  <th>Vector Status</th>
                  <th>Relevance</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((src) => (
                  <tr key={src.id}>
                    <td className="font-semibold text-slate-900">{src.title}</td>
                    <td className="text-slate-600">{src.publisher}</td>
                    <td><span className="vw-badge vw-badge-primary">{src.type || 'Web Evidence'}</span></td>
                    <td className="text-slate-500">{src.publishedAt}</td>
                    <td>
                      <span className="vw-badge vw-badge-success">
                        <CheckCircle2 size={12} /> Indexed
                      </span>
                    </td>
                    <td className="font-bold text-emerald-600">{src.relevanceScore || 92}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No vector sources currently indexed. Run Trend Discovery to populate fresh knowledge sources!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
