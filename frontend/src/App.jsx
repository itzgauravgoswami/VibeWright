import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import {
  fetchHealth,
  fetchTrends,
  fetchContent,
  fetchAutomationStatus,
  triggerTrendDiscovery
} from './services/api';
import './App.css';

export default function App() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [automationStatus, setAutomationStatus] = useState(null);
  const [trends, setTrends] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const loadData = async () => {
    try {
      await fetchHealth();
      setBackendOnline(true);

      const [trData, cntData, autData] = await Promise.all([
        fetchTrends(),
        fetchContent(),
        fetchAutomationStatus()
      ]);

      setTrends(trData.trends || []);
      setContentList(cntData.content || []);
      setAutomationStatus(autData || null);
    } catch (err) {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscovery = async () => {
    setIsDiscovering(true);
    try {
      await triggerTrendDiscovery();
      await loadData();
    } catch (err) {
      console.error('Discovery error', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <BrowserRouter>
      <AppRoutes
        backendStatus={backendOnline}
        automationStatus={automationStatus}
        trends={trends}
        contentList={contentList}
        onTriggerDiscovery={handleDiscovery}
        isDiscovering={isDiscovering}
        refreshData={loadData}
      />
    </BrowserRouter>
  );
}
