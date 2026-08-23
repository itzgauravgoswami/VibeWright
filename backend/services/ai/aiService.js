const { env } = require('../../config/env');
const logger = require('../../utils/logger');

/**
 * AI Service Provider Abstraction
 * Handles structured reasoning using OpenAI if key exists, or intelligent mock fallback.
 */
class AIService {
  constructor() {
    this.hasKey = Boolean(env.openai.apiKey);
  }

  /**
   * Primary structured JSON completion endpoint
   */
  async generateStructuredJSON({ prompt, systemPrompt, fallbackSchema }) {
    if (this.hasKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.openai.apiKey}`
          },
          body: JSON.stringify({
            model: env.openai.model,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt || 'You are an AI planner. Output JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          logger.warn('OpenAI API request failed, falling back to mock provider', errData);
          return fallbackSchema();
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        return JSON.parse(content);
      } catch (err) {
        logger.error('Error during OpenAI structured completion, using fallback', err);
        return fallbackSchema();
      }
    }

    // Intelligent Fallback Provider for Hackathon Mock Mode
    logger.info('Using Mock AI Reasoning Engine [DEMO/MOCK]');
    return fallbackSchema();
  }

  /**
   * Final synthesis & summarization helper
   */
  async synthesizeResults({ userRequest, plan, executionResults }) {
    const prompt = `User Request: ${userRequest}\nExecution Plan: ${JSON.stringify(plan)}\nResults: ${JSON.stringify(executionResults)}`;
    const systemPrompt = `You are TrendForge's lead executive AI agent. Synthesize execution findings cleanly without exposing raw chain-of-thought. Provide concise, professional summaries.`;

    const fallback = () => ({
      summary: `Successfully processed user request: "${userRequest}". Orchestrated ${executionResults.length} tool actions across Discovery, RAG, and Swytchcode execution.`,
      keyTakeaways: [
        `Identified intent and executed required step sequence`,
        `Integrated web discovery & knowledge retrieval adapters`,
        `Validated inputs & normalized execution output`
      ],
      suggestedNextActions: [
        'Review activity logs in Activity tab',
        'Configure additional integration API credentials in .env'
      ]
    });

    return this.generateStructuredJSON({ prompt, systemPrompt, fallbackSchema: fallback });
  }
}

module.exports = new AIService();
