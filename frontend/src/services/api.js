const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchTrends(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/trends?${query}`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function fetchTrendById(id) {
  const res = await fetch(`${API_BASE_URL}/trends/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch trend ${id}`);
  return res.json();
}

export async function triggerTrendDiscovery() {
  const res = await fetch(`${API_BASE_URL}/trends/discover`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to discover trends');
  return res.json();
}

export async function fetchContent(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/content?${query}`);
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
}

export async function fetchContentById(id) {
  const res = await fetch(`${API_BASE_URL}/content/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch content ${id}`);
  return res.json();
}

export async function generateGroundedContent(payload) {
  const res = await fetch(`${API_BASE_URL}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate content');
  return res.json();
}

export async function approveContentItem(id) {
  const res = await fetch(`${API_BASE_URL}/content/${id}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to approve content');
  return res.json();
}

export async function scheduleContentItem(id, scheduledTime) {
  const res = await fetch(`${API_BASE_URL}/content/${id}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheduledTime })
  });
  if (!res.ok) throw new Error('Failed to schedule content');
  return res.json();
}

export async function fetchAutomationStatus() {
  const res = await fetch(`${API_BASE_URL}/automation/status`);
  if (!res.ok) throw new Error('Failed to fetch automation status');
  return res.json();
}

export async function triggerDailyWorkflow() {
  const res = await fetch(`${API_BASE_URL}/automation/run`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run daily workflow');
  return res.json();
}

export async function runPublishingCycle() {
  return triggerDailyWorkflow();
}

export async function updateAutomationSettings(settings) {
  const res = await fetch(`${API_BASE_URL}/automation/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update automation settings');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchIntegrations() {
  const res = await fetch(`${API_BASE_URL}/integrations`);
  if (!res.ok) throw new Error('Failed to fetch integrations');
  return res.json();
}
