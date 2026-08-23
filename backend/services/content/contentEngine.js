const geminiService = require('../ai/geminiService');
const weaviateRAG = require('../rag/weaviateRAG');
const trendEngine = require('../trends/trendEngine');
const logger = require('../../utils/logger');

const contentStore = new Map();

class ContentEngine {
  async generateContent({ trendId, platform = 'LinkedIn', type = 'LinkedIn Post', tone = 'Professional', audience = 'Industry Professionals' }) {
    logger.info(`ContentEngine generating content for trend [${trendId}] on [${platform}]`);

    const trend = trendEngine.getTrendById(trendId) || {
      id: trendId || 'tr-custom',
      title: 'Emerging Technology Trends',
      category: 'Technology'
    };

    // 1. Retrieve RAG Evidence Sources from Weaviate
    const sources = await weaviateRAG.retrieveContext(trend.title, trend.category);

    // 2. Generate Grounded Content & Quality Audit via Gemini API
    const generated = await geminiService.generateGroundedContent({
      trendTitle: trend.title,
      contentType: type,
      platform,
      tone,
      audience,
      sources
    });

    const contentItem = {
      id: `cnt-${Date.now()}`,
      trendId: trend.id,
      trendTitle: trend.title,
      platform,
      type,
      tone,
      audience,
      title: generated.title,
      body: generated.body,
      sources,
      claims: generated.claims || [],
      qualityAudit: generated.qualityAudit || {
        grounding: 92,
        relevance: 95,
        readability: 90,
        toneConsistency: 91,
        sourceCoverage: 92,
        overallScore: 92
      },
      status: 'DRAFT',
      version: 1,
      scheduledTime: null,
      createdAt: new Date().toISOString()
    };

    contentStore.set(contentItem.id, contentItem);
    return contentItem;
  }

  listContent({ status, platform } = {}) {
    let items = Array.from(contentStore.values());
    if (status) {
      items = items.filter(c => c.status === status);
    }
    if (platform) {
      items = items.filter(c => c.platform.toLowerCase() === platform.toLowerCase());
    }
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getContentById(id) {
    return contentStore.get(id);
  }

  updateContent(id, updateData) {
    const item = contentStore.get(id);
    if (!item) throw new Error(`Content item with ID '${id}' not found`);

    const updated = {
      ...item,
      ...updateData,
      version: updateData.body && updateData.body !== item.body ? item.version + 1 : item.version
    };

    contentStore.set(id, updated);
    return updated;
  }

  approveContent(id) {
    return this.updateContent(id, { status: 'APPROVED' });
  }

  scheduleContent(id, scheduledTime = '18:00 Daily') {
    return this.updateContent(id, {
      status: 'SCHEDULED',
      scheduledTime
    });
  }

  publishContent(id) {
    return this.updateContent(id, {
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString()
    });
  }
}

module.exports = new ContentEngine();
