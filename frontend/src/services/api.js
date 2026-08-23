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

// --- ROUND B: REPURPOSING & BRAND PROFILE APIS ---

export async function fetchRepurposeMasterList() {
  const res = await fetch(`${API_BASE_URL}/repurpose`);
  if (!res.ok) throw new Error('Failed to fetch repurpose master list');
  return res.json();
}

export async function fetchRepurposePackage(contentId) {
  const res = await fetch(`${API_BASE_URL}/repurpose/${contentId}`);
  if (!res.ok) throw new Error(`Failed to fetch repurpose package for ${contentId}`);
  return res.json();
}

export async function generateRepurposedFormats(contentId, formats) {
  const res = await fetch(`${API_BASE_URL}/repurpose/${contentId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formats })
  });
  if (!res.ok) throw new Error('Failed to generate repurposed formats');
  return res.json();
}

export async function regenerateFormat(contentId, format, options = {}) {
  const res = await fetch(`${API_BASE_URL}/repurpose/${contentId}/${format}/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });
  if (!res.ok) throw new Error(`Failed to regenerate format ${format}`);
  return res.json();
}

export async function updateRepurposedFormat(contentId, format, content) {
  const res = await fetch(`${API_BASE_URL}/repurpose/${contentId}/${format}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error(`Failed to update format ${format}`);
  return res.json();
}

export async function scheduleRepurposedPackage(contentId) {
  const res = await fetch(`${API_BASE_URL}/repurpose/${contentId}/schedule`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to schedule repurposed package');
  return res.json();
}

export async function fetchBrandProfile() {
  const res = await fetch(`${API_BASE_URL}/settings/brand`);
  if (!res.ok) throw new Error('Failed to fetch brand profile');
  return res.json();
}

export async function updateBrandProfile(profile) {
  const res = await fetch(`${API_BASE_URL}/settings/brand`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to update brand profile');
  return res.json();
}
