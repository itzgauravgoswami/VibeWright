import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';

import DashboardPage from '../pages/Dashboard';
import TrendsPage from '../pages/Trends';
import TrendDetailsPage from '../pages/TrendDetails';
import ContentPage from '../pages/Content';
import ContentDetailsPage from '../pages/ContentDetails';
import RepurposeListPage from '../pages/RepurposeList';
import RepurposeWorkspacePage from '../pages/RepurposeWorkspace';
import RepurposeFormatDetailPage from '../pages/RepurposeFormatDetail';
import CalendarPage from '../pages/Calendar';
import AnalyticsPage from '../pages/Analytics';
import SourcesPage from '../pages/Sources';
import ActivityPage from '../pages/Activity';
import SettingsPage from '../pages/Settings';

export default function AppRoutes({
  backendStatus,
  automationStatus,
  trends,
  contentList,
  onTriggerDiscovery,
  isDiscovering,
  refreshData
}) {
  return (
    <Routes>
      <Route
        element={
          <AppShell
            backendStatus={backendStatus}
            automationStatus={automationStatus}
          />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              trends={trends}
              contentList={contentList}
              automationStatus={automationStatus}
            />
          }
        />
        <Route
          path="/trends"
          element={
            <TrendsPage
              trends={trends}
              onTriggerDiscovery={onTriggerDiscovery}
              isDiscovering={isDiscovering}
            />
          }
        />
        <Route path="/trends/:trendId" element={<TrendDetailsPage />} />
        <Route
          path="/content"
          element={
            <ContentPage
              trends={trends}
              refreshContent={refreshData}
            />
          }
        />
        <Route path="/content/:contentId" element={<ContentDetailsPage />} />
        <Route path="/repurpose" element={<RepurposeListPage trends={trends} />} />
        <Route path="/repurpose/:contentId" element={<RepurposeWorkspacePage />} />
        <Route path="/repurpose/:contentId/:format" element={<RepurposeFormatDetailPage />} />
        <Route
          path="/calendar"
          element={
            <CalendarPage
              contentList={contentList}
              automationStatus={automationStatus}
              refreshData={refreshData}
            />
          }
        />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route
          path="/settings"
          element={
            <SettingsPage
              automationStatus={automationStatus}
              refreshData={refreshData}
            />
          }
        />
        <Route
          path="/settings/brand"
          element={
            <SettingsPage
              automationStatus={automationStatus}
              refreshData={refreshData}
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
