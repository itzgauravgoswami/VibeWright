const trendEngine = require('../services/trends/trendEngine');
const weaviateRAG = require('../services/rag/weaviateRAG');

class TrendController {
  getTrends(req, res, next) {
    try {
      const { category, minScore, search } = req.query;
      const trends = trendEngine.listTrends({ category, minScore, search });
      return res.status(200).json({
        total: trends.length,
        trends
      });
    } catch (err) {
      next(err);
    }
  }

  async getTrendById(req, res, next) {
    try {
      const { id } = req.params;
      const trend = trendEngine.getTrendById(id);
      if (!trend) {
        return res.status(404).json({ error: `Trend with ID '${id}' not found.` });
      }

      // Retrieve associated RAG evidence sources
      const sources = await weaviateRAG.retrieveContext(trend.title, trend.category);

      return res.status(200).json({
        trend,
        sources
      });
    } catch (err) {
      next(err);
    }
  }

  async discoverTrends(req, res, next) {
    try {
      const result = await trendEngine.discoverNewTrends();
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TrendController();
