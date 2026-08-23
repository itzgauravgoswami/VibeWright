const logger = require('../../utils/logger');
const discoveryService = require('../discovery/discoveryService');
const ragService = require('../rag/ragService');
const knowledgeService = require('../knowledge/knowledgeService');
const communicationService = require('../communication/communicationService');
const automationService = require('../automation/automationService');
const mediaService = require('../media/mediaService');

/**
 * Central Tool Registry for TrendForge AI Agent Orchestrator
 */

const registeredTools = new Map();

function registerTool({ id, category, name, description, parameters, requiresApproval = false, handler }) {
  registeredTools.set(id, {
    id,
    category,
    name,
    description,
    parameters,
    requiresApproval,
    handler
  });
}

function getTool(id) {
  return registeredTools.get(id);
}

function listTools() {
  return Array.from(registeredTools.values()).map(t => ({
    id: t.id,
    category: t.category,
    name: t.name,
    description: t.description,
    parameters: t.parameters,
    requiresApproval: t.requiresApproval
  }));
}

function isToolRegistered(id) {
  return registeredTools.has(id);
}

// --- INITIALIZE ALL REGISTERED TOOLS ---

// 1. Discovery Search
registerTool({
  id: 'discovery.search',
  category: 'Discovery',
  name: 'Web Search & Discovery',
  description: 'Searches real-time web sources for fresh information',
  parameters: { query: 'string' },
  handler: async (input) => discoveryService.search(input.query)
});

// 2. Discovery Extract
registerTool({
  id: 'discovery.extract',
  category: 'Discovery',
  name: 'Web Content Extraction',
  description: 'Extracts clean structured markdown content from a URL',
  parameters: { url: 'string' },
  handler: async (input) => discoveryService.extractUrl(input.url)
});

// 3. Vector RAG Retrieval
registerTool({
  id: 'rag.retrieve',
  category: 'RAG',
  name: 'Weaviate Vector Retrieval',
  description: 'Retrieves relevant indexed semantic documents from Weaviate vector store',
  parameters: { query: 'string' },
  handler: async (input) => ragService.retrieve(input.query)
});

// 4. Knowledge Source Search
registerTool({
  id: 'knowledge.search',
  category: 'Knowledge',
  name: 'Knowledge Base Search',
  description: 'Queries Drive, Notion, or GitHub repositories for internal documentation',
  parameters: { source: 'string', query: 'string' },
  handler: async (input) => knowledgeService.searchKnowledge(input)
});

// 5. Communication Send Message
registerTool({
  id: 'communication.send',
  category: 'Communication',
  name: 'Channel Messaging',
  description: 'Sends updates or alerts via Slack, Telegram, Gmail, or Resend',
  parameters: { channel: 'string', recipient: 'string', content: 'string' },
  requiresApproval: true,
  handler: async (input) => communicationService.sendMessage(input)
});

// 6. Automation Create Event / Task
registerTool({
  id: 'automation.create',
  category: 'Automation',
  name: 'Calendar & Task Automation',
  description: 'Schedules calendar events or creates project tasks in Asana',
  parameters: { type: 'calendar|task', title: 'string' },
  requiresApproval: true,
  handler: async (input) => {
    if (input.type === 'calendar') {
      return automationService.createCalendarEvent({ title: input.title, startTime: input.startTime });
    }
    return automationService.createTask({ taskName: input.title, project: input.project });
  }
});

// 7. Media Processing
registerTool({
  id: 'media.process',
  category: 'Media',
  name: 'Cloudinary Media Processing',
  description: 'Optimizes and transforms media assets',
  parameters: { url: 'string', operation: 'string' },
  handler: async (input) => mediaService.processMedia(input)
});

module.exports = {
  registerTool,
  getTool,
  listTools,
  isToolRegistered
};
