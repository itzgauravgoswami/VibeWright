const aiService = require('../ai/aiService');
const { INTENTS } = require('./schemas');
const logger = require('../../utils/logger');

/**
 * AI Planner
 * Analyzes user request, determines intent, and builds structured execution steps.
 */
class Planner {
  async createPlan(userRequest) {
    logger.info(`Planner analyzing user request: "${userRequest}"`);

    const prompt = `User Request: "${userRequest}"`;
    const systemPrompt = `You are the lead planner for TrendForge AI Agent Orchestration Platform.
Analyze the user request and generate a structured JSON execution plan.
Possible intents:
- RESEARCH_RAG_ANSWER: Research web + vector RAG -> Answer
- DISCOVER_DECIDE_ACT: Discover info -> Decide -> Execute action
- ONE_IDEA_MULTI_OUTPUT: Generate content across multiple channels
- AI_HUMAN_APPROVAL_ACTION: AI drafts action -> Wait for Human Approval -> Execute
- SCHEDULED_WORKFLOW: Schedule -> Research -> Action -> Notification
- KNOWLEDGE_SEARCH: Query GitHub/Drive/Notion + Weaviate RAG -> Answer

Output format JSON:
{
  "intent": "INTENT_NAME",
  "requiresFreshInformation": true/false,
  "requiresKnowledgeRetrieval": true/false,
  "requiresHumanApproval": true/false,
  "planSummary": "Short explanation of the workflow plan",
  "steps": [
    {
      "stepIndex": 1,
      "tool": "discovery.search | rag.retrieve | knowledge.search | communication.send | automation.create | media.process",
      "action": "action_description",
      "input": { ... },
      "requiresApproval": true/false
    }
  ]
}`;

    const fallbackPlan = () => {
      const lowerReq = userRequest.toLowerCase();
      
      // Pattern 4: Human Approval needed
      if (lowerReq.includes('send') || lowerReq.includes('post') || lowerReq.includes('email') || lowerReq.includes('slack') || lowerReq.includes('approve')) {
        return {
          intent: INTENTS.AI_HUMAN_APPROVAL_ACTION,
          requiresFreshInformation: true,
          requiresKnowledgeRetrieval: true,
          requiresHumanApproval: true,
          planSummary: 'Retrieve information, draft response, and await human approval before sending communication.',
          steps: [
            {
              stepIndex: 1,
              tool: 'discovery.search',
              action: 'Search fresh information',
              input: { query: userRequest },
              requiresApproval: false
            },
            {
              stepIndex: 2,
              tool: 'rag.retrieve',
              action: 'Retrieve stored system knowledge',
              input: { query: userRequest },
              requiresApproval: false
            },
            {
              stepIndex: 3,
              tool: 'communication.send',
              action: 'Dispatch notification message',
              input: { channel: 'slack', recipient: '#updates', content: `Summary report for: ${userRequest}` },
              requiresApproval: true
            }
          ]
        };
      }

      // Pattern 6: Knowledge Search & RAG
      if (lowerReq.includes('github') || lowerReq.includes('drive') || lowerReq.includes('notion') || lowerReq.includes('code')) {
        return {
          intent: INTENTS.KNOWLEDGE_SEARCH,
          requiresFreshInformation: false,
          requiresKnowledgeRetrieval: true,
          requiresHumanApproval: false,
          planSummary: 'Query connected knowledge repositories (GitHub, Drive, Notion) and perform Weaviate vector retrieval.',
          steps: [
            {
              stepIndex: 1,
              tool: 'knowledge.search',
              action: 'Query repository knowledge base',
              input: { source: lowerReq.includes('github') ? 'github' : 'notion', query: userRequest },
              requiresApproval: false
            },
            {
              stepIndex: 2,
              tool: 'rag.retrieve',
              action: 'Retrieve Weaviate semantic vectors',
              input: { query: userRequest },
              requiresApproval: false
            }
          ]
        };
      }

      // Pattern 1 & 2 Default: Research -> RAG -> Answer
      return {
        intent: INTENTS.RESEARCH_RAG_ANSWER,
        requiresFreshInformation: true,
        requiresKnowledgeRetrieval: true,
        requiresHumanApproval: false,
        planSummary: 'Discover fresh web insights, retrieve stored RAG context, and synthesize evidence-grounded answer.',
        steps: [
          {
            stepIndex: 1,
            tool: 'discovery.search',
            action: 'Execute web discovery search',
            input: { query: userRequest },
            requiresApproval: false
          },
          {
            stepIndex: 2,
            tool: 'rag.retrieve',
            action: 'Retrieve vector memory context from Weaviate',
            input: { query: userRequest },
            requiresApproval: false
          }
        ]
      };
    };

    return aiService.generateStructuredJSON({
      prompt,
      systemPrompt,
      fallbackSchema: fallbackPlan
    });
  }
}

module.exports = new Planner();
