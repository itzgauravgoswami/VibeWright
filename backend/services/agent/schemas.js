/**
 * Agent Execution Schemas and Intent Definitions
 */

const INTENTS = {
  RESEARCH_RAG_ANSWER: 'RESEARCH_RAG_ANSWER',       // Pattern 1: Research -> RAG -> Answer
  DISCOVER_DECIDE_ACT: 'DISCOVER_DECIDE_ACT',       // Pattern 2: Discover -> Decide -> Act
  ONE_IDEA_MULTI_OUTPUT: 'ONE_IDEA_MULTI_OUTPUT',   // Pattern 3: One Idea -> Multiple Outputs
  AI_HUMAN_APPROVAL_ACTION: 'AI_HUMAN_APPROVAL_ACTION', // Pattern 4: AI -> Human Approval -> Action
  SCHEDULED_WORKFLOW: 'SCHEDULED_WORKFLOW',         // Pattern 5: Schedule -> Agent -> Action -> Notify
  KNOWLEDGE_SEARCH: 'KNOWLEDGE_SEARCH'              // Pattern 6: GitHub + Drive + Notion -> Weaviate -> Answer
};

const EXECUTION_STATUS = {
  IDLE: 'IDLE',
  PLANNING: 'PLANNING',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  EXECUTING: 'EXECUTING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED'
};

const STEP_STATUS = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED'
};

module.exports = {
  INTENTS,
  EXECUTION_STATUS,
  STEP_STATUS
};
