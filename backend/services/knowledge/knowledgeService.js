const logger = require('../../utils/logger');
const { env } = require('../../config/env');

/**
 * Knowledge Sources Adapter (GitHub, Drive, Notion)
 */
class KnowledgeService {
  async searchKnowledge({ source, query }) {
    logger.info(`Searching knowledge source [${source}]: "${query}"`);

    return {
      source,
      mode: 'DEMO_MOCK',
      badge: '[DEMO/MOCK]',
      query,
      results: [
        {
          title: `${source.toUpperCase()} Document: ${query} Specifications`,
          id: `ref-${source}-1`,
          snippet: `Found relevant reference in ${source} matching query terms. Verified metadata tags and permissions.`,
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }
}

module.exports = new KnowledgeService();
