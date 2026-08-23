const { env } = require('../../config/env');
const logger = require('../../utils/logger');
const swytchcodeAdapter = require('../swytchcode/swytchcodeAdapter');

/**
 * Web Discovery & Extraction Adapter
 */
class DiscoveryService {
  async search(query, limit = 5) {
    logger.info(`Discovery search: "${query}"`);
    
    if (env.discovery.jinaKey) {
      try {
        const response = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${env.discovery.jinaKey}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          return {
            provider: 'jina',
            mode: 'REAL',
            query,
            results: (data.data || []).slice(0, limit).map(item => ({
              title: item.title || query,
              url: item.url,
              snippet: item.description || item.content?.slice(0, 250),
              retrievedAt: new Date().toISOString()
            }))
          };
        }
      } catch (err) {
        logger.warn('Jina search error, falling back to Swytchcode/Mock discovery', err);
      }
    }

    // Try Swytchcode adapter or Mock
    const swResult = await swytchcodeAdapter.execute('discovery.search', { query, limit });
    return {
      provider: 'discovery_mock',
      mode: 'DEMO_MOCK',
      badge: '[DEMO/MOCK]',
      query,
      results: [
        {
          title: `Real-time Insights on: ${query}`,
          url: `https://discovery.trendforge.dev/search?q=${encodeURIComponent(query)}`,
          snippet: `Emerging trends matching "${query}" evaluated across multiple news & social channels.`
        }
      ],
      sources: [
        {
          id: 'ref-102',
          title: `Web Intelligence Report on ${query}`,
          url: `https://discovery.trendforge.dev/sources/ref-102`,
          snippet: `Extracted structured facts and key parameters related to ${query}.`,
          retrievedAt: new Date().toISOString()
        }
      ]
    };
  }

  async extractUrl(url) {
    logger.info(`Discovery extract URL: "${url}"`);
    return {
      provider: 'firecrawl_mock',
      mode: 'DEMO_MOCK',
      badge: '[DEMO/MOCK]',
      url,
      extractedContent: `Clean markdown content extracted from ${url}. Contains main article body, metadata, and structured headings.`,
      extractedAt: new Date().toISOString()
    };
  }
}

module.exports = new DiscoveryService();
